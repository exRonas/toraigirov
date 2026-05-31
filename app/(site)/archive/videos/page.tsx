import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ContentShell } from "@/components/layout/content-shell";
import { LangTitle } from "@/components/ui/lang-title";
import { ArchiveTabs } from "@/components/archive/archive-tabs";
import { VideoGrid } from "@/components/archive/video-grid";
import { sectionMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }: { searchParams: { lang?: string } }): Metadata {
  return sectionMetadata("archive", searchParams);
}

export default async function VideosPage() {
  const [videos, categories] = await Promise.all([
    prisma.video.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.photoCategory.findMany(),
  ]);

  return (
    <ContentShell breadcrumb={[{ label: "Фото, видео – архив" }]}>
      <LangTitle kz="Фото, видео – архив" ru="Фото, видео – архив" />
      <div className="mt-6">
        <ArchiveTabs />
        <VideoGrid
          videos={videos.map((v) => ({
            id: v.id,
            youtubeId: v.youtubeId,
            title_kz: v.title_kz,
            title_ru: v.title_ru,
            category: v.category,
          }))}
          categories={categories.map((c) => ({
            slug: c.slug,
            name_kz: c.name_kz,
            name_ru: c.name_ru,
          }))}
        />
      </div>
    </ContentShell>
  );
}
