"use client";

import { useEffect, useState, useCallback, type DragEvent } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, Loader2, Plus, X, Save } from "lucide-react";
import { ConfirmModal } from "@/components/admin/confirm-modal";

type Photo = {
  id: string; filename: string; title_kz: string | null; title_ru: string | null;
  altText: string | null; category: string; sortOrder: number;
};
type Category = { id: string; slug: string; name_kz: string; name_ru: string };

export function PhotosManager() {
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
    const p = await pRes.json();
    const c = await cRes.json();
    setPhotos(p.items || []);
    setCats(c.items || []);
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

  const filtered = activeCat === "all" ? photos : photos.filter((p) => p.category === activeCat);

  function update(id: string, patch: Partial<Photo>) {
    setPhotos((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  return (
    <div>
      <h1 className="mb-4 font-serif text-2xl font-bold text-text">Фотоархив</h1>

      {/* Category management */}
      <div className="mb-4 rounded-lg border border-border bg-surface p-4">
        <p className="mb-2 text-sm font-medium text-text">Категории</p>
        <div className="flex flex-wrap items-center gap-2">
          {cats.map((c) => (
            <span key={c.id} className="flex items-center gap-1 rounded-full border border-border bg-bg px-3 py-1 text-sm">
              {c.name_ru}
              {c.slug !== "general" && (
                <button onClick={() => deleteCategory(c.slug)} className="text-text-muted hover:text-red-600"><X className="h-3.5 w-3.5" /></button>
              )}
            </span>
          ))}
          <div className="flex items-center gap-1">
            <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Новая категория" className="h-8 rounded-md border border-border bg-bg px-2 text-sm" />
            <button onClick={addCategory} className="flex h-8 items-center gap-1 rounded-md bg-primary px-2 text-sm text-white hover:bg-primary-hover"><Plus className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Upload */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-text-muted">Загрузить в категорию:</label>
        <select value={uploadCat} onChange={(e) => setUploadCat(e.target.value)} className="h-9 rounded-md border border-border bg-surface px-3 text-sm">
          {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name_ru}</option>)}
        </select>
      </div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
        onDragLeave={() => setDragover(false)}
        onDrop={onDrop}
        className={`mb-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center ${dragover ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-primary"}`}
      >
        {uploading ? <Loader2 className="h-7 w-7 animate-spin text-primary" /> : <UploadCloud className="h-7 w-7 text-text-muted" />}
        <span className="mt-2 text-sm text-text-muted">Перетащите изображения или нажмите (можно несколько)</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
      </label>

      {/* Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Tab active={activeCat === "all"} onClick={() => setActiveCat("all")} label="Все" />
        {cats.map((c) => <Tab key={c.slug} active={activeCat === c.slug} onClick={() => setActiveCat(c.slug)} label={c.name_ru} />)}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-surface/50 p-10 text-center text-text-muted">Нет фотографий</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="relative aspect-[4/3] bg-bg">
                <Image src={p.filename} alt={p.altText || ""} fill className="object-cover" sizes="300px" />
              </div>
              <div className="space-y-2 p-3">
                <input value={p.title_ru ?? ""} onChange={(e) => update(p.id, { title_ru: e.target.value })} placeholder="Название (RU)" className="h-8 w-full rounded border border-border bg-bg px-2 text-sm" />
                <input value={p.title_kz ?? ""} onChange={(e) => update(p.id, { title_kz: e.target.value })} placeholder="Атауы (KZ)" className="h-8 w-full rounded border border-border bg-bg px-2 text-sm" />
                <select value={p.category} onChange={(e) => update(p.id, { category: e.target.value })} className="h-8 w-full rounded border border-border bg-bg px-2 text-sm">
                  {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name_ru}</option>)}
                </select>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button onClick={() => move(p, -1)} className="rounded border border-border px-2 py-1 text-xs hover:bg-bg" title="Выше">↑</button>
                    <button onClick={() => move(p, 1)} className="rounded border border-border px-2 py-1 text-xs hover:bg-bg" title="Ниже">↓</button>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => savePhoto(p)} className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs text-white hover:bg-primary-hover"><Save className="h-3.5 w-3.5" /> Сохранить</button>
                    <button onClick={() => setToDelete(p)} className="rounded border border-border px-2 py-1 text-xs text-red-600 hover:bg-bg"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal open={!!toDelete} message="Удалить фотографию?" onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </div>
  );
}

function Tab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${active ? "border-primary bg-primary text-white" : "border-border bg-surface text-text-muted hover:border-primary"}`}>{label}</button>
  );
}
