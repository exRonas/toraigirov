"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Menu } from "lucide-react";
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

      {/* ── Идентификационная полоса (пергамент) ── */}
      <div className="border-b border-border bg-bg">
        <div className="mx-auto flex max-w-site items-center justify-between gap-4 px-4 py-2.5 sm:px-6">

          {/* Слева: переключатель языка */}
          <div className="flex shrink-0 items-center">
            <LanguageSwitcher />
          </div>

          {/* Центр: логотип + название */}
          <Link
            href={withLang("/")}
            className="flex min-w-0 flex-1 items-center justify-center gap-3"
          >
            <Image
              src="/logo.png"
              alt="Логотип"
              width={44}
              height={44}
              className="shrink-0 rounded-md object-contain"
              priority
            />
            <div className="hidden text-center sm:block">
              <p className="font-serif text-lg font-bold leading-tight text-primary">
                {siteTitle}
              </p>
              <p className="text-[11px] uppercase tracking-wider text-text-muted">
                {lang === "ru"
                  ? "Виртуальная энциклопедия"
                  : "Виртуалды энциклопедия"}
              </p>
            </div>
            {/* Мобиль: только название без подзаголовка */}
            <p className="font-serif text-base font-bold leading-tight text-primary sm:hidden">
              {siteTitle}
            </p>
          </Link>

          {/* Справа: поиск + бургер */}
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={tr("nav.search")}
              aria-expanded={searchOpen}
              className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label={tr("nav.menu")}
              className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-primary/10 hover:text-primary lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Раскрывающаяся строка поиска */}
        {searchOpen && (
          <div className="border-t border-border bg-surface/80 backdrop-blur-sm">
            <div className="mx-auto max-w-site px-4 py-2.5">
              <SearchBar autoFocus />
            </div>
          </div>
        )}
      </div>

      {/* ── Навигационная полоса (тёмно-синяя) ── */}
      <div className="bg-nav-bg">
        <Navigation />
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
