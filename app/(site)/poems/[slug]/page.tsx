import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { normalizeLang, pick } from "@/lib/i18n";
import { ContentShell } from "@/components/layout/content-shell";
import { PoemView } from "@/components/poems/poem-view";

export const dynamic = "force-dynamic";

async function getPoem(id: string) {
  return prisma.poem.findUnique({ where: { id } });
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { lang?: string };
}): Promise<Metadata> {
  const lang = normalizeLang(searchParams.lang);
  const poem = await getPoem(params.slug);
  if (!poem) return { title: "404" };
  return { title: pick(lang, poem, "title") };
}

export default async function PoemPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { lang?: string };
}) {
  const lang = normalizeLang(searchParams.lang);
  const poem = await getPoem(params.slug);
  if (!poem) notFound();

  const title = pick(lang, poem, "title");
  const poemsLabel = lang === "ru" ? "Стихи" : "Өлеңдері";

  return (
    <ContentShell
      breadcrumb={[
        { label: poemsLabel, href: "/poems" },
        { label: title },
      ]}
    >
      <PoemView
        poem={{
          title_kz: poem.title_kz,
          title_ru: poem.title_ru,
          text_kz: poem.text_kz,
          text_ru: poem.text_ru,
          yearWritten: poem.yearWritten,
          audioFile: poem.audioFile,
        }}
      />
    </ContentShell>
  );
}
