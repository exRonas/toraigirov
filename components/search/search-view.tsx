"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { getSection } from "@/lib/sections";
import type { SearchHit, DocType } from "@/lib/search-index";

const TYPE_TABS: { value: string; key: string }[] = [
  { value: "all", key: "search.typeAll" },
  { value: "article", key: "search.typeArticles" },
  { value: "poem", key: "search.typePoems" },
  { value: "bibliography", key: "search.typeBibliography" },
  { value: "page", key: "search.typePages" },
];

function hrefFor(hit: SearchHit, lang: string): string {
  const l = `lang=${lang}`;
  switch (hit.docType) {
    case "article":
      return `/articles/${hit.docId}?${l}`;
    case "poem":
      return `/poems/${hit.docId}?${l}`;
    case "page": {
      const s = getSection(hit.slug);
      return `${s?.href ?? "/"}?${l}`;
    }
    case "bibliography":
      return `/bibliography?${l}`;
    default:
      return `/?${l}`;
  }
}

export function SearchView({
  hits,
  q,
  type,
}: {
  hits: SearchHit[];
  q: string;
  type: string;
}) {
  const { lang, tr } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState(q);

  function submit(e: FormEvent) {
    e.preventDefault();
    const v = query.trim();
    if (v) router.push(`/search?q=${encodeURIComponent(v)}&type=${type}&lang=${lang}`);
  }

  function setType(next: string) {
    router.push(`/search?q=${encodeURIComponent(q)}&type=${next}&lang=${lang}`);
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-text">{tr("search.title")}</h1>

      <form onSubmit={submit} className="relative mt-5 max-w-xl" role="search">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tr("search.placeholder")}
          className="h-12 w-full rounded-md border border-border bg-surface pl-10 pr-4 text-base outline-none focus:border-primary"
        />
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        {TYPE_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              type === t.value
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-text-muted hover:border-primary hover:text-primary"
            }`}
          >
            {tr(t.key)}
          </button>
        ))}
      </div>

      {q && (
        <p className="mt-6 text-sm text-text-muted">
          {tr("search.resultsFor")}: <span className="font-medium text-text">«{q}»</span> — {hits.length}
        </p>
      )}

      {q && hits.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-border bg-surface/50 p-10 text-center">
          <p className="font-serif text-lg text-text">{tr("search.noResults")}</p>
          <p className="mt-2 text-sm text-text-muted">{tr("search.noResultsHint")}</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {hits.map((hit) => {
            const title = lang === "ru" ? hit.title_ru : hit.title_kz;
            const snippet = lang === "ru" ? hit.snippet_ru : hit.snippet_kz;
            const typeLabel = tr(
              TYPE_TABS.find((t) => t.value === hit.docType)?.key ?? "search.typeAll"
            );
            return (
              <li key={`${hit.docType}-${hit.docId}`}>
                <Link
                  href={hrefFor(hit, lang)}
                  className="block rounded-lg border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <span className="mb-1 inline-block rounded bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary">
                    {typeLabel}
                  </span>
                  <h2 className="font-serif text-lg font-semibold text-text">
                    {title || "—"}
                  </h2>
                  {snippet && (
                    <p
                      className="mt-1 text-sm text-text-muted [&_mark]:bg-secondary/30 [&_mark]:text-text"
                      dangerouslySetInnerHTML={{ __html: snippet }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
