"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";

export type PoemFormData = {
  id?: string;
  title_kz: string;
  title_ru: string;
  text_kz: string;
  text_ru: string;
  yearWritten: string;
  audioFile: string | null;
};

export function PoemForm({ initial }: { initial: PoemFormData }) {
  const router = useRouter();
  const [data, setData] = useState<PoemFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof PoemFormData>(k: K, v: PoemFormData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function save() {
    setError("");
    if (!data.title_kz.trim() && !data.title_ru.trim()) {
      setError("Укажите заголовок");
      return;
    }
    setSaving(true);
    try {
      const url = data.id ? `/api/poems/${data.id}` : "/api/poems";
      const res = await fetch(url, {
        method: data.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Ошибка");
      router.push("/admin/poems");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Заголовок (KZ)"><input value={data.title_kz} onChange={(e) => set("title_kz", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3" /></Field>
        <Field label="Заголовок (RU)"><input value={data.title_ru} onChange={(e) => set("title_ru", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3" /></Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Текст (KZ)"><textarea value={data.text_kz} onChange={(e) => set("text_kz", e.target.value)} rows={12} className="w-full rounded-md border border-border bg-surface px-3 py-2 font-serif leading-relaxed" /></Field>
        <Field label="Текст (RU)"><textarea value={data.text_ru} onChange={(e) => set("text_ru", e.target.value)} rows={12} className="w-full rounded-md border border-border bg-surface px-3 py-2 font-serif leading-relaxed" /></Field>
      </div>
      <div className="max-w-xs">
        <Field label="Год написания"><input type="number" value={data.yearWritten} onChange={(e) => set("yearWritten", e.target.value)} className="h-10 w-full rounded-md border border-border bg-surface px-3" /></Field>
      </div>
      <ImageUpload kind="audio" value={data.audioFile} onChange={(url) => set("audioFile", url)} label="Аудио (MP3, необязательно)" />

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-hover disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Сохранить
        </button>
        <button onClick={() => router.push("/admin/poems")} className="rounded-md border border-border px-5 py-2.5 font-medium text-text hover:bg-bg">Отмена</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-sm font-medium text-text">{label}</label>{children}</div>;
}
