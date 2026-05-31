# Виртуальная энциклопедия С. Торайгырова

Двуязычный (KZ/RU) сайт-энциклопедия о казахском поэте и общественном деятеле
Султанмахмуте Торайгырове (1893–1920). Павлодарская областная научная
библиотека им. С. Торайгырова.

## Технологии
- **Next.js 14** (App Router) + TypeScript
- **Prisma + SQLite** — единый файл `prisma/database.db`, без внешнего сервера БД
- **NextAuth v5** — вход администратора (credentials)
- **Tailwind CSS** — тёплая академическая палитра (бордо/золото/слоновая кость)
- **Tiptap** — двуязычный редактор контента в админке
- **SQLite FTS5** — полнотекстовый поиск (статьи, стихи, библиография, страницы)
- **yet-another-react-lightbox** — просмотр фотоархива

## Быстрый старт
```bash
npm install
cp .env.example .env.local      # заполните значения (см. DEPLOYMENT.md §3)
npx prisma migrate deploy
npx prisma db seed
npm run build
npm start
```
- Сайт: http://localhost:3000
- Админка: http://localhost:3000/admin (по умолчанию `admin@library.kz` / `admin123`)

Полное руководство по развёртыванию (Windows Server / Ubuntu, PM2, systemd,
Nginx, HTTPS, бэкапы) — в [DEPLOYMENT.md](DEPLOYMENT.md).

## Язык
Переключение языка — query-параметр `?lang=kz` / `?lang=ru` (по умолчанию KZ).
Контент хранится в обеих языковых версиях (`*_kz` / `*_ru`).

## Разделы (10)
Биография · Творчество · Статьи и публикации · Торайгыровские чтения ·
Названы именем · С. Торайгыров в искусстве · На земле Султанмахмуда ·
Библиография · Фото/видео-архив · Стихи.

## Структура
```
app/(site)/      — публичные страницы (Header/Footer/Sidebar)
app/admin/       — админ-панель (login + защищённая панель CRUD)
app/api/         — REST API (CRUD, загрузка файлов, поиск, auth)
components/      — UI, layout, разделы, админ-компоненты
lib/             — db, auth, i18n, поиск, утилиты
prisma/          — schema, миграции (вкл. FTS5), seed
public/uploads/  — загруженные изображения и аудио
design-v0/       — исходный дизайн-прототип (справочно)
```

## Учётные данные администратора
Задаются в `.env.local`: `ADMIN_EMAIL` и `ADMIN_PASSWORD_HASH` (bcrypt).
Сгенерировать хеш:
```bash
node -e "const b=require('bcryptjs');console.log(b.hashSync('пароль',10))"
```
