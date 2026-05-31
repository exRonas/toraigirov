"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/providers/language-provider";
import { SearchBar } from "@/components/ui/search-bar";

export function Hero({
  quote,
  quoteAuthor,
}: {
  quote: string;
  quoteAuthor: string;
}) {
  const { lang, tr } = useLanguage();
  const [imgSrc, setImgSrc] = useState("/uploads/toraygyrov.jpg");

  return (
    <section className="border-b border-border bg-gradient-to-b from-muted to-background">
      <div className="mx-auto grid max-w-site items-center gap-8 px-4 py-12 md:grid-cols-[300px_1fr] md:py-16">
        <div className="mx-auto w-full max-w-[300px]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border-4 border-primary bg-primary shadow-card-hover">
            <Image
              src={imgSrc}
              alt={tr("home.heroAlt")}
              fill
              priority
              sizes="300px"
              className="object-cover"
              onError={() => setImgSrc("/placeholder-portrait.svg")}
            />
          </div>
        </div>

        <div className="text-center md:text-left">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            {lang === "ru" ? "Виртуальная энциклопедия" : "Виртуалды энциклопедия"}
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            {tr("home.fullName")}
          </h1>
          <p className="mt-2 font-serif text-xl text-primary">1893 — 1920</p>

          {quote && (
            <blockquote className="mx-auto mt-6 max-w-xl border-l-4 border-primary/50 pl-4 text-left md:mx-0">
              <p className="font-serif text-lg italic leading-relaxed text-foreground">
                «{quote}»
              </p>
              {quoteAuthor && (
                <footer className="mt-2 text-sm text-muted-foreground">— {quoteAuthor}</footer>
              )}
            </blockquote>
          )}

          <div className="mx-auto mt-8 max-w-xl md:mx-0">
            <SearchBar variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
