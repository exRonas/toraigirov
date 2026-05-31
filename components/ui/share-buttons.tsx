"use client";

import { useEffect, useState } from "react";
import { Printer, Link2, Check, Send } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

// Telegram, VK, Facebook share + copy-link + print.
export function ShareButtons({ title }: { title: string }) {
  const { tr } = useLanguage();
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const enc = encodeURIComponent;
  const shareUrl = enc(url);
  const shareTitle = enc(title);

  const links = [
    {
      key: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`,
      icon: <Send className="h-4 w-4" aria-hidden />,
    },
    {
      key: "vk",
      label: "VK",
      href: `https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}`,
      icon: <span className="text-sm font-bold leading-none">VK</span>,
    },
    {
      key: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      icon: <span className="text-sm font-bold leading-none">f</span>,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <span className="text-sm text-text-muted">{tr("common.share")}:</span>
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-text-muted transition-colors hover:border-primary hover:bg-primary hover:text-white"
        >
          {l.icon}
        </a>
      ))}
      <button
        onClick={copy}
        aria-label={tr("common.copyLink")}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-text-muted transition-colors hover:border-primary hover:bg-primary hover:text-white"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
      <button
        onClick={() => window.print()}
        aria-label={tr("common.print")}
        className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm text-text-muted transition-colors hover:border-primary hover:bg-primary hover:text-white"
      >
        <Printer className="h-4 w-4" />
        <span className="hidden sm:inline">{tr("common.print")}</span>
      </button>
    </div>
  );
}
