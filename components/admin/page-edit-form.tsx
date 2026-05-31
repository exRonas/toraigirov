"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Check } from "lucide-react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export type PageFormData = {
  slug: string;
  title_kz: string;
  title_ru: string;
  content_kz: string;
  content_ru: string;
};

export function PageEditForm({ initial }: { initial: PageFormData }) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof PageFormData>(k: K, v: PageFormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function save() {
    setError(""); setSaved(false); setSaving(true);
    try {
      const res = await fetch(`/api/pages/${data.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Ошибка");
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-1 block text-sm font-medium text-text">Заголовок (KZ)</label><input value={data.title_kz} onChange={(e) => set("title_kz", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3" /></div>
        <div><label className="mb-1 block text-sm font-medium text-text">Заголовок (RU)</label><input value={data.title_ru} onChange={(e) => set("title_ru", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3" /></div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text">Содержание страницы</label>
        <RichTextEditor
          valueKz={data.content_kz}
          valueRu={data.content_ru}
          onChangeKz={(html) => set("content_kz", html)}
          onChangeRu={(html) => set("content_ru", html)}
        />
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-hover disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Сохранить
        </button>
        {saved && <span className="flex items-center gap-1 text-sm text-green-600"><Check className="h-4 w-4" /> Сохранено</span>}
      </div>
    </div>
  );
}
