"use client";

import { useLanguage } from "@/components/providers/language-provider";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-white/25 p-0.5"
      role="group"
      aria-label="Тіл / Язык"
    >
      {(["ru", "kz"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={l === "ru" ? "Русский язык" : "Қазақ тілі"}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150 ${
            lang === l
              ? "bg-white text-primary shadow-sm"          // белая таблетка, синий текст
              : "text-white/65 hover:bg-white/10 hover:text-white"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
