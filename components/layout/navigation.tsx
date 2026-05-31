"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { SECTIONS } from "@/lib/sections";

export function Navigation() {
  const { lang, withLang } = useLanguage();
  const pathname = usePathname();

  return (
    <nav aria-label="Основные разделы" className="hidden lg:block">
      <ul className="mx-auto flex max-w-site flex-wrap items-stretch px-4">
        {SECTIONS.map((s) => {
          const active = pathname === s.href || pathname.startsWith(s.href + "/");
          return (
            <li key={s.slug}>
              <Link
                href={withLang(s.href)}
                className={`block px-3 py-3 text-sm font-medium transition-colors hover:bg-white/10 ${
                  active ? "text-secondary" : "text-nav-text/90"
                }`}
              >
                {lang === "ru" ? s.ru : s.kz}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
