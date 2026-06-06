"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Newspaper, ScrollText, FolderOpen, Library,
  FileText, Settings, LogOut, ExternalLink, Menu, X, HelpCircle,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Панель", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Статьи", icon: Newspaper },
  { href: "/admin/poems", label: "Стихи", icon: ScrollText },
  { href: "/admin/archive", label: "Фото / Видео архив", icon: FolderOpen },
  { href: "/admin/bibliography", label: "Библиография", icon: Library },
  { href: "/admin/pages", label: "Страницы разделов", icon: FileText },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
  { href: "/admin/guide", label: "Гайд", icon: HelpCircle },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex-1 space-y-1 p-3">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-white"
                : "text-nav-text/80 hover:bg-white/10"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="space-y-1 border-t border-white/10 p-3">
      <a
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-nav-text/80 hover:bg-white/10"
      >
        <ExternalLink className="h-4 w-4" />
        Открыть сайт
      </a>
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-nav-text/80 hover:bg-white/10"
      >
        <LogOut className="h-4 w-4" />
        Выйти
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-nav-bg text-nav-text lg:flex">
        <div className="border-b border-white/10 p-4">
          <p className="font-serif text-lg text-nav-text">С. Торайғыров</p>
          <p className="text-xs text-nav-text/60">Админ-панель</p>
        </div>
        {nav}
        {footer}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-nav-bg text-nav-text">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <p className="font-serif text-lg">Админ-панель</p>
              <button onClick={() => setOpen(false)} className="rounded p-1 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            {footer}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded p-1 hover:bg-bg" aria-label="Меню">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-serif font-semibold">Админ-панель</span>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
