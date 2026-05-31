// Canonical list of encyclopedia sections.
// `href` points at the public route; some sections are list pages (articles,
// poems, bibliography, archive) and some are static content pages.

export type SectionDef = {
  slug: string;
  kz: string;
  ru: string;
  icon: string; // lucide-react icon name
  href: string;
  // If true, the section renders Articles filtered by sectionSlug + its static Page.
  hasArticles: boolean;
};

export const SECTIONS: SectionDef[] = [
  { slug: "biography", kz: "Өмірбаяны", ru: "Биография", icon: "User", href: "/biography", hasArticles: true },
  { slug: "creativity", kz: "Шығармашылық", ru: "Творчество", icon: "Feather", href: "/creativity", hasArticles: true },
  { slug: "articles", kz: "Мақалалар мен жарияланымдар", ru: "Статьи и публикации", icon: "Newspaper", href: "/articles", hasArticles: true },
  { slug: "readings", kz: "Торайғыров оқулары", ru: "Торайгыровские чтения", icon: "BookOpen", href: "/readings", hasArticles: true },
  { slug: "named-after", kz: "Ақын есімімен аталған", ru: "Названы именем", icon: "MapPin", href: "/named-after", hasArticles: true },
  { slug: "in-art", kz: "С.Торайғыров өнерде", ru: "С.Торайгыров в искусстве", icon: "Palette", href: "/in-art", hasArticles: true },
  { slug: "toraygyrov-land", kz: "Сұлтанмахмұт жерінде", ru: "На земле Султанмахмуда", icon: "Mountain", href: "/toraygyrov-land", hasArticles: true },
  { slug: "bibliography", kz: "Библиография", ru: "Библиография", icon: "Library", href: "/bibliography", hasArticles: false },
  { slug: "archive", kz: "Фото, видео – архив", ru: "Фото, видео – архив", icon: "Images", href: "/archive/photos", hasArticles: false },
  { slug: "poems", kz: "Өлеңдері", ru: "Стихи", icon: "ScrollText", href: "/poems", hasArticles: false },
];

export const SECTION_SLUGS = SECTIONS.map((s) => s.slug);

export function getSection(slug: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}

export const BIBLIOGRAPHY_TYPES = [
  { value: "book", kz: "Кітаптар", ru: "Книги" },
  { value: "article", kz: "Мақалалар", ru: "Статьи" },
  { value: "dissertation", kz: "Диссертациялар", ru: "Диссертации" },
  { value: "other", kz: "Басқа", ru: "Прочее" },
] as const;
