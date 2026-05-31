"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { SECTIONS } from "@/lib/sections";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUpload } from "@/components/admin/image-upload";

export type ArticleFormData = {
  id?: string;
  sectionSlug: string;
  title_kz: string;
  title_ru: string;
  content_kz: string;
  content_ru: string;
  coverImage: string | null;
  publishedAt: string; // yyyy-mm-dd
  isDraft: boolean;
};

export function ArticleForm({ initial }: { initial: ArticleFormData }) {
  const router = useRouter();
  const [data, setData] = useState<ArticleFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [previewSize, setPreviewSize] = useState("content-md");

  function set<K extends keyof ArticleFormData>(key: K, val: ArticleFormData[K]) {
    setData((d) => ({ ...d, [key]: val }));
  }

  async function save() {
    setError("");
    if (!data.title_kz.trim() && !data.title_ru.trim()) {
      setError("Укажите заголовок хотя бы на одном языке");
      return;
    }
    setSaving(true);
    try {
      const url = data.id ? `/api/articles/${data.id}` : "/api/articles";
      const method = data.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Ошибка сохранения");
      }
      router.push("/admin/articles");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  const previewHtml = data.content_ru || data.content_kz;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Раздел">
          <select
            value={data.sectionSlug}
            onChange={(e) => set("sectionSlug", e.target.value)}
            className="h-10 w-full rounded-md border border-border bg-surface px-3"
          >
            {SECTIONS.map((s) => (
              <option key={s.slug} value={s.slug}>{s.ru}</option>
            ))}
          </select>
        </Field>
        <Field label="Дата публикации">
          <input
            type="date"
            value={data.publishedAt}
            onChange={(e) => set("publishedAt", e.target.value)}
            className="h-10 w-full rounded-md border border-border bg-surface px-3"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Заголовок (KZ)">
          <input value={data.title_kz} onChange={(e) => set("title_kz", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3" />
        </Field>
        <Field label="Заголовок (RU)">
          <input value={data.title_ru} onChange={(e) => set("title_ru", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3" />
        </Field>
      </div>

      <ImageUpload value={data.coverImage} onChange={(url) => set("coverImage", url)} label="Обложка (16:9)" />

      <div>
        <label className="mb-1 block text-sm font-medium text-text">Содержание</label>
        <RichTextEditor
          valueKz={data.content_kz}
          valueRu={data.content_ru}
          onChangeKz={(html) => set("content_kz", html)}
          onChangeRu={(html) => set("content_ru", html)}
        />
      </div>

      {/* Font-size preview */}
      {previewHtml && (
        <div className="rounded-md border border-border bg-bg p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-text">Предпросмотр:</span>
            {[["content-sm", "А"], ["content-md", "А"], ["content-lg", "А"]].map(([cls, l], i) => (
              <button
                key={cls}
                type="button"
                onClick={() => setPreviewSize(cls)}
                className={`flex h-7 items-center rounded px-2 font-serif ${previewSize === cls ? "bg-primary text-white" : "bg-surface text-text-muted"} ${i === 0 ? "text-xs" : i === 1 ? "text-sm" : "text-base"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className={`rich ${previewSize}`} dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      )}

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!data.isDraft} onChange={(e) => set("isDraft", !e.target.checked)} className="h-4 w-4" />
        <span className="text-sm font-medium text-text">Опубликовано</span>
      </label>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-hover disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Сохранить
        </button>
        <button onClick={() => router.push("/admin/articles")} className="rounded-md border border-border px-5 py-2.5 font-medium text-text hover:bg-bg">
          Отмена
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-text">{label}</label>
      {children}
    </div>
  );
}
