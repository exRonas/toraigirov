"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { SECTIONS } from "@/lib/sections";
import type { Settings } from "@/lib/settings";

export function Footer({ settings }: { settings: Settings }) {
  const { lang, tr, withLang } = useLanguage();
  const footerText =
    lang === "ru" ? settings.footerText_ru : settings.footerText_kz;

  const socials: { label: string; href: string }[] = [
    { label: "VK", href: settings.linkVk },
    { label: "Facebook", href: settings.linkFacebook },
    { label: "Telegram", href: settings.linkTelegram },
    { label: "Instagram", href: settings.linkInstagram },
    { label: "YouTube", href: settings.linkYoutube },
  ].filter((s) => s.href);

  const half = Math.ceil(SECTIONS.length / 2);

  return (
    <footer className="mt-12 border-t-2 border-white/20 bg-nav-bg text-nav-text no-print">
      <div className="mx-auto grid max-w-site gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* About */}
        <div>
          <h3 className="mb-3 font-serif text-lg text-white">С. Торайғыров</h3>
          <p className="text-sm leading-relaxed text-white/70">{footerText}</p>
        </div>

        {/* Sections col 1 */}
        <div>
          <h3 className="mb-3 font-serif text-base text-white">{tr("footer.sections")}</h3>
          <ul className="space-y-1.5 text-sm text-white/70">
            {SECTIONS.slice(0, half).map((s) => (
              <li key={s.slug}>
                <Link href={withLang(s.href)} className="transition-colors hover:text-white">
                  {lang === "ru" ? s.ru : s.kz}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections col 2 */}
        <div>
          <h3 className="mb-3 font-serif text-base text-white sm:invisible">·</h3>
          <ul className="space-y-1.5 text-sm text-white/70">
            {SECTIONS.slice(half).map((s) => (
              <li key={s.slug}>
                <Link href={withLang(s.href)} className="transition-colors hover:text-white">
                  {lang === "ru" ? s.ru : s.kz}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <h3 className="mb-3 font-serif text-base text-white">{tr("footer.contacts")}</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {settings.contactAddress && (
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                <span>{settings.contactAddress}</span>
              </li>
            )}
            {settings.contactPhone && (
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                <a href={`tel:${settings.contactPhone}`} className="transition-colors hover:text-white">
                  {settings.contactPhone}
                </a>
              </li>
            )}
            {settings.contactEmail && (
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                <a href={`mailto:${settings.contactEmail}`} className="transition-colors hover:text-white">
                  {settings.contactEmail}
                </a>
              </li>
            )}
          </ul>
          {socials.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/40">
                {tr("footer.followUs")}
              </p>
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-white/20 px-2.5 py-1 text-xs text-white/70 transition-colors hover:border-white hover:text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-site px-4 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {footerText}. {tr("footer.rights")}.
        </div>
      </div>
    </footer>
  );
}
