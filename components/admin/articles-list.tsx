"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { SECTIONS, getSection } from "@/lib/sections";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { formatDate } from "@/lib/i18n";

type Article = {
  id: string;
  sectionSlug: string;
  title_ru: string;
  title_kz: string;
  isDraft: boolean;
  publishedAt: string;
};

export function ArticlesList() {
  const [items, setItems] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [section, setSection] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const sp = new URLSearchParams({ page: String(page), q, section, status });
    const res = await fetch(`/api/articles?${sp}`);
    const data = await res.json();
    setItems(data.items || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, q, section, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    await fetch(`/api/articles/${toDelete.id}`, { method: "DELETE" });
    setDeleting(false);
    setToDelete(null);
    load();
  }

  const pages = Math.ceil(total / 10);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-bold text-text">Статьи</h1>
        <Link href="/admin/articles/new" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
          <Plus className="h-4 w-4" /> Новая статья
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Поиск…"
            className="h-9 rounded-md border border-border bg-surface pl-9 pr-3 text-sm"
          />
        </div>
        <select value={section} onChange={(e) => { setSection(e.target.value); setPage(1); }} className="h-9 rounded-md border border-border bg-surface px-3 text-sm">
          <option value="">Все разделы</option>
          {SECTIONS.map((s) => <option key={s.slug} value={s.slug}>{s.ru}</option>)}
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="h-9 rounded-md border border-border bg-surface px-3 text-sm">
          <option value="all">Все статусы</option>
          <option value="published">Опубликованные</option>
          <option value="draft">Черновики</option>
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
              <tr>
                <th className="px-4 py-2.5 font-medium">Заголовок</th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Раздел</th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Статус</th>
                <th className="hidden px-4 py-2.5 font-medium md:table-cell">Дата</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((a) => (
                <tr key={a.id} className="hover:bg-bg/50">
                  <td className="px-4 py-3 font-medium text-text">{a.title_ru || a.title_kz || "—"}</td>
                  <td className="hidden px-4 py-3 text-text-muted sm:table-cell">{getSection(a.sectionSlug)?.ru ?? a.sectionSlug}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className={`rounded px-2 py-0.5 text-xs ${a.isDraft ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                      {a.isDraft ? "Черновик" : "Опубликовано"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-text-muted md:table-cell">{formatDate(a.publishedAt, "ru")}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/articles/${a.id}/edit`} className="rounded p-1.5 text-text-muted hover:bg-bg hover:text-primary" title="Редактировать"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => setToDelete(a)} className="rounded p-1.5 text-text-muted hover:bg-bg hover:text-red-600" title="Удалить"><Trash2 className="h-4 w-4" /></button>
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

      <ConfirmModal
        open={!!toDelete}
        message={`Удалить статью «${toDelete?.title_ru || toDelete?.title_kz}»?`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
