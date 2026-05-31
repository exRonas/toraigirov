import type { Metadata } from "next";
import { ContentShell } from "@/components/layout/content-shell";
import { SearchView } from "@/components/search/search-view";
import { searchIndex, type DocType, type SearchHit } from "@/lib/search-index";
import { normalizeLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }: { searchParams: { lang?: string; q?: string } }): Metadata {
  const lang = normalizeLang(searchParams.lang);
  const title = lang === "ru" ? "Поиск" : "Іздеу";
  return { title: searchParams.q ? `${title}: ${searchParams.q}` : title };
}

const VALID_TYPES: DocType[] = ["article", "poem", "bibliography", "page"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string; lang?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const type = searchParams.type ?? "all";
  const docType = VALID_TYPES.includes(type as DocType)
    ? (type as DocType)
    : undefined;

  let hits: SearchHit[] = [];
  if (q) {
    try {
      hits = await searchIndex(q, docType);
    } catch {
      hits = [];
    }
  }

  return (
    <ContentShell breadcrumb={[{ label: "Поиск / Іздеу" }]}>
      <SearchView hits={hits} q={q} type={type} />
    </ContentShell>
  );
}
