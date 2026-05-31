"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { BIBLIOGRAPHY_TYPES } from "@/lib/sections";

export type BiblioFormData = {
  id?: string;
  author: string;
  title_kz: string;
  title_ru: string;
  year: string;
  publisher: string;
  type: string;
  notes_kz: string;
  notes_ru: string;
};

export function BibliographyForm({ initial }: { initial: BiblioFormData }) {
  const router = useRouter();
  const [data, setData] = useState<BiblioFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof BiblioFormData>(k: K, v: BiblioFormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function save() {
    setError("");
    if (!data.author.trim()) { setError("Укажите автора"); return; }
    setSaving(true);
    try {
      const url = data.id ? `/api/bibliography/${data.id}` : "/api/bibliography";
      const res = await fetch(url, {
        method: data.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Ошибка");
      router.push("/admin/bibliography");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-5">
      <Field label="Автор(ы)"><input value={data.author} onChange={(e) => set("author", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название (KZ)"><input value={data.title_kz} onChange={(e) => set("title_kz", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3" /></Field>
        <Field label="Название (RU)"><input value={data.title_ru} onChange={(e) => set("title_ru", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3" /></Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Год"><input type="number" value={data.year} onChange={(e) => set("year", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3" /></Field>
        <Field label="Издатель"><input value={data.publisher} onChange={(e) => set("publisher", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3" /></Field>
        <Field label="Тип">
          <select value={data.type} onChange={(e) => set("type", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3">
            {BIBLIOGRAPHY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.ru}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Примечание (KZ)"><textarea value={data.notes_kz} onChange={(e) => set("notes_kz", e.target.value)} rows={3} className="w-full rounded-md border border-border bg-surface px-3 py-2" /></Field>
        <Field label="Примечание (RU)"><textarea value={data.notes_ru} onChange={(e) => set("notes_ru", e.target.value)} rows={3} className="w-full rounded-md border border-border bg-surface px-3 py-2" /></Field>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-hover disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Сохранить
        </button>
        <button onClick={() => router.push("/admin/bibliography")} className="rounded-md border border-border px-5 py-2.5 font-medium text-text hover:bg-bg">Отмена</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-sm font-medium text-text">{label}</label>{children}</div>;
}
