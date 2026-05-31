"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { pick, formatDate } from "@/lib/i18n";
import { getSection } from "@/lib/sections";

export type ArticleCardData = {
  id: string;
  sectionSlug: string;
  title_kz: string;
  title_ru: string;
  coverImage: string | null;
  publishedAt: string;
};

export function ArticleCard({
  article,
  showSection = true,
}: {
  article: ArticleCardData;
  showSection?: boolean;
}) {
  const { lang, withLang } = useLanguage();
  const title = pick(lang, article, "title");
  const section = getSection(article.sectionSlug);
  const sectionLabel = section ? (lang === "ru" ? section.ru : section.kz) : "";

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-shadow hover:shadow-card-hover">
      <Link href={withLang(`/articles/${article.id}`)} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-bg">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-border">
              <ImageOff className="h-10 w-10" aria-hidden />
            </div>
          )}
        </div>
        <div className="p-4">
          {showSection && sectionLabel && (
            <span className="mb-2 inline-block rounded bg-secondary/15 px-2 py-0.5 text-xs font-medium text-secondary">
              {sectionLabel}
            </span>
          )}
          <h3 className="font-serif text-lg font-semibold leading-snug text-text transition-colors group-hover:text-primary">
            {title}
          </h3>
          <time
            className="mt-2 block text-xs text-text-muted"
            dateTime={article.publishedAt}
          >
            {formatDate(article.publishedAt, lang)}
          </time>
        </div>
      </Link>
    </article>
  );
}
