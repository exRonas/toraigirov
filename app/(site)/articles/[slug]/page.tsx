import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { normalizeLang, pick, formatDate } from "@/lib/i18n";
import { getSection } from "@/lib/sections";
import { ContentShell } from "@/components/layout/content-shell";
import { LangTitle } from "@/components/ui/lang-title";
import { ArticleReader } from "@/components/article/article-reader";
import { RelatedArticles } from "@/components/article/related-articles";

export const dynamic = "force-dynamic";

async function getArticle(id: string) {
  return prisma.article.findUnique({ where: { id } });
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { lang?: string };
}): Promise<Metadata> {
  const lang = normalizeLang(searchParams.lang);
  const article = await getArticle(params.slug);
  if (!article) return { title: "404" };
  return { title: pick(lang, article, "title") };
}

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { lang?: string };
}) {
  const lang = normalizeLang(searchParams.lang);
  const article = await getArticle(params.slug);
  if (!article || article.isDraft) notFound();

  const section = getSection(article.sectionSlug);
  const sectionLabel = section
    ? lang === "ru"
      ? section.ru
      : section.kz
    : article.sectionSlug;
  const sectionHref = section?.href ?? "/articles";
  const title = pick(lang, article, "title");

  const related = await prisma.article.findMany({
    where: {
      sectionSlug: article.sectionSlug,
      isDraft: false,
      id: { not: article.id },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <ContentShell
      breadcrumb={[
        { label: sectionLabel, href: sectionHref },
        { label: title },
      ]}
    >
      <article>
        <LangTitle kz={article.title_kz} ru={article.title_ru} />
        <time
          className="mt-3 block text-sm text-text-muted"
          dateTime={article.publishedAt.toISOString()}
        >
          {formatDate(article.publishedAt, lang)}
        </time>

        {article.coverImage && (
          <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-bg">
            <Image
              src={article.coverImage}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-6">
          <ArticleReader
            shareTitle={title}
            content_kz={article.content_kz}
            content_ru={article.content_ru}
          />
        </div>

        <RelatedArticles
          sectionHref={sectionHref}
          articles={related.map((a) => ({
            id: a.id,
            sectionSlug: a.sectionSlug,
            title_kz: a.title_kz,
            title_ru: a.title_ru,
            coverImage: a.coverImage,
            publishedAt: a.publishedAt.toISOString(),
          }))}
        />
      </article>
    </ContentShell>
  );
}
