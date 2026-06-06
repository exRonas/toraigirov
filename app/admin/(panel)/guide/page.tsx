import { HelpCircle } from "lucide-react";
import { SECTIONS } from "@/lib/sections";

export const dynamic = "force-dynamic";

const GUIDE_ITEMS = [
  {
    title: "Статьи и материалы",
    icon: "📄",
    description: "Добавление статей, биографических заметок, исследований",
    sections: [
      { slug: "biography", name: "Биография", count: "Основная информация о жизни С. Торайгырова" },
      { slug: "creativity", name: "Творчество", count: "Анализ произведений и творческого наследия" },
      { slug: "articles", name: "Статьи и публикации", count: "Научные статьи и публикации об авторе" },
      { slug: "readings", name: "Торайгыровские чтения", count: "Материалы и отчёты с конференций" },
      { slug: "named-after", name: "Названы именем", count: "Информация об учреждениях и объектах" },
      { slug: "in-art", name: "С.Торайгыров в искусстве", count: "Экранизации, постановки, произведения искусства" },
      { slug: "toraygyrov-land", name: "На земле Султанмахмуда", count: "Историческая информация о местах" },
    ],
    steps: [
      "Перейдите в раздел «Статьи» в меню",
      "Выберите нужный раздел из выпадающего списка (Биография, Творчество и т.д.)",
      "Нажмите кнопку «Добавить статью»",
      "Заполните название на казахском и русском языках",
      "Добавьте содержание (поддерживается форматирование текста, ссылки, списки)",
      "Загрузьте обложку (опционально)",
      "Выберите статус (Черновик или Опубликовано)",
      "Сохраните статью",
    ],
  },
  {
    title: "Стихи",
    icon: "✍️",
    description: "Добавление поэтических произведений С. Торайгырова",
    steps: [
      "Перейдите в раздел «Стихи»",
      "Нажмите «Добавить стихотворение»",
      "Введите название на казахском и русском языках",
      "Укажите год написания (опционально)",
      "Введите текст на казахском языке",
      "Введите текст на русском языке (перевод)",
      "Загрузьте аудиофайл (опционально, MP3)",
      "Сохраните стихотворение",
    ],
  },
  {
    title: "Фото и видео архив",
    icon: "🎬",
    description: "Управление медиа-контентом: фотографиями и видеозаписями",
    steps: [
      "Перейдите в раздел «Фото / Видео архив»",
      "ВКЛАДКА «Вводный текст»: добавьте описание архива на обоих языках",
      "ВКЛАДКА «Фотоархив»:",
      "  • Создавайте категории через поле ввода",
      "  • Перетащите фото или нажмите для загрузки (JPG, PNG, WEBP, макс 10 МБ)",
      "  • Добавьте название и альтернативный текст",
      "  • Измените порядок кнопками ↑↓",
      "ВКЛАДКА «Видеоархив» → YouTube:",
      "  • Вставьте ссылку на YouTube видео",
      "  • Добавьте название на обоих языках",
      "ВКЛАДКА «Видеоархив» → MP4-файл:",
      "  • Введите название видео (обязательно)",
      "  • Перетащите MP4-файл (макс 500 МБ)",
      "  • Обложка генерируется автоматически из первого кадра",
    ],
  },
  {
    title: "Библиография",
    icon: "📚",
    description: "Управление списками книг, статей, диссертаций",
    steps: [
      "Перейдите в раздел «Библиография»",
      "Нажмите «Добавить источник»",
      "Выберите тип: Книга, Статья, Диссертация или Прочее",
      "Заполните автора(ов)",
      "Введите название на казахском и русском",
      "Укажите год (опционально)",
      "Введите издателя (опционально)",
      "Добавьте примечания на обоих языках (опционально)",
      "Сохраните",
    ],
  },
  {
    title: "Страницы разделов",
    icon: "📋",
    description: "Редактирование вводного текста для каждого раздела",
    steps: [
      "Перейдите в раздел «Страницы разделов»",
      "Нажмите на название раздела, который хотите отредактировать",
      "Отредактируйте название раздела (опционально)",
      "Отредактируйте вводный текст, который появляется в начале раздела",
      "Текст поддерживает форматирование (жирный, курсив, списки, ссылки)",
      "Сохраните изменения",
    ],
  },
  {
    title: "Настройки сайта",
    icon: "⚙️",
    description: "Основные параметры и информация на сайте",
    steps: [
      "Перейдите в раздел «Настройки»",
      "Редактируйте основную информацию сайта",
      "Изменяйте цитату в хиросе",
      "Обновляйте текст в подвале",
      "Добавляйте ссылки на соцсети (VK, Facebook, Telegram, Instagram, YouTube)",
      "Заполняйте контактную информацию",
      "Сохраняйте все изменения",
    ],
  },
];

