import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const s = await getSettings();
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-text">Настройки сайта</h1>
      <SettingsForm initial={s} />
    </div>
  );
}
