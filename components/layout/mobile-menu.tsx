"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { SECTIONS } from "@/lib/sections";
import { SearchBar } from "@/components/ui/search-bar";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lang, tr, withLang } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-nav-bg text-nav-text shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="font-serif text-lg">{tr("nav.menu")}</span>
          <button
            onClick={onClose}
            aria-label={tr("nav.close")}
            className="flex h-9 w-9 items-center justify-center rounded hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="border-b border-white/10 p-4">
          <SearchBar />
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          <ul>
            <li>
              <Link
                href={withLang("/")}
                onClick={onClose}
                className="block px-4 py-3 text-sm hover:bg-white/10"
              >
                {tr("nav.home")}
              </Link>
            </li>
            {[...SECTIONS]
              .sort((a, b) => {
                const la = lang === "ru" ? a.ru : a.kz;
                const lb = lang === "ru" ? b.ru : b.kz;
                return la.localeCompare(lb, lang === "ru" ? "ru" : "kk", { sensitivity: "base" });
              })
              .map((s) => (
              <li key={s.slug}>
                <Link
                  href={withLang(s.href)}
                  onClick={onClose}
                  className="block px-4 py-3 text-sm hover:bg-white/10"
                >
                  {lang === "ru" ? s.ru : s.kz}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
