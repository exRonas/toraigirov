"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { SECTIONS } from "@/lib/sections";

export function Navigation() {
  const { lang, tr, withLang } = useLanguage();
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname === "";

  // Сортировка по алфавиту в текущем языке
  const sorted = [...SECTIONS].sort((a, b) => {
    const la = lang === "ru" ? a.ru : a.kz;
    const lb = lang === "ru" ? b.ru : b.kz;
    return la.localeCompare(lb, lang === "ru" ? "ru" : "kk", { sensitivity: "base" });
  });

  return (
    <nav aria-label="Основные разделы" className="hidden lg:block">
      <ul className="mx-auto flex max-w-site flex-wrap items-center justify-center gap-1 px-4 py-2">
        {/* Главная */}
        <li>
          <Link
            href={withLang("/")}
            aria-label={tr("nav.home")}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-all ${
              isHome
                ? "bg-white/20 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {/* Разделитель */}
        <li aria-hidden className="mx-1 h-4 w-px bg-white/20" />

        {sorted.map((s) => {
          const active =
            pathname === s.href ||
            pathname.startsWith(s.href + "/") ||
            (s.href === "/archive/photos" && pathname.startsWith("/archive"));
          const label = lang === "ru" ? s.ru : s.kz;

          return (
            <li key={s.slug}>
              <Link
                href={withLang(s.href)}
                title={label}
                className={`flex items-center rounded-md px-3 py-1.5 text-[13px] font-medium leading-tight transition-all ${
                  active
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
