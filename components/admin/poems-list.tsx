"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { ConfirmModal } from "@/components/admin/confirm-modal";

type Poem = { id: string; title_ru: string; title_kz: string; yearWritten: number | null };

export function PoemsList() {
  const [items, setItems] = useState<Poem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<Poem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/poems?page=${page}`);
    const data = await res.json();
    setItems(data.items || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    await fetch(`/api/poems/${toDelete.id}`, { method: "DELETE" });
    setDeleting(false);
    setToDelete(null);
    load();
  }

  const pages = Math.ceil(total / 15);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-text">Стихи</h1>
        <Link href="/admin/poems/new" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
          <Plus className="h-4 w-4" /> Новый стих
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-text-muted">Пока нет стихов</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-bg text-left text-text-muted">
              <tr><th className="px-4 py-2.5 font-medium">Заголовок</th><th className="hidden px-4 py-2.5 font-medium sm:table-cell">Год</th><th className="px-4 py-2.5"></th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-bg/50">
                  <td className="px-4 py-3 font-medium text-text">{p.title_ru || p.title_kz || "—"}</td>
                  <td className="hidden px-4 py-3 text-text-muted sm:table-cell">{p.yearWritten ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/poems/${p.id}/edit`} className="rounded p-1.5 text-text-muted hover:bg-bg hover:text-primary"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => setToDelete(p)} className="rounded p-1.5 text-text-muted hover:bg-bg hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-4 flex justify-center gap-1">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`h-8 w-8 rounded text-sm ${p === page ? "bg-primary text-white" : "border border-border bg-surface hover:bg-bg"}`}>{p}</button>
          ))}
        </div>
      )}

      <ConfirmModal open={!!toDelete} message={`Удалить стих «${toDelete?.title_ru || toDelete?.title_kz}»?`} loading={deleting} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </div>
  );
}
