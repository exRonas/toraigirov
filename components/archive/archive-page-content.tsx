"use client";

import { Images, Film } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { PhotoGallery, type GalleryPhoto, type GalleryCategory } from "@/components/ui/photo-gallery";
import { VideoGrid, type VideoItem, type VideoCategory } from "@/components/archive/video-grid";
import { EmptyState } from "@/components/ui/empty-state";

export function ArchivePageContent({
  photos,
  categories,
  videos,
  introKz,
  introRu,
}: {
  photos: GalleryPhoto[];
  categories: GalleryCategory[];
  videos: VideoItem[];
  introKz: string;
  introRu: string;
}) {
  const { lang } = useLanguage();
  const intro = lang === "ru" ? introRu : introKz;

  return (
    <div className="mt-6 space-y-12">
      {intro && (
        <div
          className="prose max-w-none text-text"
          dangerouslySetInnerHTML={{ __html: intro }}
        />
      )}

      {/* Photos section */}
      <section id="photos">
        <div className="mb-6 flex items-center gap-3 border-b border-border pb-3">
          <Images className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-xl font-semibold text-text">
            {lang === "ru" ? "Фотоархив" : "Фотомұрағат"}
          </h2>
        </div>
        {photos.length === 0 ? (
          <EmptyState />
        ) : (
          <PhotoGallery photos={photos} categories={categories} />
        )}
      </section>

      {/* Videos section */}
      <section id="videos">
        <div className="mb-6 flex items-center gap-3 border-b border-border pb-3">
          <Film className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-xl font-semibold text-text">
            {lang === "ru" ? "Видеоархив" : "Бейнемұрағат"}
          </h2>
        </div>
        <VideoGrid videos={videos} categories={categories} />
      </section>
    </div>
  );
}
