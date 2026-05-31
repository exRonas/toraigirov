"use client";

import { useFontSize } from "@/hooks/useFontSize";
import { FontSizeChanger } from "@/components/ui/font-size-changer";
import { ShareButtons } from "@/components/ui/share-buttons";
import { RichContent } from "@/components/ui/rich-content";

export function ArticleReader({
  shareTitle,
  content_kz,
  content_ru,
}: {
  shareTitle: string;
  content_kz: string;
  content_ru: string;
}) {
  const { size, setSize, className } = useFontSize();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-border py-3 no-print">
        <FontSizeChanger size={size} onChange={setSize} />
        <ShareButtons title={shareTitle} />
      </div>
      <div className={className}>
        <RichContent kz={content_kz} ru={content_ru} />
      </div>
    </div>
  );
}
