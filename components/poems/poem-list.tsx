"use client";

import { PoemCard, type PoemCardData } from "@/components/poems/poem-card";
import { EmptyState } from "@/components/ui/empty-state";

export function PoemList({ poems }: { poems: PoemCardData[] }) {
  if (poems.length === 0) return <EmptyState />;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {poems.map((p) => (
        <PoemCard key={p.id} poem={p} />
      ))}
    </div>
  );
}
