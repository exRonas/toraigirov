"use client";

import Link from "next/link";
import { ScrollText } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { pick } from "@/lib/i18n";

export type PoemCardData = {
  id: string;
  title_kz: string;
  title_ru: string;
  text_kz: string;
  text_ru: string;
  yearWritten: number | null;
};

export function PoemCard({ poem }: { poem: PoemCardData }) {
  const { lang, tr, withLang } = useLanguage();
  const title = pick(lang, poem, "title");
  const text = pick(lang, poem, "text");
  const firstLines = text
    .split("\n")
    .filter((l) => l.trim())
    .slice(0, 2);

  return (
    <Link
      href={withLang(`/poems/${poem.id}`)}
      className="group flex flex-col rounded-lg border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
    >
      <ScrollText className="mb-3 h-6 w-6 text-secondary" aria-hidden />
      <h3 className="font-serif text-lg font-semibold text-text group-hover:text-primary">
        {title}
      </h3>
      <div className="mt-2 space-y-0.5 font-serif italic leading-relaxed text-text-muted">
        {firstLines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
      {poem.yearWritten && (
        <span className="mt-3 text-xs text-text-muted">
          {tr("poems.year")}: {poem.yearWritten}
        </span>
      )}
    </Link>
  );
}
