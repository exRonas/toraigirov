import { prisma } from "@/lib/db";
import { normalizeLang } from "@/lib/i18n";
import { getSection } from "@/lib/sections";
import { ContentShell } from "@/components/layout/content-shell";
import { LangTitle } from "@/components/ui/lang-title";
import { RichContent } from "@/components/ui/rich-content";
import { ArticleCard } from "@/components/ui/article-card";
import { EmptyState } from "@/components/ui/empty-state";

// Shared renderer for the content-bearing sections (biography, creativity, etc.):
// static page intro + the section's published articles.
export async function SectionPageView({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: { lang?: string };
}) {
  const lang = normalizeLang(searchParams.lang);
  const section = getSection(slug);
  const sectionLabel = section ? (lang === "ru" ? section.ru : section.kz) : slug;

  const [page, articles] = await Promise.all([
    prisma.page.findUnique({ where: { slug } }),
    prisma.article.findMany({
      where: { sectionSlug: slug, isDraft: false },
      orderBy: lang === "ru" ? { title_ru: "asc" } : { title_kz: "asc" },
    }),
  ]);

  const hasIntro =
    !!page && !!(page.content_kz?.trim() || page.content_ru?.trim());

  return (
    <ContentShell breadcrumb={[{ label: sectionLabel }]}>
      <article>
        <LangTitle
          kz={page?.title_kz || section?.kz || slug}
          ru={page?.title_ru || section?.ru || slug}
        />
        {hasIntro && (
          <div className="mt-5 content-md">
            <RichContent kz={page!.content_kz} ru={page!.content_ru} />
          </div>
        )}

        {articles.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {articles.map((a) => (
              <ArticleCard
                key={a.id}
                showSection={false}
                article={{
                  id: a.id,
                  sectionSlug: a.sectionSlug,
                  title_kz: a.title_kz,
                  title_ru: a.title_ru,
                  coverImage: a.coverImage,
                  publishedAt: a.publishedAt.toISOString(),
                }}
              />
            ))}
          </div>
        ) : (
          !hasIntro && <div className="mt-8"><EmptyState /></div>
        )}
      </article>
    </ContentShell>
  );
}
