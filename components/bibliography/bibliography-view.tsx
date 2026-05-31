"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { pick } from "@/lib/i18n";
import { BIBLIOGRAPHY_TYPES } from "@/lib/sections";
import { EmptyState } from "@/components/ui/empty-state";

export type BiblioEntry = {
  id: string;
  author: string;
  title_kz: string;
  title_ru: string;
  year: number | null;
  publisher: string | null;
  type: string;
  notes_kz: string | null;
  notes_ru: string | null;
};

export function BibliographyView({ entries }: { entries: BiblioEntry[] }) {
  const { lang, tr } = useLanguage();
  const [type, setType] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return entries
      .filter((e) => (type === "all" ? true : e.type === type))
      .filter((e) => {
        if (!query) return true;
        return (
          e.author.toLowerCase().includes(query) ||
          e.title_kz.toLowerCase().includes(query) ||
          e.title_ru.toLowerCase().includes(query) ||
          (e.publisher ?? "").toLowerCase().includes(query)
        );
      })
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  }, [entries, type, q]);

  const tabs = [
    { value: "all", label: tr("common.all") },
    ...BIBLIOGRAPHY_TYPES.map((t) => ({
      value: t.value,
      label: lang === "ru" ? t.ru : t.kz,
    })),
  ];

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between no-print">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                type === t.value
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-text-muted hover:border-primary hover:text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tr("search.placeholder")}
            className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
          {filtered.map((e) => {
            const title = pick(lang, e, "title");
            const notes = pick(lang, e, "notes");
            return (
              <li key={e.id} className="p-4">
                <p className="leading-relaxed text-text">
                  <span className="font-medium">{e.author}.</span>{" "}
                  <span className="italic">{title}.</span>{" "}
                  {e.publisher && <span>{e.publisher}, </span>}
                  {e.year && <span>{e.year}.</span>}
                </p>
                {notes && (
                  <p className="mt-1 text-sm text-text-muted">{notes}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
