"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { youtubeThumbnail } from "@/lib/youtube";

export type VideoCardData = {
  id: string;
  youtubeId: string;
  title: string;
  categoryLabel?: string;
};

export function VideoCard({
  video,
  onPlay,
}: {
  video: VideoCardData;
  onPlay: () => void;
}) {
  return (
    <button
      onClick={onPlay}
      className="group block w-full overflow-hidden rounded-lg border border-border bg-surface text-left shadow-card transition-shadow hover:shadow-card-hover"
      aria-label={video.title}
    >
      <div className="relative aspect-video overflow-hidden bg-bg">
        <Image
          src={youtubeThumbnail(video.youtubeId)}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/40">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-lg">
            <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
          </span>
        </span>
      </div>
      <div className="p-4">
        {video.categoryLabel && (
          <span className="mb-2 inline-block rounded bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary">
            {video.categoryLabel}
          </span>
        )}
        <h3 className="font-serif text-base font-semibold leading-snug text-text group-hover:text-primary">
          {video.title}
        </h3>
      </div>
    </button>
  );
}
