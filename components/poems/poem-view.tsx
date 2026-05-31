"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { pick } from "@/lib/i18n";
import { ShareButtons } from "@/components/ui/share-buttons";
import { AudioPlayer } from "@/components/ui/audio-player";
import type { Lang } from "@/lib/i18n";

export type PoemViewData = {
  title_kz: string;
  title_ru: string;
  text_kz: string;
  text_ru: string;
  yearWritten: number | null;
  audioFile: string | null;
};

export function PoemView({ poem }: { poem: PoemViewData }) {
  const { lang, tr } = useLanguage();
  const [tab, setTab] = useState<Lang>(lang);

  const title = pick(lang, poem, "title");
  const text = tab === "ru" ? poem.text_ru : poem.text_kz;

  const tabs: { value: Lang; label: string }[] = [
    { value: "kz", label: tr("poems.kzVersion") },
    { value: "ru", label: tr("poems.ruVersion") },
  ];

  return (
    <div className="mx-auto max-w-[680px]">
      <h1 className="text-center font-serif text-3xl font-bold text-text sm:text-4xl">
        {title}
      </h1>
      {poem.yearWritten && (
        <p className="mt-2 text-center text-sm text-text-muted">
          {tr("poems.year")}: {poem.yearWritten}
        </p>
      )}

      <div className="mt-6 flex justify-center gap-2 no-print">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            aria-pressed={tab === t.value}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.value
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-text-muted hover:border-primary hover:text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 whitespace-pre-line text-center font-serif text-lg leading-[2] text-text">
        {text || <span className="text-text-muted">—</span>}
      </div>

      {poem.audioFile && (
        <div className="mx-auto mt-8 max-w-md">
          <AudioPlayer src={poem.audioFile} />
        </div>
      )}

      <div className="mt-8 flex justify-center border-t border-border pt-5">
        <ShareButtons title={title} />
      </div>
    </div>
  );
}
