"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { BIBLIOGRAPHY_TYPES } from "@/lib/sections";
import { ConfirmModal } from "@/components/admin/confirm-modal";

type Entry = {
  id: string; author: string; title_ru: string; title_kz: string;
  year: number | null; type: string;
};

export function BibliographyList() {
  const [items, setItems] = useState<Entry[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<Entry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const sp = new URLSearchParams({ q, type });
    const res = await fetch(`/api/bibliography?${sp}`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }, [q, type]);

  useEffect(() => { load(); }, [load]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    await fetch(`/api/bibliography/${toDelete.id}`, { method: "DELETE" });
    setDeleting(false);
    setToDelete(null);
    load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-text">Библиография</h1>
        <Link href="/admin/bibliography/new" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
          <Plus className="h-4 w-4" /> Добавить
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск…" className="h-9 rounded-md border border-border bg-surface pl-9 pr-3 text-sm" />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} className="h-9 rounded-md border border-border bg-surface px-3 text-sm">
          <option value="">Все типы</option>
          {BIBLIOGRAPHY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.ru}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-text-muted">Ничего не найдено</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-bg text-left text-text-muted">
              <tr><th className="px-4 py-2.5 font-medium">Автор</th><th className="px-4 py-2.5 font-medium">Название</th><th className="hidden px-4 py-2.5 font-medium sm:table-cell">Год</th><th className="px-4 py-2.5"></th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((e) => (
                <tr key={e.id} className="hover:bg-bg/50">
                  <td className="px-4 py-3 text-text">{e.author}</td>
                  <td className="px-4 py-3 italic text-text-muted">{e.title_ru || e.title_kz}</td>
                  <td className="hidden px-4 py-3 text-text-muted sm:table-cell">{e.year ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/bibliography/${e.id}/edit`} className="rounded p-1.5 text-text-muted hover:bg-bg hover:text-primary"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => setToDelete(e)} className="rounded p-1.5 text-text-muted hover:bg-bg hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal open={!!toDelete} message={`Удалить запись «${toDelete?.author}»?`} loading={deleting} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </div>
  );
}
