import type { Metadata } from "next";
import { normalizeLang } from "@/lib/i18n";
import { getSection } from "@/lib/sections";

export function sectionMetadata(
  slug: string,
  searchParams: { lang?: string }
): Metadata {
  const lang = normalizeLang(searchParams.lang);
  const section = getSection(slug);
  const title = section ? (lang === "ru" ? section.ru : section.kz) : slug;
  const desc =
    lang === "ru"
      ? `${title} — материалы виртуальной энциклопедии о Султанмахмуте Торайгырове.`
      : `${title} — Сұлтанмахмұт Торайғыров туралы виртуалды энциклопедия материалдары.`;
  return { title, description: desc };
}
