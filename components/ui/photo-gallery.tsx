"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useLanguage } from "@/components/providers/language-provider";
import { pick } from "@/lib/i18n";

export type GalleryPhoto = {
  id: string;
  filename: string; // public URL, e.g. /uploads/abc.jpg
  title_kz: string | null;
  title_ru: string | null;
  altText: string | null;
  category: string;
};

export type GalleryCategory = {
  slug: string;
  name_kz: string;
  name_ru: string;
};

export function PhotoGallery({
  photos,
  categories,
}: {
  photos: GalleryPhoto[];
  categories: GalleryCategory[];
}) {
  const { lang, tr } = useLanguage();
  const [activeCat, setActiveCat] = useState<string>("all");
  const [index, setIndex] = useState(-1);

  const filtered = useMemo(
    () =>
      activeCat === "all"
        ? photos
        : photos.filter((p) => p.category === activeCat),
    [photos, activeCat]
  );

  const slides = filtered.map((p) => ({
    src: p.filename,
    title: pick(lang, p, "title") || undefined,
  }));

  // only show category tabs that actually contain photos
  const usedCats = categories.filter((c) =>
    photos.some((p) => p.category === c.slug)
  );

  return (
    <div>
      {usedCats.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 no-print">
          <CatTab
            active={activeCat === "all"}
            onClick={() => setActiveCat("all")}
            label={tr("common.all")}
          />
          {usedCats.map((c) => (
            <CatTab
              key={c.slug}
              active={activeCat === c.slug}
              onClick={() => setActiveCat(c.slug)}
              label={lang === "ru" ? c.name_ru : c.name_kz}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-surface/50 p-8 text-center text-text-muted">
          {tr("common.empty")}
        </p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {filtered.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIndex(i)}
              className="group block w-full break-inside-avoid overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-shadow hover:shadow-card-hover"
            >
              <Image
                src={p.filename}
                alt={p.altText || pick(lang, p, "title") || ""}
                width={500}
                height={350}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              {pick(lang, p, "title") && (
                <p className="p-3 text-sm text-text-muted">
                  {pick(lang, p, "title")}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      <Lightbox
        open={index >= 0}
        index={Math.max(index, 0)}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </div>
  );
}

function CatTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-white"
          : "border-border bg-surface text-text-muted hover:border-primary hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}
