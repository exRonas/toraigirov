"use client";

import { useLanguage } from "@/components/providers/language-provider";

// Generic language-aware text (h1 by default).
export function LangTitle({
  kz,
  ru,
  as: Tag = "h1",
  className = "font-serif text-3xl font-bold text-text sm:text-4xl",
}: {
  kz: string;
  ru: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  className?: string;
}) {
  const { lang } = useLanguage();
  return <Tag className={className}>{lang === "ru" ? ru : kz}</Tag>;
}
