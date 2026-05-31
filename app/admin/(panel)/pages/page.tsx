import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { SECTIONS } from "@/lib/sections";

export const dynamic = "force-dynamic";

export default function AdminPagesList() {
  return (
    <div>
      <h1 className="mb-2 font-serif text-2xl font-bold text-text">Страницы разделов</h1>
      <p className="mb-6 text-sm text-text-muted">
        Вводный текст каждого раздела (показывается над списком материалов).
      </p>
      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
        {SECTIONS.map((s) => (
          <li key={s.slug}>
            <Link href={`/admin/pages/${s.slug}/edit`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-bg">
              <span className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium text-text">{s.ru}</span>
                <span className="text-sm text-text-muted">/ {s.kz}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
