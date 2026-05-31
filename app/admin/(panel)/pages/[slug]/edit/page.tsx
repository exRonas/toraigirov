import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSection } from "@/lib/sections";
import { PageEditForm } from "@/components/admin/page-edit-form";

export const dynamic = "force-dynamic";

export default async function EditPagePage({ params }: { params: { slug: string } }) {
  const section = getSection(params.slug);
  if (!section) notFound();

  const page = await prisma.page.findUnique({ where: { slug: params.slug } });

  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl font-bold text-text">Раздел: {section.ru}</h1>
      <p className="mb-6 text-sm text-text-muted">{section.kz}</p>
      <PageEditForm
        initial={{
          slug: params.slug,
          title_kz: page?.title_kz ?? section.kz,
          title_ru: page?.title_ru ?? section.ru,
          content_kz: page?.content_kz ?? "",
          content_ru: page?.content_ru ?? "",
        }}
      />
    </div>
  );
}
