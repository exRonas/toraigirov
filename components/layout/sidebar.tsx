"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { SECTIONS } from "@/lib/sections";
import { SearchBar } from "@/components/ui/search-bar";

// Right-hand sidebar for content pages: section nav + search + library link.
export function Sidebar() {
  const { lang, tr, withLang } = useLanguage();
  const pathname = usePathname();

  return (
    <aside className="space-y-6 no-print">
      <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="mb-3 font-serif text-base font-semibold text-text">
          {tr("home.sections")}
        </h2>
        <ul className="space-y-0.5">
          {[...SECTIONS]
            .sort((a, b) => {
              const la = lang === "ru" ? a.ru : a.kz;
              const lb = lang === "ru" ? b.ru : b.kz;
              return la.localeCompare(lb, lang === "ru" ? "ru" : "kk", { sensitivity: "base" });
            })
            .map((s) => {
            const active =
              pathname === s.href || pathname.startsWith(s.href + "/");
            return (
              <li key={s.slug}>
                <Link
                  href={withLang(s.href)}
                  className={`block rounded px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-text-muted hover:bg-bg hover:text-primary"
                  }`}
                >
                  {lang === "ru" ? s.ru : s.kz}
                </Link>
              </li>
            );
          })
          }
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="mb-3 font-serif text-base font-semibold text-text">
          {tr("search.title")}
        </h2>
        <SearchBar />
      </div>

      <a
        href="https://pavlodarlibrary.kz"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 text-sm font-medium text-primary shadow-card transition-colors hover:bg-primary hover:text-white"
      >
        {tr("site.libraryLink")}
        <ExternalLink className="h-4 w-4" />
      </a>
    </aside>
  );
}
