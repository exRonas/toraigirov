"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const { tr, withLang } = useLanguage();
  const all: Crumb[] = [{ label: tr("nav.home"), href: "/" }, ...items];

  return (
    <nav aria-label="breadcrumb" className="no-print">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-text-muted">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {c.href && !last ? (
                <Link
                  href={withLang(c.href)}
                  className="hover:text-primary hover:underline"
                >
                  {c.label}
                </Link>
              ) : (
                <span className={last ? "text-text" : ""} aria-current={last ? "page" : undefined}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
