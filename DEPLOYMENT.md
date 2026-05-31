# Руководство по развёртыванию

Виртуальная энциклопедия С. Торайгырова — Next.js 14 (App Router) + Prisma +
SQLite + NextAuth v5. База данных — единственный файл `prisma/database.db`,
внешний сервер БД **не требуется**.

Краткий старт (после заполнения `.env.local`):

```bash
npm install
npx prisma migrate deploy
npx prisma db seed     # один раз, для начального наполнения
npm run build
npm start
```

Сайт: `http://localhost:3000` · Админка: `http://localhost:3000/admin`

---

## 1. Требования

| Компонент | Версия |
|-----------|--------|
| Node.js   | 18 LTS или новее (рекомендуется 20 LTS) |
| npm       | 9+ |
| Git       | любой актуальный |

### Windows Server 2019
1. Скачайте установщик Node.js LTS с https://nodejs.org (файл `.msi`) и установите.
2. Установите Git for Windows: https://git-scm.com/download/win
3. Проверка в PowerShell:
   ```powershell
   node -v
   npm -v
   git --version
   ```

### Ubuntu 22.04
```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
node -v && npm -v && git --version
```

---

## 2. Установка (одинаково для Windows и Linux)

```bash
# 1. Получить код
git clone <repository-url> toraygyrov
cd toraygyrov

# 2. Установить зависимости
npm install

# 3. Создать файл переменных окружения
cp .env.example .env.local        # Windows PowerShell: Copy-Item .env.example .env.local
```

### 3.1 Заполните `.env.local`

```env
DATABASE_URL="file:./database.db"
AUTH_SECRET="<случайная-строка-32+>"
NEXTAUTH_SECRET="<та-же-строка>"
NEXTAUTH_URL="https://ваш-домен.kz"
AUTH_TRUST_HOST="true"
ADMIN_EMAIL="admin@library.kz"
ADMIN_PASSWORD_HASH="<bcrypt-хеш>"
NEXT_PUBLIC_UPLOAD_URL="/uploads"
```

Сгенерировать `AUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.2 Сгенерируйте `ADMIN_PASSWORD_HASH`

```bash
node -e "const b=require('bcryptjs');console.log(b.hashSync('ВАШ_ПАРОЛЬ',10))"
```
Скопируйте вывод (начинается с `$2a$10$…` или `$2b$10$…`) в `ADMIN_PASSWORD_HASH`.

> ⚠️ Значение хеша содержит символы `$`. В `.env.local` оставьте его в двойных
> кавычках — Next.js читает файл буквально и не выполняет подстановку переменных.

### 3.3 Применить миграции, наполнить и собрать

```bash
npx prisma migrate deploy   # создаёт database.db + таблицы + FTS5-индекс
npx prisma db seed          # настройки, 10 страниц разделов, категории, демо
npm run build               # prisma generate + next build
npm start                   # запуск на порту 3000
```

> Команда `db seed` идемпотентна (использует upsert), но обычно запускается один
> раз — при первом развёртывании. Повторный запуск не дублирует данные.

Учётная запись по умолчанию (если использовали пароль из примера): 
`admin@library.kz` / `admin123`. **Обязательно смените пароль перед публикацией.**

---

## 4. Запуск как службы

### 4.1 Windows Server 2019 — PM2

```powershell
npm install -g pm2 pm2-windows-startup

# запустить приложение
pm2 start npm --name "toraygyrov" -- start

