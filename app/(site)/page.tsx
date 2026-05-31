import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { normalizeLang, pick } from "@/lib/i18n";
import { excerpt } from "@/lib/utils";
import { Hero } from "@/components/home/hero";
import { BioExcerpt } from "@/components/home/bio-excerpt";
import { LatestArticles } from "@/components/home/latest-articles";
import { SectionCards } from "@/components/home/section-cards";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = normalizeLang(searchParams.lang);
  const settings = await getSettings();

  const [bioPage, articles] = await Promise.all([
    prisma.page.findUnique({ where: { slug: "biography" } }),
    prisma.article.findMany({
      where: { isDraft: false },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
  ]);

  const quote = lang === "ru" ? settings.heroQuote_ru : settings.heroQuote_kz;
  const quoteAuthor =
    lang === "ru" ? settings.quoteAuthor_ru : settings.quoteAuthor_kz;

  const bioKz = bioPage ? excerpt(bioPage.content_kz, 320) : "";
  const bioRu = bioPage ? excerpt(bioPage.content_ru, 320) : "";

  const articleData = articles.map((a) => ({
    id: a.id,
    sectionSlug: a.sectionSlug,
    title_kz: a.title_kz,
    title_ru: a.title_ru,
    coverImage: a.coverImage,
    publishedAt: a.publishedAt.toISOString(),
  }));

  return (
    <>
      <Hero quote={quote} quoteAuthor={quoteAuthor} />
      <BioExcerpt kz={bioKz} ru={bioRu} />
      <LatestArticles articles={articleData} />
      <SectionCards />
    </>
  );
}
