import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ContentShell } from "@/components/layout/content-shell";
import { LangTitle } from "@/components/ui/lang-title";
import { RichContent } from "@/components/ui/rich-content";
import { BibliographyView } from "@/components/bibliography/bibliography-view";
import { sectionMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }: { searchParams: { lang?: string } }): Metadata {
  return sectionMetadata("bibliography", searchParams);
}

export default async function BibliographyPage() {
  const [page, entries] = await Promise.all([
    prisma.page.findUnique({ where: { slug: "bibliography" } }),
    prisma.bibliographyEntry.findMany({ orderBy: { year: "desc" } }),
  ]);

  return (
    <ContentShell breadcrumb={[{ label: page?.title_ru ?? "Библиография" }]}>
      <LangTitle
        kz={page?.title_kz || "Библиография"}
        ru={page?.title_ru || "Библиография"}
      />
      {page && (page.content_kz?.trim() || page.content_ru?.trim()) && (
        <div className="mt-4 content-md">
          <RichContent kz={page.content_kz} ru={page.content_ru} />
        </div>
      )}
      <div className="mt-8">
        <BibliographyView
          entries={entries.map((e) => ({
            id: e.id,
            author: e.author,
            title_kz: e.title_kz,
            title_ru: e.title_ru,
            year: e.year,
            publisher: e.publisher,
            type: e.type,
            notes_kz: e.notes_kz,
            notes_ru: e.notes_ru,
          }))}
        />
      </div>
    </ContentShell>
  );
}
