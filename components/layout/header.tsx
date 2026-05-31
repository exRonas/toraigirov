"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
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
    <header className="sticky top-0 z-50 no-print">
      {/* Top bar */}
      <div className="bg-nav-bg text-nav-text">
        <div className="mx-auto flex max-w-site items-center justify-between gap-3 px-4 py-2">
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
          </div>

          <Link
            href={withLang("/")}
            className="flex min-w-0 flex-col items-center text-center"
          >
            <span className="font-serif text-base italic leading-tight text-nav-text sm:text-lg">
              {siteTitle}
            </span>
            <span className="hidden text-[11px] tracking-wide text-nav-text/70 sm:block">
              С. Торайғыров · 1893–1920
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={tr("nav.search")}
              aria-expanded={searchOpen}
              className="flex h-9 w-9 items-center justify-center rounded text-nav-text hover:bg-white/10"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label={tr("nav.menu")}
              className="flex h-9 w-9 items-center justify-center rounded text-nav-text hover:bg-white/10 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-white/10 bg-nav-bg">
            <div className="mx-auto max-w-site px-4 py-3">
              <SearchBar autoFocus />
            </div>
          </div>
        )}
      </div>

      {/* Navigation bar */}
      <div className="border-b border-black/20 bg-nav-bar">
        <Navigation />
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