export default function GuidePage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <HelpCircle className="h-8 w-8 text-primary" />
        <h1 className="font-serif text-3xl font-bold text-text">Гайд по управлению контентом</h1>
      </div>

      <p className="mb-10 text-text-muted">
        Пошаговые инструкции для каждого раздела энциклопедии Торайгырова. Следуйте шагам ниже, чтобы добавлять и редактировать контент.
      </p>

      <div className="space-y-12">
        {GUIDE_ITEMS.map((item) => (
          <div key={item.title} className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border bg-bg px-6 py-4">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h2 className="font-serif text-xl font-semibold text-text">{item.title}</h2>
                <p className="text-sm text-text-muted">{item.description}</p>
              </div>
            </div>

            {/* Sections list (if applicable) */}
            {item.sections && (
              <div className="border-b border-border bg-bg/50 px-6 py-4">
                <p className="mb-3 text-sm font-medium text-text">Разделы:</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {item.sections.map((sec) => (
                    <li key={sec.slug} className="rounded border border-border/50 bg-surface px-3 py-2 text-sm">
                      <span className="font-medium text-text">{sec.name}</span>
                      <p className="text-xs text-text-muted">{sec.count}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Steps */}
            <div className="px-6 py-6">
              <h3 className="mb-4 font-semibold text-text">Как добавлять:</h3>
              <ol className="space-y-2">
                {item.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-text-muted">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-12 rounded-xl border border-border bg-primary/5 p-6">
        <h2 className="mb-4 font-semibold text-text">Быстрые ссылки на администраторские разделы:</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <a href="/admin/articles" className="block rounded-lg border border-primary/20 bg-white p-3 hover:bg-primary/5">
            <p className="font-medium text-primary">📄 Статьи</p>
            <p className="text-xs text-text-muted">Добавление и редактирование статей</p>
          </a>
          <a href="/admin/poems" className="block rounded-lg border border-primary/20 bg-white p-3 hover:bg-primary/5">
            <p className="font-medium text-primary">✍️ Стихи</p>
            <p className="text-xs text-text-muted">Управление поэтическими произведениями</p>
          </a>
          <a href="/admin/archive" className="block rounded-lg border border-primary/20 bg-white p-3 hover:bg-primary/5">
            <p className="font-medium text-primary">🎬 Архив</p>
            <p className="text-xs text-text-muted">Фото, видео и вводный текст</p>
          </a>
          <a href="/admin/bibliography" className="block rounded-lg border border-primary/20 bg-white p-3 hover:bg-primary/5">
            <p className="font-medium text-primary">📚 Библиография</p>
            <p className="text-xs text-text-muted">Список источников и литературы</p>
          </a>
          <a href="/admin/pages" className="block rounded-lg border border-primary/20 bg-white p-3 hover:bg-primary/5">
            <p className="font-medium text-primary">📋 Страницы</p>
            <p className="text-xs text-text-muted">Вводные тексты разделов</p>
          </a>
          <a href="/admin/settings" className="block rounded-lg border border-primary/20 bg-white p-3 hover:bg-primary/5">
            <p className="font-medium text-primary">⚙️ Настройки</p>
            <p className="text-xs text-text-muted">Основная информация сайта</p>
          </a>
        </div>
      </div>
    </div>
  );
}
