import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ContentShell } from "@/components/layout/content-shell";
import { LangTitle } from "@/components/ui/lang-title";
import { ArchiveTabs } from "@/components/archive/archive-tabs";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { sectionMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }: { searchParams: { lang?: string } }): Metadata {
  return sectionMetadata("archive", searchParams);
}

export default async function PhotosPage() {
  const [photos, categories] = await Promise.all([
    prisma.photo.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.photoCategory.findMany(),
  ]);

  return (
    <ContentShell breadcrumb={[{ label: "Фото, видео – архив" }]}>
      <LangTitle kz="Фото, видео – архив" ru="Фото, видео – архив" />
      <div className="mt-6">
        <ArchiveTabs />
        <PhotoGallery
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
        />
      </div>
    </ContentShell>
  );
}
