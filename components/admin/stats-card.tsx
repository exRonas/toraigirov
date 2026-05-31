import Link from "next/link";
import {
  Newspaper, ScrollText, Images, Film, Library, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Newspaper, ScrollText, Images, Film, Library,
};

export function StatsCard({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: number;
  icon: string;
  href: string;
}) {
  const Icon = ICONS[icon] ?? Newspaper;
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-lg border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <span>
        <span className="block text-2xl font-bold text-text">{value}</span>
        <span className="text-sm text-text-muted">{label}</span>
      </span>
    </Link>
  );
}
