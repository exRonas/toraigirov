import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BibliographyForm } from "@/components/admin/bibliography-form";

export const dynamic = "force-dynamic";

export default async function EditBiblioPage({ params }: { params: { id: string } }) {
  const e = await prisma.bibliographyEntry.findUnique({ where: { id: params.id } });
  if (!e) notFound();
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-text">Редактирование записи</h1>
      <BibliographyForm
        initial={{
          id: e.id,
          author: e.author,
          title_kz: e.title_kz,
          title_ru: e.title_ru,
          year: e.year ? String(e.year) : "",
          publisher: e.publisher ?? "",
          type: e.type,
          notes_kz: e.notes_kz ?? "",
          notes_ru: e.notes_ru ?? "",
        }}
      />
    </div>
  );
}
