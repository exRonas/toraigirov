"use client";

import { useState, useCallback, useEffect, type DragEvent } from "react";
import Image from "next/image";
import {
  Loader2, Save, Check, UploadCloud, Trash2, Plus, X, Images, Film, FileText,
} from "lucide-react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { extractYouTubeId, youtubeThumbnail } from "@/lib/youtube";

// ─── Types ───────────────────────────────────────────────────────────────────

type PageData = {
  slug: string;
  title_kz: string;
  title_ru: string;
  content_kz: string;
  content_ru: string;
};

type Photo = {
  id: string; filename: string; title_kz: string | null; title_ru: string | null;
  altText: string | null; category: string; sortOrder: number;
};
type Category = { id: string; slug: string; name_kz: string; name_ru: string };
type Video = { id: string; youtubeId?: string | null; videoFile?: string | null; thumbnail?: string | null; title_kz: string; title_ru: string; category: string };

// ─── Main component ───────────────────────────────────────────────────────────

export function ArchiveManager({ initialPage }: { initialPage: PageData }) {
  return (
    <div className="space-y-10">
      <h1 className="font-serif text-2xl font-bold text-text">Фото, видео – архив</h1>

      <Section icon={<FileText className="h-5 w-5" />} title="Вводный текст раздела">
        <TextSection initial={initialPage} />
      </Section>

      <Section icon={<Images className="h-5 w-5" />} title="Фотоархив">
        <PhotoSection />
      </Section>

      <Section icon={<Film className="h-5 w-5" />} title="Видеоархив">
        <VideoSection />
      </Section>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  icon, title, children,
}: {
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <div className="flex items-center gap-2.5 border-b border-border bg-bg px-5 py-3.5">
        <span className="text-primary">{icon}</span>
        <h2 className="font-semibold text-text">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Text editor section ──────────────────────────────────────────────────────

function TextSection({ initial }: { initial: PageData }) {
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof PageData>(k: K, v: PageData[K]) {
    setData((d) => ({ ...d, [k]: v }));
    setSaved(false);
  }

  async function save() {
    setError(""); setSaved(false); setSaving(true);
    try {
      const res = await fetch(`/api/pages/${data.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Ошибка");
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        Этот текст отображается в начале страницы архива над фото и видео.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Заголовок (KZ)</label>
          <input
            value={data.title_kz}
            onChange={(e) => set("title_kz", e.target.value)}
            className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Заголовок (RU)</label>
          <input
            value={data.title_ru}
            onChange={(e) => set("title_ru", e.target.value)}
            className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-text">Содержание</label>
        <RichTextEditor
          valueKz={data.content_kz}
          valueRu={data.content_ru}
          onChangeKz={(html) => set("content_kz", html)}
          onChangeRu={(html) => set("content_ru", html)}
        />
      </div>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Сохранить
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <Check className="h-4 w-4" /> Сохранено
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Photos section ───────────────────────────────────────────────────────────

function PhotoSection() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState("all");
  const [uploadCat, setUploadCat] = useState("general");
  const [uploading, setUploading] = useState(false);
  const [dragover, setDragover] = useState(false);
  const [toDelete, setToDelete] = useState<Photo | null>(null);
  const [newCat, setNewCat] = useState("");

  const load = useCallback(async () => {
    const [pRes, cRes] = await Promise.all([
      fetch("/api/photos"),
      fetch("/api/photo-categories"),
    ]);
    setPhotos((await pRes.json()).items || []);
    setCats((await cRes.json()).items || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", "image");
      const up = await fetch("/api/upload", { method: "POST", body: fd });
      if (!up.ok) continue;
      const { url } = await up.json();
      await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: url, category: uploadCat }),
      });
    }
    setUploading(false);
    load();
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragover(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  async function savePhoto(p: Photo) {
    await fetch(`/api/photos/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title_kz: p.title_kz, title_ru: p.title_ru, altText: p.altText, category: p.category }),
    });
    load();
  }

  async function move(p: Photo, dir: -1 | 1) {
    await fetch(`/api/photos/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sortOrder: p.sortOrder + dir }),
    });
    load();
  }

  async function confirmDelete() {
    if (!toDelete) return;
    await fetch(`/api/photos/${toDelete.id}`, { method: "DELETE" });
    setToDelete(null);
    load();
  }

  async function addCategory() {
    if (!newCat.trim()) return;
    await fetch("/api/photo-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name_ru: newCat, name_kz: newCat }),
    });
    setNewCat("");
    load();
  }

  async function deleteCategory(slug: string) {
    await fetch(`/api/photo-categories/${slug}`, { method: "DELETE" });
    load();
  }

  function update(id: string, patch: Partial<Photo>) {
    setPhotos((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  const filtered = activeCat === "all" ? photos : photos.filter((p) => p.category === activeCat);

  return (
    <div className="space-y-5">
      {/* Categories */}
      <div className="rounded-lg border border-border bg-bg p-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">Категории</p>
        <div className="flex flex-wrap items-center gap-2">
          {cats.map((c) => (
            <span key={c.id} className="flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-sm text-text">
              {c.name_ru}
              {c.slug !== "general" && (
                <button onClick={() => deleteCategory(c.slug)} className="text-text-muted hover:text-red-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          ))}
          <div className="flex items-center gap-1">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              placeholder="Новая категория"
              className="h-8 rounded-md border border-border bg-surface px-2 text-sm"
            />
            <button
              onClick={addCategory}
              className="flex h-8 items-center gap-1 rounded-md bg-primary px-2 text-sm text-white hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Format hint */}
      <div className="rounded-md border border-border/50 bg-bg px-3 py-2 text-xs text-text-muted">
        <span className="font-medium text-text">Допустимые форматы:</span>{" "}
        <strong>JPG, PNG, WEBP</strong> · максимальный размер <strong>10 МБ</strong> на файл
      </div>

      {/* Upload zone */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-text-muted">Загрузить в категорию:</label>
        <select
          value={uploadCat}
          onChange={(e) => setUploadCat(e.target.value)}
          className="h-9 rounded-md border border-border bg-surface px-3 text-sm"
        >
          {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name_ru}</option>)}
        </select>
      </div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
        onDragLeave={() => setDragover(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragover ? "border-primary bg-primary/5" : "border-border bg-bg hover:border-primary"
        }`}
      >
        {uploading
          ? <Loader2 className="h-7 w-7 animate-spin text-primary" />
          : <UploadCloud className="h-7 w-7 text-text-muted" />}
        <span className="mt-2 text-sm text-text-muted">
          Перетащите фотографии или нажмите (можно несколько)
        </span>
        <span className="mt-1 text-xs text-text-muted">JPG, PNG, WEBP · до 10 МБ</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </label>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <FilterTab active={activeCat === "all"} onClick={() => setActiveCat("all")} label="Все" />
        {cats.map((c) => (
          <FilterTab
            key={c.slug}
            active={activeCat === c.slug}
            onClick={() => setActiveCat(c.slug)}
            label={c.name_ru}
          />
        ))}
      </div>

      {/* Photo grid */}
      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-bg p-10 text-center text-sm text-text-muted">
          Нет фотографий
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-lg border border-border bg-bg">
              <div className="relative aspect-[4/3]">
                <Image src={p.filename} alt={p.altText || ""} fill className="object-cover" sizes="280px" />
              </div>
              <div className="space-y-2 p-3">
                <input
                  value={p.title_ru ?? ""}
                  onChange={(e) => update(p.id, { title_ru: e.target.value })}
                  placeholder="Название (RU)"
                  className="h-8 w-full rounded border border-border bg-surface px-2 text-sm"
                />
                <input
                  value={p.title_kz ?? ""}
                  onChange={(e) => update(p.id, { title_kz: e.target.value })}
                  placeholder="Атауы (KZ)"
                  className="h-8 w-full rounded border border-border bg-surface px-2 text-sm"
                />
                <select
                  value={p.category}
                  onChange={(e) => update(p.id, { category: e.target.value })}
                  className="h-8 w-full rounded border border-border bg-surface px-2 text-sm"
                >
                  {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name_ru}</option>)}
                </select>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button onClick={() => move(p, -1)} className="rounded border border-border px-2 py-1 text-xs hover:bg-surface" title="Выше">↑</button>
                    <button onClick={() => move(p, 1)} className="rounded border border-border px-2 py-1 text-xs hover:bg-surface" title="Ниже">↓</button>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => savePhoto(p)}
                      className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs text-white hover:bg-primary-hover"
                    >
                      <Save className="h-3.5 w-3.5" /> Сохранить
                    </button>
                    <button
                      onClick={() => setToDelete(p)}
                      className="rounded border border-border px-2 py-1 text-xs text-red-600 hover:bg-surface"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        message="Удалить фотографию?"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

