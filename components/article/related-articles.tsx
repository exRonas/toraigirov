"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { ArticleCard, type ArticleCardData } from "@/components/ui/article-card";

export function RelatedArticles({
  articles,
  sectionHref,
}: {
  articles: ArticleCardData[];
  sectionHref: string;
}) {
  const { tr, withLang } = useLanguage();
  return (
    <div className="mt-10 border-t border-border pt-6 no-print">
      <Link
        href={withLang(sectionHref)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
      >
        <ArrowLeft className="h-4 w-4" />
        {tr("common.backTo")}
      </Link>

      {articles.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-4 font-serif text-xl font-bold text-text">
            {tr("related.title")}
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} showSection={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
