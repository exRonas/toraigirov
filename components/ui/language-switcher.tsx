"use client";

import { useLanguage } from "@/components/providers/language-provider";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className="flex items-center overflow-hidden rounded border border-white/25"
      role="group"
      aria-label="Тіл / Язык"
    >
      <button
        onClick={() => setLang("ru")}
        className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
          lang === "ru"
            ? "bg-secondary text-white"
            : "text-nav-text/80 hover:bg-white/10"
        }`}
        aria-pressed={lang === "ru"}
        aria-label="Русский язык"
      >
        RU
      </button>
      <button
        onClick={() => setLang("kz")}
        className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
          lang === "kz"
            ? "bg-secondary text-white"
            : "text-nav-text/80 hover:bg-white/10"
        }`}
        aria-pressed={lang === "kz"}
        aria-label="Қазақ тілі"
      >
        KZ
      </button>
    </div>
  );
}