// ─── Client-side thumbnail extraction ────────────────────────────────────────

function extractThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    video.preload = "metadata";
    video.muted = true;
    video.src = objectUrl;

    video.addEventListener("loadedmetadata", () => {
      // Seek to 10% of duration or max 2 seconds
      video.currentTime = Math.min(2, video.duration * 0.1);
    });

    video.addEventListener("seeked", () => {
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 360;
      const canvas = document.createElement("canvas");
      // Cap at 640px wide, maintain aspect ratio
      canvas.width = Math.min(w, 640);
      canvas.height = Math.round(h * (canvas.width / w));
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(objectUrl); resolve(null); return; }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => { URL.revokeObjectURL(objectUrl); resolve(blob); },
        "image/jpeg",
        0.82
      );
    });

    video.addEventListener("error", () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    });
  });
}

// ─── Videos section ───────────────────────────────────────────────────────────

function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [tab, setTab] = useState<"youtube" | "mp4">("youtube");
  // YouTube fields
  const [url, setUrl] = useState("");
  // MP4 fields
  const [uploading, setUploading] = useState(false);
  const [dragover, setDragover] = useState(false);
  // Shared fields
  const [titleRu, setTitleRu] = useState("");
  const [titleKz, setTitleKz] = useState("");
  const [category, setCategory] = useState("general");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState<Video | null>(null);

  const load = useCallback(async () => {
    const [v, c] = await Promise.all([
      fetch("/api/videos").then((r) => r.json()),
      fetch("/api/photo-categories").then((r) => r.json()),
    ]);
    setVideos(v.items || []);
    setCats(c.items || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const previewId = extractYouTubeId(url);

  async function addYoutube() {
    setError("");
    if (!previewId) { setError("Неверная ссылка YouTube"); return; }
    setSaving(true);
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtubeUrl: url, title_ru: titleRu, title_kz: titleKz, category }),
    });
    setSaving(false);
    if (!res.ok) { setError((await res.json()).error || "Ошибка"); return; }
    setUrl(""); setTitleRu(""); setTitleKz("");
    load();
  }

  async function uploadMp4(file: File) {
    setError("");
    if (file.type !== "video/mp4") { setError("Только MP4-файлы"); return; }
    if (!titleRu && !titleKz) { setError("Введите название видео"); return; }
    setUploading(true);

    // 1. Generate thumbnail from first frame client-side (no server deps)
    let thumbnailUrl: string | undefined;
    const thumbBlob = await extractThumbnail(file);
    if (thumbBlob) {
      const thumbFd = new FormData();
      thumbFd.append("file", new File([thumbBlob], "thumb.jpg", { type: "image/jpeg" }));
      thumbFd.append("kind", "image");
      const thumbUp = await fetch("/api/upload", { method: "POST", body: thumbFd });
      if (thumbUp.ok) thumbnailUrl = (await thumbUp.json()).url;
    }

    // 2. Upload video file
    const fd = new FormData();
    fd.append("file", file);
    fd.append("kind", "video");
    const up = await fetch("/api/upload", { method: "POST", body: fd });
    if (!up.ok) {
      setError((await up.json()).error || "Ошибка загрузки");
      setUploading(false);
      return;
    }
    const { url: videoFile } = await up.json();

    // 3. Save record
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoFile, thumbnail: thumbnailUrl, title_ru: titleRu, title_kz: titleKz, category }),
    });
    setUploading(false);
    if (!res.ok) { setError((await res.json()).error || "Ошибка"); return; }
    setTitleRu(""); setTitleKz("");
    load();
  }

  function onDropMp4(e: DragEvent) {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadMp4(file);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    await fetch(`/api/videos/${toDelete.id}`, { method: "DELETE" });
    setToDelete(null);
    load();
  }

  return (
    <div className="space-y-5">
      {/* Add video form */}
      <div className="rounded-lg border border-border bg-bg p-4">
        {/* Tab switcher */}
        <div className="mb-4 flex gap-1 rounded-lg border border-border bg-surface p-1 w-fit">
          <button
            onClick={() => { setTab("youtube"); setError(""); }}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === "youtube" ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-text"
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => { setTab("mp4"); setError(""); }}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === "mp4" ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-text"
            }`}
          >
            MP4-файл
          </button>
        </div>

        {tab === "youtube" && (
          <div className="space-y-3">
            <div className="rounded-md bg-bg border border-border/50 px-3 py-2 text-xs text-text-muted">
              <span className="font-medium text-text">Допустимый формат:</span>{" "}
              ссылка на YouTube (youtube.com/watch?v=…, youtu.be/…, /shorts/…)
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Ссылка YouTube"
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm sm:col-span-2"
              />
              <input
                value={titleRu}
                onChange={(e) => setTitleRu(e.target.value)}
                placeholder="Название (RU)"
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm"
              />
              <input
                value={titleKz}
                onChange={(e) => setTitleKz(e.target.value)}
                placeholder="Атауы (KZ)"
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm"
              >
                {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name_ru}</option>)}
              </select>
              <button
                onClick={addYoutube}
                disabled={saving}
                className="flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Добавить
              </button>
            </div>
            {previewId && (
              <div className="flex items-center gap-3">
                <Image src={youtubeThumbnail(previewId)} alt="preview" width={120} height={68} className="rounded border border-border" />
                <span className="text-xs text-text-muted">Предпросмотр обложки</span>
              </div>
            )}
          </div>
        )}

        {tab === "mp4" && (
          <div className="space-y-3">
            <div className="rounded-md bg-bg border border-border/50 px-3 py-2 text-xs text-text-muted">
              <span className="font-medium text-text">Допустимый формат:</span>{" "}
              только <strong>MP4</strong> (H.264) · максимальный размер <strong>500 МБ</strong>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={titleRu}
                onChange={(e) => setTitleRu(e.target.value)}
                placeholder="Название (RU) *"
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm"
              />
              <input
                value={titleKz}
                onChange={(e) => setTitleKz(e.target.value)}
                placeholder="Атауы (KZ)"
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm sm:col-span-2"
              >
                {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name_ru}</option>)}
              </select>
            </div>
            <label
              onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
              onDragLeave={() => setDragover(false)}
              onDrop={onDropMp4}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
                dragover ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-primary"
              }`}
            >
              {uploading
                ? <Loader2 className="h-7 w-7 animate-spin text-primary" />
                : <Film className="h-7 w-7 text-text-muted" />}
              <span className="mt-2 text-sm text-text-muted">
                Перетащите MP4-файл или нажмите
              </span>
              <span className="mt-1 text-xs text-text-muted">MP4 · до 500 МБ · сначала введите название</span>
              <input
                type="file"
                accept="video/mp4"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadMp4(f);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        )}

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Video grid */}
      {videos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-bg p-10 text-center text-sm text-text-muted">
          Нет видео
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((v) => (
            <div key={v.id} className="overflow-hidden rounded-lg border border-border bg-bg">
              <div className="relative aspect-video">
                {v.youtubeId ? (
                  <Image src={youtubeThumbnail(v.youtubeId)} alt={v.title_ru} fill className="object-cover" sizes="280px" />
                ) : v.thumbnail ? (
                  <Image src={v.thumbnail} alt={v.title_ru} fill className="object-cover" sizes="280px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/5">
                    <Film className="h-10 w-10 text-primary/30" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-black/50 p-2">
                    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                {v.videoFile && (
                  <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">MP4</span>
                )}
              </div>
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">{v.title_ru || v.title_kz}</p>
                  {v.title_kz && v.title_ru && (
                    <p className="truncate text-xs text-text-muted">{v.title_kz}</p>
                  )}
                </div>
                <button
                  onClick={() => setToDelete(v)}
                  className="shrink-0 rounded p-1.5 text-text-muted hover:bg-surface hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        message="Удалить видео?"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

// ─── Shared filter tab ────────────────────────────────────────────────────────

function FilterTab({
  active, onClick, label,
}: {
  active: boolean; onClick: () => void; label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-white"
          : "border-border bg-bg text-text-muted hover:border-primary hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}
