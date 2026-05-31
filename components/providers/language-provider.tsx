"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { type Lang, normalizeLang } from "@/lib/i18n";
import { makeTr } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  tr: (key: string) => string;
  /** Append the current lang to a path (preserves language across navigation). */
  withLang: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = normalizeLang(searchParams.get("lang"));

  const setLang = useCallback(
    (next: Lang) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("lang", next);
      try {
        localStorage.setItem("lang", next);
        document.cookie = `lang=${next}; path=/; max-age=31536000`;
        document.documentElement.lang = next;
      } catch {
        /* ignore */
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const withLang = useCallback(
    (path: string) => {
      const [base, hash] = path.split("#");
      const sep = base.includes("?") ? "&" : "?";
      const url = `${base}${sep}lang=${lang}`;
      return hash ? `${url}#${hash}` : url;
    },
    [lang]
  );

  const tr = makeTr(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr, withLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
