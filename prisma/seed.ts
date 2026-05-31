import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Keep in sync with lib/sections.ts (seed is standalone, run via tsx).
const SECTIONS = [
  { slug: "biography", kz: "Өмірбаяны", ru: "Биография" },
  { slug: "creativity", kz: "Шығармашылық", ru: "Творчество" },
  { slug: "articles", kz: "Мақалалар мен жарияланымдар", ru: "Статьи и публикации" },
  { slug: "readings", kz: "Торайғыров оқулары", ru: "Торайгыровские чтения" },
  { slug: "named-after", kz: "Ақын есімімен аталған", ru: "Названы именем" },
  { slug: "in-art", kz: "С.Торайғыров өнерде", ru: "С.Торайгыров в искусстве" },
  { slug: "toraygyrov-land", kz: "Сұлтанмахмұт жерінде", ru: "На земле Султанмахмуда" },
  { slug: "bibliography", kz: "Библиография", ru: "Библиография" },
  { slug: "archive", kz: "Фото, видео – архив", ru: "Фото, видео – архив" },
  { slug: "poems", kz: "Өлеңдері", ru: "Стихи" },
];

const BIO_KZ =
  "<p>Сұлтанмахмұт Торайғыров (1893–1920) — қазақтың аса дарынды ақыны, ағартушы, қоғам қайраткері. Ол қысқа ғұмырында қазақ әдебиетінде өшпес із қалдырды.</p><p>Ақын өз шығармаларында халықтың ауыр тұрмысын, әділетсіздікті батыл әшкереледі, білім мен өнерге шақырды.</p>";
const BIO_RU =
  "<p>Султанмахмут Торайгыров (1893–1920) — выдающийся казахский поэт, просветитель и общественный деятель. За свою короткую жизнь он оставил неизгладимый след в казахской литературе.</p><p>В своих произведениях поэт смело обличал тяжёлую жизнь народа и несправедливость, призывал к знаниям и просвещению.</p>";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function reindex(
  docType: string,
  docId: string,
  slug: string,
  title_kz: string,
  title_ru: string,
  body_kz: string,
  body_ru: string
) {
  await prisma.$executeRaw`DELETE FROM "SearchIndex" WHERE docType = ${docType} AND docId = ${docId}`;
  await prisma.$executeRaw`
    INSERT INTO "SearchIndex" (docType, docId, slug, title_kz, title_ru, body_kz, body_ru)
    VALUES (${docType}, ${docId}, ${slug}, ${title_kz}, ${title_ru}, ${stripHtml(body_kz)}, ${stripHtml(body_ru)})`;
}

async function main() {
  // 1. Site settings singleton
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroQuote_kz: "Қараңғы қазақ көгіне, Өрмелеп шығып, күн болам!",
      heroQuote_ru: "Взойду я солнцем в тёмное казахское небо!",
      quoteAuthor_kz: "Сұлтанмахмұт Торайғыров",
      quoteAuthor_ru: "Султанмахмут Торайгыров",
      siteTitle_kz: "Виртуалды энциклопедия",
      siteTitle_ru: "Виртуальная энциклопедия",
      footerText_kz:
        "С. Торайғыров атындағы Павлодар облыстық ғылыми кітапханасы",
      footerText_ru:
        "Павлодарская областная научная библиотека имени С. Торайгырова",
      contactAddress: "ул. Академика Сатпаева, 104, Павлодар",
      contactPhone: "+7 (7182) 00-00-00",
      contactEmail: "library@pavlodar.kz",
      linkYoutube: "",
    },
  });

  // 2. Pages for every section
  for (const s of SECTIONS) {
    const isBio = s.slug === "biography";
    await prisma.page.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        title_kz: s.kz,
        title_ru: s.ru,
        content_kz: isBio ? BIO_KZ : "",
        content_ru: isBio ? BIO_RU : "",
      },
    });
    const page = await prisma.page.findUnique({ where: { slug: s.slug } });
    if (page) {
      await reindex(
        "page",
        page.id,
        page.slug,
        page.title_kz,
        page.title_ru,
        page.content_kz,
        page.content_ru
      );
    }
  }

  // 3. Photo categories
  const categories = [
    { slug: "general", name_kz: "Жалпы", name_ru: "Общее" },
    { slug: "portrait", name_kz: "Портреттер", name_ru: "Портреты" },
    { slug: "memorial", name_kz: "Ескерткіштер", name_ru: "Мемориальные" },
    { slug: "events", name_kz: "Іс-шаралар", name_ru: "События" },
  ];
  for (const c of categories) {
    await prisma.photoCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  // 4. Sample published articles (so the site is not empty on first run)
  const sampleArticles = [
    {
      sectionSlug: "biography",
      title_kz: "Сұлтанмахмұттың балалық шағы",
      title_ru: "Детские годы Султанмахмута",
      content_kz: "<p>Сұлтанмахмұт 1893 жылы Баянауыл өңірінде дүниеге келді.</p>",
      content_ru: "<p>Султанмахмут родился в 1893 году в Баянаульском крае.</p>",
    },
    {
      sectionSlug: "creativity",
      title_kz: "«Қамар сұлу» романы туралы",
      title_ru: "О романе «Камар сулу»",
      content_kz: "<p>Ақынның белгілі шығармаларының бірі — «Қамар сұлу» романы.</p>",
      content_ru: "<p>Одно из известных произведений поэта — роман «Камар сулу».</p>",
    },
    {
      sectionSlug: "articles",
      title_kz: "Торайғыров шығармашылығының зерттелуі",
      title_ru: "Изучение творчества Торайгырова",
      content_kz: "<p>Ақын мұрасы көптеген ғалымдардың назарын аударды.</p>",
      content_ru: "<p>Наследие поэта привлекло внимание многих учёных.</p>",
    },
  ];
  for (const a of sampleArticles) {
    const existing = await prisma.article.findFirst({
      where: { title_ru: a.title_ru },
    });
    if (existing) continue;
    const article = await prisma.article.create({
      data: { ...a, isDraft: false, publishedAt: new Date() },
    });
    await reindex(
      "article",
      article.id,
      article.sectionSlug,
      article.title_kz,
      article.title_ru,
      article.content_kz,
      article.content_ru
    );
  }

  // 5. Sample poem
  const poemExists = await prisma.poem.findFirst({
    where: { title_ru: "Желание" },
  });
  if (!poemExists) {
    const poem = await prisma.poem.create({
      data: {
        title_kz: "Талап",
        title_ru: "Желание",
        text_kz: "Қараңғы қазақ көгіне,\nӨрмелеп шығып, күн болам!",
        text_ru: "Взойду я солнцем\nв тёмное казахское небо!",
        yearWritten: 1912,
      },
    });
    await reindex(
      "poem",
      poem.id,
      "",
      poem.title_kz,
      poem.title_ru,
      poem.text_kz,
      poem.text_ru
    );
  }

  console.log("✔ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
