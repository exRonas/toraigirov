"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function SearchBar({
  variant = "default",
  autoFocus = false,
}: {
  variant?: "default" | "hero" | "compact";
  autoFocus?: boolean;
}) {
  const { lang, tr } = useLanguage();
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}&lang=${lang}`);
  }

  const big = variant === "hero";

  return (
    <form onSubmit={onSubmit} className="relative w-full" role="search">
      <Search
        className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted ${
          big ? "h-5 w-5" : "h-4 w-4"
        }`}
        aria-hidden
      />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus={autoFocus}
        placeholder={tr("search.placeholder")}
        aria-label={tr("search.title")}
        className={`w-full rounded-md border border-border bg-surface pl-9 pr-3 text-text placeholder:text-text-muted/70 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          big ? "h-12 text-base" : "h-9 text-sm"
        }`}
      />
    </form>
  );
}
