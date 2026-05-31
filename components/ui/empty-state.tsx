"use client";

import { Inbox } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function EmptyState({ message }: { message?: string }) {
  const { tr } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
      <Inbox className="mb-3 h-10 w-10 text-border" aria-hidden />
      <p className="text-text-muted">{message ?? tr("common.empty")}</p>
    </div>
  );
}
