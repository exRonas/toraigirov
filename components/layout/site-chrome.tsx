"use client";

import { Suspense, type ReactNode } from "react";
import { LanguageProvider } from "@/components/providers/language-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Settings } from "@/lib/settings";

export function SiteChrome({
  settings,
  children,
}: {
  settings: Settings;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <LanguageProvider>
        <div className="flex min-h-screen flex-col">
          <Header settings={settings} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </div>
      </LanguageProvider>
    </Suspense>
  );
}
