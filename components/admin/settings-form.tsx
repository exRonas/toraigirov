"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Check } from "lucide-react";

export type SettingsData = {
  heroQuote_kz: string; heroQuote_ru: string;
  quoteAuthor_kz: string; quoteAuthor_ru: string;
  siteTitle_kz: string; siteTitle_ru: string;
  footerText_kz: string; footerText_ru: string;
  linkVk: string; linkFacebook: string; linkTelegram: string;
  linkInstagram: string; linkYoutube: string;
  contactAddress: string; contactPhone: string; contactEmail: string;
};

export function SettingsForm({ initial }: { initial: SettingsData }) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof SettingsData>(k: K, v: string) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function save() {
    setError(""); setSaved(false); setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Section title="Цитата на главной">
        <Row>
          <Text label="Цитата (KZ)" value={data.heroQuote_kz} onChange={(v) => set("heroQuote_kz", v)} textarea />
          <Text label="Цитата (RU)" value={data.heroQuote_ru} onChange={(v) => set("heroQuote_ru", v)} textarea />
        </Row>
        <Row>
          <Text label="Автор цитаты (KZ)" value={data.quoteAuthor_kz} onChange={(v) => set("quoteAuthor_kz", v)} />
          <Text label="Автор цитаты (RU)" value={data.quoteAuthor_ru} onChange={(v) => set("quoteAuthor_ru", v)} />
        </Row>
      </Section>

      <Section title="Заголовок и подвал">
        <Row>
          <Text label="Название сайта (KZ)" value={data.siteTitle_kz} onChange={(v) => set("siteTitle_kz", v)} />
          <Text label="Название сайта (RU)" value={data.siteTitle_ru} onChange={(v) => set("siteTitle_ru", v)} />
        </Row>
        <Row>
          <Text label="Текст подвала (KZ)" value={data.footerText_kz} onChange={(v) => set("footerText_kz", v)} textarea />
          <Text label="Текст подвала (RU)" value={data.footerText_ru} onChange={(v) => set("footerText_ru", v)} textarea />
        </Row>
      </Section>

      <Section title="Социальные сети">
        <Row>
          <Text label="VK" value={data.linkVk} onChange={(v) => set("linkVk", v)} />
          <Text label="Facebook" value={data.linkFacebook} onChange={(v) => set("linkFacebook", v)} />
        </Row>
        <Row>
          <Text label="Telegram" value={data.linkTelegram} onChange={(v) => set("linkTelegram", v)} />
          <Text label="Instagram" value={data.linkInstagram} onChange={(v) => set("linkInstagram", v)} />
        </Row>
        <Text label="YouTube" value={data.linkYoutube} onChange={(v) => set("linkYoutube", v)} />
      </Section>

      <Section title="Контакты">
        <Text label="Адрес" value={data.contactAddress} onChange={(v) => set("contactAddress", v)} />
        <Row>
          <Text label="Телефон" value={data.contactPhone} onChange={(v) => set("contactPhone", v)} />
          <Text label="Email" value={data.contactEmail} onChange={(v) => set("contactEmail", v)} />
        </Row>
      </Section>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h2 className="mb-4 font-serif text-lg font-semibold text-text">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function Text({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-text">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm" />
      )}
    </div>
  );
}
