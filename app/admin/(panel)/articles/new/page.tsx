import { ArticleForm } from "@/components/admin/article-form";

export default function NewArticlePage() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-text">Новая статья</h1>
      <ArticleForm
        initial={{
          sectionSlug: "biography",
          title_kz: "",
          title_ru: "",
          content_kz: "",
          content_ru: "",
          coverImage: null,
          publishedAt: today,
          isDraft: true,
        }}
      />
    </div>
  );
}
