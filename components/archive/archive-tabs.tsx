"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Images, Film } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function ArchiveTabs() {
  const { tr, withLang } = useLanguage();
  const pathname = usePathname();

  const tabs = [
    { href: "/archive/photos", label: tr("archive.photos"), icon: Images },
    { href: "/archive/videos", label: tr("archive.videos"), icon: Film },
  ];

  return (
    <div className="mb-6 flex gap-2 border-b border-border no-print">
      {tabs.map((t) => {
        const active = pathname === t.href;
        const Icon = t.icon;
        return (
          <Link
            key={t.href}
            href={withLang(t.href)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-primary"
            }`}
          >
            <Icon className="h-4 w-4" />
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
