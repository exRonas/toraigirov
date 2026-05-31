import { PoemForm } from "@/components/admin/poem-form";

export default function NewPoemPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-text">Новый стих</h1>
      <PoemForm
        initial={{ title_kz: "", title_ru: "", text_kz: "", text_ru: "", yearWritten: "", audioFile: null }}
      />
    </div>
  );
}
