import { prisma } from "@/lib/db";
import { getSection } from "@/lib/sections";
import { ArchiveManager } from "@/components/admin/archive-manager";

export const dynamic = "force-dynamic";

export default async function AdminArchivePage() {
  const section = getSection("archive")!;
  const page = await prisma.page.findUnique({ where: { slug: "archive" } });

  return (
    <ArchiveManager
      initialPage={{
        slug: "archive",
        title_kz: page?.title_kz ?? section.kz,
        title_ru: page?.title_ru ?? section.ru,
        content_kz: page?.content_kz ?? "",
        content_ru: page?.content_ru ?? "",
      }}
    />
  );
}
