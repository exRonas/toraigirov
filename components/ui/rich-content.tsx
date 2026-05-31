"use client";

import { useLanguage } from "@/components/providers/language-provider";

// Renders the language-appropriate HTML body (Tiptap/page content).
export function RichContent({
  kz,
  ru,
  className = "",
}: {
  kz: string;
  ru: string;
  className?: string;
}) {
  const { lang } = useLanguage();
  const html = lang === "ru" ? ru : kz;
  if (!html || !html.trim()) return null;
  return (
    <div
      className={`rich ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
