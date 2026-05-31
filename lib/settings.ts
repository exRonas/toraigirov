import { prisma } from "@/lib/db";

export type Settings = {
  heroQuote_kz: string;
  heroQuote_ru: string;
  quoteAuthor_kz: string;
  quoteAuthor_ru: string;
  siteTitle_kz: string;
  siteTitle_ru: string;
  footerText_kz: string;
  footerText_ru: string;
  linkVk: string;
  linkFacebook: string;
  linkTelegram: string;
  linkInstagram: string;
  linkYoutube: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
};

const DEFAULTS: Settings = {
  heroQuote_kz: "Қараңғы қазақ көгіне, Өрмелеп шығып, күн болам!",
  heroQuote_ru: "Взойду я солнцем в тёмное казахское небо!",
  quoteAuthor_kz: "Сұлтанмахмұт Торайғыров",
  quoteAuthor_ru: "Султанмахмут Торайгыров",
  siteTitle_kz: "Виртуалды энциклопедия",
  siteTitle_ru: "Виртуальная энциклопедия",
  footerText_kz: "С. Торайғыров атындағы Павлодар облыстық ғылыми кітапханасы",
  footerText_ru: "Павлодарская областная научная библиотека имени С. Торайгырова",
  linkVk: "",
  linkFacebook: "",
  linkTelegram: "",
  linkInstagram: "",
  linkYoutube: "",
  contactAddress: "",
  contactPhone: "",
  contactEmail: "",
};

/** Fetch the settings singleton; returns sensible defaults if not yet seeded. */
export async function getSettings(): Promise<Settings> {
  try {
    const row = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });
    if (!row) return DEFAULTS;
    const { id, updatedAt, ...rest } = row;
    return rest as Settings;
  } catch {
    return DEFAULTS;
  }
}
