"use client";

import Link from "next/link";
import {
  User, Feather, Newspaper, BookOpen, MapPin, Palette,
  Mountain, Library, Images, ScrollText, ArrowRight, type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { SECTIONS } from "@/lib/sections";

const ICONS: Record<string, LucideIcon> = {
  User, Feather, Newspaper, BookOpen, MapPin, Palette,
  Mountain, Library, Images, ScrollText,
};

export function SectionCards() {
  const { lang, tr, withLang } = useLanguage();
  return (
    <section className="mx-auto max-w-site px-4 py-12">
      <h2 className="mb-6 font-serif text-2xl font-bold text-text sm:text-3xl">
        {tr("home.sections")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SECTIONS.map((s) => {
          const Icon = ICONS[s.icon] ?? BookOpen;
          return (
            <Link
              key={s.slug}
              href={withLang(s.href)}
              className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-base font-semibold leading-snug text-text group-hover:text-primary">
                  {lang === "ru" ? s.ru : s.kz}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
