"use client";

import { useLanguage } from "@/components/providers/language-provider";

export function AudioPlayer({ src }: { src: string }) {
  const { tr } = useLanguage();
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <p className="mb-2 text-sm font-medium text-text-muted">
        {tr("poems.listenAudio")}
      </p>
      <audio controls preload="none" className="w-full" src={src}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