# автозапуск при перезагрузке
pm2-startup install
pm2 save
```

Управление:
```powershell
pm2 status
pm2 logs toraygyrov
pm2 restart toraygyrov
pm2 stop toraygyrov
```

### 4.2 Ubuntu 22.04 — вариант A: PM2

```bash
sudo npm install -g pm2
pm2 start npm --name "toraygyrov" -- start
pm2 startup systemd     # выполните команду, которую выведет pm2
pm2 save
```

### 4.2 Ubuntu 22.04 — вариант B: systemd

Создайте `/etc/systemd/system/toraygyrov.service`:

```ini
[Unit]
Description=Toraygyrov Virtual Encyclopedia (Next.js)
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/toraygyrov
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now toraygyrov
sudo systemctl status toraygyrov
journalctl -u toraygyrov -f      # логи
```

---

## 5. Nginx (обратный прокси + HTTPS)

`/etc/nginx/sites-available/toraygyrov`:

```nginx
server {
    listen 80;
    server_name toraygyrov.example.kz;

    client_max_body_size 25M;   # под загрузку изображений/MP3

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Долгое кеширование статики и загруженных файлов
    location /uploads/ {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/toraygyrov /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### HTTPS через Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d toraygyrov.example.kz
# автопродление уже настроено таймером certbot.timer
```
После выпуска сертификата установите `NEXTAUTH_URL="https://toraygyrov.example.kz"`
в `.env.local` и перезапустите приложение.

---

## 6. Права на каталог загрузок

Процесс Node должен иметь право записи в `public/uploads/`.

### Linux
```bash
sudo chown -R www-data:www-data /var/www/toraygyrov/public/uploads
sudo chmod -R 775 /var/www/toraygyrov/public/uploads
```
(`www-data` — пользователь из systemd-юнита; при PM2 укажите своего пользователя.)

### Windows
Каталог `public\uploads` доступен на запись пользователю, под которым работает
служба PM2 (обычно текущий администратор). Дополнительная настройка не нужна.

---

## 7. Резервное копирование

Вся БД — один файл. Бэкап = копия файла (плюс каталог загрузок).

```bash
# разовый бэкап
cp prisma/database.db backups/database-$(date +%F).db
tar czf backups/uploads-$(date +%F).tgz public/uploads
```

### Автобэкап по cron (Linux)
`crontab -e`:
```cron
# каждый день в 03:00
0 3 * * * cd /var/www/toraygyrov && cp prisma/database.db /var/backups/toraygyrov-db-$(date +\%F).db && find /var/backups -name 'toraygyrov-db-*.db' -mtime +30 -delete
```

> SQLite пишет в режиме WAL/journal. Для гарантированно согласованной копии под
> нагрузкой используйте: `sqlite3 prisma/database.db ".backup '/var/backups/db.db'"`.

---

## 8. Обновление / повторное развёртывание

```bash
git pull
npm install
npx prisma migrate deploy     # применит новые миграции, если появились
npm run build
pm2 restart toraygyrov        # или: sudo systemctl restart toraygyrov
```
Файл `database.db` и каталог `uploads/` при обновлении не трогаются.

---

## 9. Устранение неполадок

**Порт 3000 занят**
```bash
# Linux
sudo lsof -i :3000          # узнать PID
kill <PID>
# или запустить на другом порту:
PORT=3001 npm start
```
```powershell
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**`database is locked` (SQLite)** — кратковременная блокировка при одновременной
записи. Сайт рассчитан на одного администратора, поэтому обычно не возникает.
Если появляется: убедитесь, что запущен только один экземпляр приложения
(`pm2 status`), и что бэкап-скрипт не копирует файл во время активной записи
(используйте `.backup`, см. раздел 7).

**Не загружаются файлы / 403 при загрузке** — проверьте права на `public/uploads`
(раздел 6) и `client_max_body_size` в Nginx (раздел 5). Лимиты приложения:
изображения JPG/PNG/WEBP до 10 МБ, аудио MP3 до 25 МБ.

**Не входит в админку** — проверьте, что `ADMIN_EMAIL` совпадает, а
`ADMIN_PASSWORD_HASH` сгенерирован для нужного пароля, и что заданы
`AUTH_SECRET` + `NEXTAUTH_URL`. После изменения `.env.local` перезапустите
приложение.

**Пустой поиск** — индекс FTS5 наполняется при создании/редактировании
материалов и командой `prisma db seed`. Существующие материалы переиндексируются
при их сохранении в админке.

---

## 10. Структура важных путей

| Путь | Назначение |
|------|-----------|
| `prisma/database.db` | вся база данных (бэкапить) |
| `public/uploads/` | загруженные изображения и аудио (бэкапить) |
| `.env.local` | секреты и настройки (не коммитить) |
| `prisma/migrations/` | схема БД + FTS5-индекс |
| `design-v0/` | исходный дизайн-прототип (справочно, в сборку не входит) |
