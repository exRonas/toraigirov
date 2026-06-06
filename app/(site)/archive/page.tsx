import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ContentShell } from "@/components/layout/content-shell";
import { LangTitle } from "@/components/ui/lang-title";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { VideoGrid } from "@/components/archive/video-grid";
import { ArchivePageContent } from "@/components/archive/archive-page-content";
import { sectionMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata({
  searchParams,
}: {
  searchParams: { lang?: string };
}): Metadata {
  return sectionMetadata("archive", searchParams);
}

export default async function ArchivePage() {
  const [photos, categories, videos, page] = await Promise.all([
    prisma.photo.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.photoCategory.findMany(),
    prisma.video.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.page.findUnique({ where: { slug: "archive" } }),
  ]);

  return (
    <ContentShell breadcrumb={[{ label: "Фото, видео – архив" }]}>
      <LangTitle kz="Фото, видео – архив" ru="Фото, видео – архив" />

      <ArchivePageContent
        photos={photos.map((p) => ({
          id: p.id,
          filename: p.filename,
          title_kz: p.title_kz,
          title_ru: p.title_ru,
          altText: p.altText,
          category: p.category,
        }))}
        categories={categories.map((c) => ({
          slug: c.slug,
          name_kz: c.name_kz,
          name_ru: c.name_ru,
        }))}
        videos={videos.map((v) => ({
          id: v.id,
          youtubeId: v.youtubeId,
          videoFile: v.videoFile,
          thumbnail: v.thumbnail,
          title_kz: v.title_kz,
          title_ru: v.title_ru,
          category: v.category,
        }))}
        introKz={page?.content_kz ?? ""}
        introRu={page?.content_ru ?? ""}
      />
    </ContentShell>
  );
}
