import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PoemForm } from "@/components/admin/poem-form";

export const dynamic = "force-dynamic";

export default async function EditPoemPage({ params }: { params: { id: string } }) {
  const p = await prisma.poem.findUnique({ where: { id: params.id } });
  if (!p) notFound();
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-text">Редактирование стиха</h1>
      <PoemForm
        initial={{
          id: p.id,
          title_kz: p.title_kz,
          title_ru: p.title_ru,
          text_kz: p.text_kz,
          text_ru: p.text_ru,
          yearWritten: p.yearWritten ? String(p.yearWritten) : "",
          audioFile: p.audioFile,
        }}
      />
    </div>
  );
}
