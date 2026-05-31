import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ContentShell } from "@/components/layout/content-shell";
import { LangTitle } from "@/components/ui/lang-title";
import { RichContent } from "@/components/ui/rich-content";
import { PoemList } from "@/components/poems/poem-list";
import { sectionMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }: { searchParams: { lang?: string } }): Metadata {
  return sectionMetadata("poems", searchParams);
}

export default async function PoemsPage() {
  const [page, poems] = await Promise.all([
    prisma.page.findUnique({ where: { slug: "poems" } }),
    prisma.poem.findMany({ orderBy: [{ yearWritten: "asc" }, { createdAt: "asc" }] }),
  ]);

  return (
    <ContentShell breadcrumb={[{ label: page?.title_ru ?? "Стихи" }]}>
      <LangTitle
        kz={page?.title_kz || "Өлеңдері"}
        ru={page?.title_ru || "Стихи"}
      />
      {page && (page.content_kz?.trim() || page.content_ru?.trim()) && (
        <div className="mt-4 content-md">
          <RichContent kz={page.content_kz} ru={page.content_ru} />
        </div>
      )}
      <div className="mt-8">
        <PoemList
          poems={poems.map((p) => ({
            id: p.id,
            title_kz: p.title_kz,
            title_ru: p.title_ru,
            text_kz: p.text_kz,
            text_ru: p.text_ru,
            yearWritten: p.yearWritten,
          }))}
        />
      </div>
    </ContentShell>
  );
}
