import type { Lang } from "@/lib/i18n";

// Static UI strings (site chrome). Content lives in the database.
type Dict = Record<string, { kz: string; ru: string }>;

export const UI: Dict = {
  "nav.home": { kz: "Басты бет", ru: "Главная" },
  "nav.search": { kz: "Іздеу", ru: "Поиск" },
  "nav.menu": { kz: "Мәзір", ru: "Меню" },
  "nav.close": { kz: "Жабу", ru: "Закрыть" },
  "nav.admin": { kz: "Әкімші", ru: "Админ" },

  "site.virtualEncyclopedia": { kz: "Виртуалды энциклопедия", ru: "Виртуальная энциклопедия" },
  "site.years": { kz: "1893–1920", ru: "1893–1920" },
  "site.libraryLink": { kz: "Кітапхана сайты", ru: "Сайт библиотеки" },

  "common.readMore": { kz: "Толығырақ", ru: "Читать далее" },
  "common.backTo": { kz: "Бөлімге оралу", ru: "Назад к разделу" },
  "common.loading": { kz: "Жүктелуде…", ru: "Загрузка…" },
  "common.all": { kz: "Барлығы", ru: "Все" },
  "common.print": { kz: "Басып шығару", ru: "Печать" },
  "common.share": { kz: "Бөлісу", ru: "Поделиться" },
  "common.copyLink": { kz: "Сілтемені көшіру", ru: "Копировать ссылку" },
  "common.copied": { kz: "Көшірілді!", ru: "Скопировано!" },
  "common.date": { kz: "Күні", ru: "Дата" },
  "common.year": { kz: "Жылы", ru: "Год" },
  "common.author": { kz: "Авторы", ru: "Автор" },
  "common.category": { kz: "Санаты", ru: "Категория" },
  "common.empty": { kz: "Бұл бөлімде әзірге мазмұн жоқ.", ru: "В этом разделе пока нет материалов." },
  "common.notFoundTitle": { kz: "Бет табылмады", ru: "Страница не найдена" },
  "common.notFoundText": { kz: "Сұралған бет жоқ немесе жойылған.", ru: "Запрашиваемая страница не существует или была удалена." },
  "common.errorTitle": { kz: "Қате орын алды", ru: "Произошла ошибка" },
  "common.errorText": { kz: "Серверде күтпеген қате. Кейінірек қайталап көріңіз.", ru: "Непредвиденная ошибка сервера. Попробуйте позже." },
  "common.tryAgain": { kz: "Қайталау", ru: "Повторить" },
  "common.goHome": { kz: "Басты бетке", ru: "На главную" },

  "home.heroAlt": { kz: "Сұлтанмахмұт Торайғыров портреті", ru: "Портрет Султанмахмута Торайгырова" },
  "home.bioTitle": { kz: "Өмірбаяны", ru: "Биография" },
  "home.latestArticles": { kz: "Соңғы жарияланымдар", ru: "Последние публикации" },
  "home.sections": { kz: "Бөлімдер", ru: "Разделы" },
  "home.fullName": { kz: "Сұлтанмахмұт Торайғыров", ru: "Султанмахмут Торайгыров" },

  "fontSize.label": { kz: "Қаріп өлшемі", ru: "Размер шрифта" },
  "fontSize.small": { kz: "Кіші қаріп", ru: "Маленький шрифт" },
  "fontSize.medium": { kz: "Орташа қаріп", ru: "Средний шрифт" },
  "fontSize.large": { kz: "Үлкен қаріп", ru: "Большой шрифт" },

  "search.title": { kz: "Іздеу", ru: "Поиск" },
  "search.placeholder": { kz: "Іздеу…", ru: "Поиск…" },
  "search.resultsFor": { kz: "Сұрау бойынша нәтижелер", ru: "Результаты по запросу" },
  "search.noResults": { kz: "Ештеңе табылмады", ru: "Ничего не найдено" },
  "search.noResultsHint": { kz: "Басқа сөздермен іздеп көріңіз.", ru: "Попробуйте изменить запрос." },
  "search.typeAll": { kz: "Барлығы", ru: "Все" },
  "search.typeArticles": { kz: "Мақалалар", ru: "Статьи" },
  "search.typePoems": { kz: "Өлеңдер", ru: "Стихи" },
  "search.typeBibliography": { kz: "Библиография", ru: "Библиография" },
  "search.typePages": { kz: "Беттер", ru: "Страницы" },

  "poems.year": { kz: "Жазылған жылы", ru: "Год написания" },
  "poems.listenAudio": { kz: "Тыңдау", ru: "Аудио" },
  "poems.kzVersion": { kz: "Қазақша", ru: "На казахском" },
  "poems.ruVersion": { kz: "Орысша", ru: "На русском" },

  "biblio.filterType": { kz: "Түрі бойынша", ru: "По типу" },

  "video.watch": { kz: "Қарау", ru: "Смотреть" },
  "archive.photos": { kz: "Фото", ru: "Фото" },
  "archive.videos": { kz: "Видео", ru: "Видео" },

  "footer.contacts": { kz: "Байланыс", ru: "Контакты" },
  "footer.followUs": { kz: "Әлеуметтік желілер", ru: "Мы в соцсетях" },
  "footer.sections": { kz: "Бөлімдер", ru: "Разделы" },
  "footer.rights": { kz: "Барлық құқықтар қорғалған", ru: "Все права защищены" },

  "related.title": { kz: "Ұқсас мақалалар", ru: "Похожие статьи" },
};

export function makeTr(lang: Lang) {
  return (key: string): string => {
    const entry = UI[key];
    if (!entry) return key;
    return lang === "ru" ? entry.ru : entry.kz;
  };
}
