import { BibliographyForm } from "@/components/admin/bibliography-form";

export default function NewBiblioPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-text">Новая запись</h1>
      <BibliographyForm
        initial={{ author: "", title_kz: "", title_ru: "", year: "", publisher: "", type: "book", notes_kz: "", notes_ru: "" }}
      />
    </div>
  );
}
