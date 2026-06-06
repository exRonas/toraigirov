"use client";

import { useLanguage } from "@/components/providers/language-provider";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full border-2 border-nav-bg bg-white p-1"
      role="group"
      aria-label="Тіл / Язык"
    >
      {(["ru", "kz"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={l === "ru" ? "Русский язык" : "Қазақ тілі"}
          className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${
            lang === l
              ? "bg-nav-bg text-white shadow-md"
              : "bg-transparent text-text-muted hover:text-text"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
