"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { pick } from "@/lib/i18n";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { VideoCard } from "@/components/ui/video-card";
import { EmptyState } from "@/components/ui/empty-state";

export type VideoItem = {
  id: string;
  youtubeId: string;
  title_kz: string;
  title_ru: string;
  category: string;
};

export type VideoCategory = { slug: string; name_kz: string; name_ru: string };

export function VideoGrid({
  videos,
  categories,
}: {
  videos: VideoItem[];
  categories: VideoCategory[];
}) {
  const { lang, tr } = useLanguage();
  const [activeCat, setActiveCat] = useState("all");
  const [playing, setPlaying] = useState<VideoItem | null>(null);

  const filtered = useMemo(
    () =>
      activeCat === "all"
        ? videos
        : videos.filter((v) => v.category === activeCat),
    [videos, activeCat]
  );

  const usedCats = categories.filter((c) =>
    videos.some((v) => v.category === c.slug)
  );

  if (videos.length === 0) return <EmptyState />;

  return (
    <div>
      {usedCats.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 no-print">
          <Tab active={activeCat === "all"} onClick={() => setActiveCat("all")} label={tr("common.all")} />
          {usedCats.map((c) => (
            <Tab
              key={c.slug}
              active={activeCat === c.slug}
              onClick={() => setActiveCat(c.slug)}
              label={lang === "ru" ? c.name_ru : c.name_kz}
            />
          ))}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => {
          const cat = categories.find((c) => c.slug === v.category);
          return (
            <VideoCard
              key={v.id}
              onPlay={() => setPlaying(v)}
              video={{
                id: v.id,
                youtubeId: v.youtubeId,
                title: pick(lang, v, "title"),
                categoryLabel: cat
                  ? lang === "ru"
                    ? cat.name_ru
                    : cat.name_kz
                  : undefined,
              }}
            />
          );
        })}
      </div>

      {playing && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPlaying(null)}
        >
          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between text-white">
              <h3 className="font-serif text-lg">{pick(lang, playing, "title")}</h3>
              <button
                onClick={() => setPlaying(null)}
                aria-label={tr("nav.close")}
                className="flex h-9 w-9 items-center justify-center rounded hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={youtubeEmbedUrl(playing.youtubeId)}
                title={pick(lang, playing, "title")}
                className="h-full w-full"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
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
