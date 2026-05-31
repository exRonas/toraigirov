import Link from "next/link";
import { Plus, Upload, Film } from "lucide-react";
import { prisma } from "@/lib/db";
import { StatsCard } from "@/components/admin/stats-card";
import { formatDate } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [articles, photos, videos, poems, biblio, recentArticles, recentPoems] =
    await Promise.all([
      prisma.article.count(),
      prisma.photo.count(),
      prisma.video.count(),
      prisma.poem.count(),
      prisma.bibliographyEntry.count(),
      prisma.article.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
      prisma.poem.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    ]);

  // merge recent activity
  const activity = [
    ...recentArticles.map((a) => ({
      id: a.id,
      type: "Статья",
      title: a.title_ru || a.title_kz,
      at: a.updatedAt,
      href: `/admin/articles/${a.id}/edit`,
    })),
    ...recentPoems.map((p) => ({
      id: p.id,
      type: "Стих",
      title: p.title_ru || p.title_kz,
      at: p.updatedAt,
      href: `/admin/poems/${p.id}/edit`,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-text">Панель управления</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard label="Статьи" value={articles} icon="Newspaper" href="/admin/articles" />
        <StatsCard label="Стихи" value={poems} icon="ScrollText" href="/admin/poems" />
        <StatsCard label="Фото" value={photos} icon="Images" href="/admin/photos" />
        <StatsCard label="Видео" value={videos} icon="Film" href="/admin/videos" />
        <StatsCard label="Библиография" value={biblio} icon="Library" href="/admin/bibliography" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <h2 className="mb-4 font-serif text-lg font-semibold text-text">Быстрые действия</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/articles/new" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
              <Plus className="h-4 w-4" /> Новая статья
            </Link>
            <Link href="/admin/photos" className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-text hover:bg-bg">
              <Upload className="h-4 w-4" /> Загрузить фото
            </Link>
            <Link href="/admin/videos" className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-text hover:bg-bg">
              <Film className="h-4 w-4" /> Добавить видео
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <h2 className="mb-4 font-serif text-lg font-semibold text-text">Последние изменения</h2>
          {activity.length === 0 ? (
            <p className="text-sm text-text-muted">Пока нет материалов.</p>
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((a) => (
                <li key={`${a.type}-${a.id}`}>
                  <Link href={a.href} className="flex items-center justify-between gap-3 py-2.5 hover:text-primary">
                    <span className="min-w-0">
                      <span className="mr-2 rounded bg-secondary/15 px-1.5 py-0.5 text-xs text-secondary">{a.type}</span>
                      <span className="text-sm text-text">{a.title || "—"}</span>
                    </span>
                    <span className="shrink-0 text-xs text-text-muted">{formatDate(a.at, "ru")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
