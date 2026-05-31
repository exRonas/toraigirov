import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ArticleForm } from "@/components/admin/article-form";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const a = await prisma.article.findUnique({ where: { id: params.id } });
  if (!a) notFound();

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-text">Редактирование статьи</h1>
      <ArticleForm
        initial={{
          id: a.id,
          sectionSlug: a.sectionSlug,
          title_kz: a.title_kz,
          title_ru: a.title_ru,
          content_kz: a.content_kz,
          content_ru: a.content_ru,
          coverImage: a.coverImage,
          publishedAt: a.publishedAt.toISOString().slice(0, 10),
          isDraft: a.isDraft,
        }}
      />
    </div>
  );
}
