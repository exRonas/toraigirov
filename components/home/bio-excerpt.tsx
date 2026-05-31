"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function BioExcerpt({ kz, ru }: { kz: string; ru: string }) {
  const { lang, tr, withLang } = useLanguage();
  const text = lang === "ru" ? ru : kz;
  if (!text) return null;

  return (
    <section className="mx-auto max-w-site px-4 py-12">
      <div className="rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
        <h2 className="mb-4 font-serif text-2xl font-bold text-text">
          {tr("home.bioTitle")}
        </h2>
        <p className="text-lg leading-relaxed text-text-muted">{text}</p>
        <Link
          href={withLang("/biography")}
          className="mt-4 inline-flex items-center gap-1 font-medium text-primary hover:text-primary-hover"
        >
          {tr("common.readMore")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
