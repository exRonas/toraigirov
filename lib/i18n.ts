// Bilingual helpers (KZ + RU).

export type Lang = "kz" | "ru";

export const DEFAULT_LANG: Lang = "kz";

export function normalizeLang(value: string | null | undefined): Lang {
  return value === "ru" ? "ru" : "kz";
}

/**
 * Pick the right string for the active language.
 * Usage: t(lang, item.title_kz, item.title_ru)
 */
export function t(lang: Lang, kzText: string, ruText: string): string {
  return lang === "ru" ? ruText : kzText;
}

/** Pick a *_kz / *_ru pair off an object by its field base name. */
export function pick<T extends Record<string, any>>(
  lang: Lang,
  obj: T,
  base: string
): string {
  const v = lang === "ru" ? obj[`${base}_ru`] : obj[`${base}_kz`];
  // Graceful fallback to the other language if one side is empty.
  if (v) return v as string;
  const other = lang === "ru" ? obj[`${base}_kz`] : obj[`${base}_ru`];
  return (other as string) ?? "";
}

const KZ_MONTHS = [
  "қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым",
  "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан",
];

const RU_MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

/** Format a date as "15 мамыр 2024" (kz) / "15 мая 2024" (ru). */
export function formatDate(date: Date | string, lang: Lang): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  const day = d.getDate();
  const month = (lang === "ru" ? RU_MONTHS : KZ_MONTHS)[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}
