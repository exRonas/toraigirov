"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X, Menu, BookOpen } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { SearchBar } from "@/components/ui/search-bar";
import { Navigation } from "@/components/layout/navigation";
import { MobileMenu } from "@/components/layout/mobile-menu";
import type { Settings } from "@/lib/settings";

export function Header({ settings }: { settings: Settings }) {
  const { lang, tr, withLang } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const siteTitle = lang === "ru" ? settings.siteTitle_ru : settings.siteTitle_kz;

  return (
    <header className="sticky top-0 z-50 no-print shadow-md">

      {/* ── Верхняя полоса: логотип + язык + поиск ── */}
      <div className="bg-nav-bg">
        <div className="mx-auto flex h-14 max-w-site items-center justify-between gap-4 px-4 sm:px-6">

          {/* Слева: переключатель языка */}
          <div className="flex shrink-0 items-center">
            <LanguageSwitcher />
          </div>

          {/* Центр: название сайта */}
          <Link
            href={withLang("/")}
            className="flex min-w-0 flex-1 items-center justify-center gap-2.5 text-white"
          >
            <BookOpen className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
            <span className="truncate font-serif text-base italic leading-tight sm:text-lg">
              {siteTitle}
            </span>
          </Link>

          {/* Справа: поиск + бургер */}
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={tr("nav.search")}
              aria-expanded={searchOpen}
              className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label={tr("nav.menu")}
              className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Раскрывающаяся строка поиска */}
        {searchOpen && (
          <div className="border-t border-white/10 bg-nav-bg/95 backdrop-blur-sm">
            <div className="mx-auto max-w-site px-4 py-2.5">
              <SearchBar autoFocus />
            </div>
          </div>
        )}
      </div>

      {/* ── Навигационная полоса с разделами ── */}
      <div className="border-t border-white/10 bg-nav-bar">
        <Navigation />
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
