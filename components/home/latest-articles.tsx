"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { ArticleCard, type ArticleCardData } from "@/components/ui/article-card";

export function LatestArticles({ articles }: { articles: ArticleCardData[] }) {
  const { tr, withLang } = useLanguage();
  if (articles.length === 0) return null;

  return (
    <section className="bg-surface/40 py-12">
      <div className="mx-auto max-w-site px-4">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-serif text-2xl font-bold text-text sm:text-3xl">
            {tr("home.latestArticles")}
          </h2>
          <Link
            href={withLang("/articles")}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
          >
            {tr("common.all")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
