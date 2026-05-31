"use client";

import type { FontSize } from "@/hooks/useFontSize";
import { useLanguage } from "@/components/providers/language-provider";

// Controlled А А А font-size control. Parent owns the `size` state
// (typically via the useFontSize hook).
export function FontSizeChanger({
  size,
  onChange,
}: {
  size: FontSize;
  onChange: (next: FontSize) => void;
}) {
  const { tr } = useLanguage();

  const options: { value: FontSize; label: string; cls: string }[] = [
    { value: "sm", label: tr("fontSize.small"), cls: "text-sm" },
    { value: "md", label: tr("fontSize.medium"), cls: "text-base" },
    { value: "lg", label: tr("fontSize.large"), cls: "text-lg" },
  ];

  return (
    <div
      className="flex items-center gap-1 rounded-md border border-border bg-surface p-1"
      role="group"
      aria-label={tr("fontSize.label")}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-label={o.label}
          aria-pressed={size === o.value}
          className={`flex h-7 w-7 items-center justify-center rounded font-serif font-semibold leading-none transition-colors ${o.cls} ${
            size === o.value
              ? "bg-primary text-white"
              : "text-text-muted hover:bg-bg"
          }`}
        >
          А
        </button>
      ))}
    </div>
  );
}
