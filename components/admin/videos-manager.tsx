"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { extractYouTubeId, youtubeThumbnail } from "@/lib/youtube";
import { ConfirmModal } from "@/components/admin/confirm-modal";

type Video = { id: string; youtubeId: string; title_kz: string; title_ru: string; category: string };
type Category = { slug: string; name_ru: string; name_kz: string };

export function VideosManager() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [url, setUrl] = useState("");
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

  async function add() {
    setError("");
    if (!extractYouTubeId(url)) { setError("Неверная ссылка YouTube"); return; }
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

  async function confirmDelete() {
    if (!toDelete) return;
    await fetch(`/api/videos/${toDelete.id}`, { method: "DELETE" });
    setToDelete(null);
    load();
  }

  return (
    <div>
      <h1 className="mb-4 font-serif text-2xl font-bold text-text">Видеоархив</h1>

      <div className="mb-6 rounded-lg border border-border bg-surface p-4">
        <p className="mb-3 font-medium text-text">Добавить видео</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Ссылка YouTube (youtu.be/…, watch?v=…)" className="h-10 rounded-md border border-border bg-bg px-3 text-sm sm:col-span-2" />
          <input value={titleRu} onChange={(e) => setTitleRu(e.target.value)} placeholder="Название (RU)" className="h-10 rounded-md border border-border bg-bg px-3 text-sm" />
          <input value={titleKz} onChange={(e) => setTitleKz(e.target.value)} placeholder="Атауы (KZ)" className="h-10 rounded-md border border-border bg-bg px-3 text-sm" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-md border border-border bg-bg px-3 text-sm">
            {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name_ru}</option>)}
          </select>
          <button onClick={add} disabled={saving} className="flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Добавить
          </button>
        </div>
        {previewId && (
          <div className="mt-3 flex items-center gap-3">
            <Image src={youtubeThumbnail(previewId)} alt="preview" width={120} height={68} className="rounded border border-border" />
            <span className="text-xs text-text-muted">Предпросмотр обложки</span>
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {videos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-surface/50 p-10 text-center text-text-muted">Нет видео</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <div key={v.id} className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="relative aspect-video bg-bg">
                <Image src={youtubeThumbnail(v.youtubeId)} alt={v.title_ru} fill className="object-cover" sizes="300px" />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="min-w-0 truncate text-sm text-text">{v.title_ru || v.title_kz || v.youtubeId}</span>
                <button onClick={() => setToDelete(v)} className="rounded p-1.5 text-text-muted hover:bg-bg hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={!!toDelete} message="Удалить видео?" onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </div>
  );
}
