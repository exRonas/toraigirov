# 🚀 Развёртывание энциклопедии Торайгырова на Windows Server 2019

**Стек:** Node.js + Next.js + Nginx + NSSM (Windows Service)

---

## 📋 Требования

- Windows Server 2019
- Администраторский доступ
- Статический IP-адрес сервера (для внешнего доступа)
- Доменное имя или IP-адрес

---

## ✅ Этап 1: Подготовка сервера Windows

### 1.1 Установка Node.js

1. Скачай Node.js LTS с https://nodejs.org/
   - **Рекомендуемая версия:** 20.x или 22.x LTS
   - Выбери **Windows Installer (.msi)**

2. Запусти инсталлер с правами администратора
   - Выбери "Add to PATH" (обязательно!)
   - Остальные параметры по умолчанию

3. Проверь установку в PowerShell:
   ```powershell
   node --version
   npm --version
   ```

### 1.2 Установка Git (опционально, но рекомендуется)

1. Скачай Git с https://git-scm.com/download/win
2. Установи с параметрами по умолчанию
3. Проверь:
   ```powershell
   git --version
   ```

### 1.3 Установка NSSM (Non-Sucking Service Manager)

1. Скачай NSSM отсюда: https://nssm.cc/download
   - Выбери последнюю версию (обычно `nssm-2.24-xxx.zip`)

2. Распакуй в `C:\nssm\` (создай папку)

3. Добавь NSSM в PATH:
   - Открой **System Properties** → **Environment Variables**
   - Добавь `C:\nssm\win64` (или `win32` если система 32-бит) в **Path**

4. Проверь:
   ```powershell
   nssm --version
   ```

---

## 📂 Этап 2: Развёртывание приложения

### 2.1 Копирование проекта

1. Создай папку для приложения:
   ```powershell
   mkdir "C:\Apps\toraygyrov-encyclopedia"
   ```

2. Скопируй весь проект туда (вариант 1 - через Git):
   ```powershell
   cd "C:\Apps"
   git clone <URL-репозитория> toraygyrov-encyclopedia
   ```

   **Или вариант 2 - скопируй локально:**
   ```powershell
   # Скопируй папку со своего рабочего компьютера на сервер
   # (используй RDP, SFTP, или мобильный жёсткий диск)
   ```

### 2.2 Установка зависимостей

```powershell
cd "C:\Apps\toraygyrov-encyclopedia"
npm install
```

⏱️ Это займёт 5-10 минут (зависит от скорости интернета)

### 2.3 Создание .env файла

Создай `C:\Apps\toraygyrov-encyclopedia\.env` с содержимым:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_SECRET="your-very-long-random-secret-here-min-32-chars"
NEXTAUTH_URL="https://yourdomain.com"  # Или "http://server-ip:3000" для локального тестирования

# Admin credentials (ВАЖНО: используй base64-encoded bcrypt hash!)
ADMIN_PASSWORD_HASH_B64="ваш-base64-hash-здесь"
```

**Как создать ADMIN_PASSWORD_HASH_B64:**

1. На локальном компьютере в Node.js:
   ```javascript
   const bcrypt = require('bcryptjs');
   const password = "Pavlodar@Lib2025!";  // Меняй на свой пароль!
   const hash = bcrypt.hashSync(password, 10);
   const base64 = Buffer.from(hash).toString('base64');
   console.log(base64);
   ```

2. Скопируй результат в `.env` как `ADMIN_PASSWORD_HASH_B64`

3. Для NEXTAUTH_SECRET сгенерируй случайную строку:
   ```powershell
   # В PowerShell
   -join ((1..32) | ForEach-Object { [char](Get-Random -Minimum 33 -Maximum 127) })
   ```

### 2.4 Инициализация БД

```powershell
cd "C:\Apps\toraygyrov-encyclopedia"
npx prisma migrate deploy
npx prisma db seed  # Если есть seed скрипт
```

### 2.5 Сборка проекта

```powershell
npm run build
```

⏱️ Это займёт 2-5 минут

---

## 🔧 Этап 3: Настройка Nginx

### 3.1 Создание конфигурации Nginx

1. Найди файл конфигурации: `C:\nginx\conf\nginx.conf`
   - Если Nginx ещё не установлен, скачай с https://nginx.org/en/download.html

2. Отредактируй или создай файл `C:\nginx\conf\sites-available\toraygyrov.conf`:

```nginx
upstream nodejs_backend {
    server localhost:3000;
    keepalive 64;
}

# Редирект с HTTP на HTTPS (опционально, если есть SSL)
server {
    listen 80;
    server_name yourdomain.com;  # Меняй на свой домен/IP
    
    # Для Let's Encrypt проверки (если будешь использовать SSL)
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Редирект на HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS конфигурация (основной сервер)
server {
    listen 443 ssl http2;
    server_name yourdomain.com;  # Меняй на свой домен/IP
    
    # SSL сертификаты (если используешь HTTPS)
    # ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Для локального тестирования (без SSL):
    # Удали две строки выше
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Размер загружаемых файлов (для видео)
    client_max_body_size 500M;
    
    # Проксирование на Node.js
    location / {
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Таймауты для больших файлов
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }
    
    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Логирование
    access_log C:/nginx/logs/toraygyrov-access.log;
    error_log C:/nginx/logs/toraygyrov-error.log warn;
}
```

### 3.2 Включение конфигурации в основной nginx.conf

В файле `C:\nginx\conf\nginx.conf` в блоке `http { }` добавь:

```nginx
http {
    # ... остальная конфигурация ...
    
    include C:/nginx/conf/sites-available/*.conf;
}
```

### 3.3 Проверка конфигурации

```powershell
cd "C:\nginx"
.\nginx.exe -t
```

Должен вывести:
```
nginx: the configuration file C:\nginx\conf\nginx.conf syntax is ok
nginx: configuration file C:\nginx\conf\nginx.conf test is successful
```

### 3.4 Перезагрузка Nginx

```powershell
# Если Nginx уже работает как сервис:
Restart-Service nginx

# Или если запущен вручную:
.\nginx.exe -s reload
```

---

## 🛠️ Этап 4: Создание Windows Service через NSSM

### 4.1 Создание сервиса для Node.js приложения

```powershell
# Открой PowerShell от администратора!

# Переменные
$appName = "ToraygyrovEncyclopedia"
$appPath = "C:\Apps\toraygyrov-encyclopedia"
$nodePath = "C:\Program Files\nodejs\node.exe"  # Проверь путь установки Node.js
$startScript = "$appPath\node_modules\.bin\next start"

# Создание сервиса
nssm install $appName $nodePath "$startScript"

# Установка рабочей директории
nssm set $appName AppDirectory $appPath

# Установка переменных окружения
nssm set $appName AppEnvironmentExtra "NODE_ENV=production"

# Автоперезапуск при падении
nssm set $appName AppExit Default Restart
nssm set $appName AppRestartDelay 5000  # Задержка 5 сек перед перезапуском

# Логирование
nssm set $appName AppStdout "C:\Apps\toraygyrov-encyclopedia\logs\stdout.log"
nssm set $appName AppStderr "C:\Apps\toraygyrov-encyclopedia\logs\stderr.log"

# Ротация логов
nssm set $appName AppRotateFiles 1
nssm set $appName AppRotateOnline 1
nssm set $appName AppRotateSeconds 86400  # Ротация каждый день
nssm set $appName AppRotateBytes 104857600  # Или при размере 100MB

# Запуск сервиса
nssm start $appName
```

### 4.2 Проверка статуса сервиса

```powershell
# Проверь статус
nssm status ToraygyrovEncyclopedia

# Должен вывести "SERVICE_RUNNING" если всё ОК
```

### 4.3 Управление сервисом

```powershell
# Остановить
nssm stop ToraygyrovEncyclopedia

# Перезагрузить
nssm restart ToraygyrovEncyclopedia

# Удалить (если нужно переустановить)
nssm remove ToraygyrovEncyclopedia confirm
```

### 4.4 Проверка логов

```powershell
# Просмотр логов приложения
Get-Content "C:\Apps\toraygyrov-encyclopedia\logs\stdout.log" -Tail 50 -Wait

# Или в Event Viewer (для системных ошибок)
# Applications and Services Logs → System → Events
```

---

## 🌐 Этап 5: Открытие доступа из интернета

### 5.1 Открытие портов на Windows Server

```powershell
# От администратора в PowerShell

# Открыть порт 80 (HTTP)
New-NetFirewallRule -DisplayName "Allow HTTP" `
  -Direction Inbound -Protocol tcp -LocalPort 80 -Action Allow

# Открыть порт 443 (HTTPS)
New-NetFirewallRule -DisplayName "Allow HTTPS" `
  -Direction Inbound -Protocol tcp -LocalPort 443 -Action Allow
```

### 5.2 Настройка маршрутизатора (если сервер за NAT)

1. Открой веб-интерфейс маршрутизатора (обычно 192.168.1.1)
2. Найди **Port Forwarding** или **Проброс портов**
3. Пробрось:
   - **Внешний порт 80** → **Внутренний IP сервера:80**
   - **Внешний порт 443** → **Внутренний IP сервера:443**

### 5.3 Настройка DNS (если есть доменное имя)

1. У провайдера доменного имени добавь A-запись:
   ```
   yourdomain.com  A  ваш-публичный-IP-адрес
   ```

2. Обнови `server_name` в конфиге Nginx на твой домен

3. Перезагрузи Nginx:
   ```powershell
   Restart-Service nginx
   ```

### 5.4 SSL сертификат (рекомендуется)

Используй **Certbot** для бесплатного сертификата Let's Encrypt:

1. Установи Certbot на Windows
2. Выполни:
   ```powershell
   certbot certonly --webroot -w "C:\nginx\html" -d yourdomain.com
   ```
3. Обнови пути в `nginx.conf`
4. Перезагрузи Nginx

---

## ✔️ Этап 6: Проверка и тестирование

### 6.1 Локальная проверка

```powershell
# На сервере откройте браузер и перейдите
http://localhost
# или
http://localhost:3000
```

Должна открыться энциклопедия.

### 6.2 Проверка из интернета

1. На своем компьютере откройся браузер
2. Перейди на `http://yourdomain.com` или `http://server-ip`
3. Проверь, что всё загружается

### 6.3 Проверка логов

```powershell
# Проверь логи Nginx
Get-Content "C:\nginx\logs\error.log" -Tail 20

# Проверь логи приложения
Get-Content "C:\Apps\toraygyrov-encyclopedia\logs\stdout.log" -Tail 50
```

---

## 🔄 Обновление приложения (на боевом сервере)

### Процедура обновления:

```powershell
# 1. Останови сервис
nssm stop ToraygyrovEncyclopedia

# 2. Обнови код (через git pull или копирование)
cd "C:\Apps\toraygyrov-encyclopedia"
git pull origin main
# или
# Скопируй обновленные файлы

# 3. Обнови зависимости (если они изменились)
npm install

# 4. Пересоберись
npm run build

# 5. Обнови БД (если есть миграции)
npx prisma migrate deploy

# 6. Перезапусти сервис
nssm start ToraygyrovEncyclopedia

# 7. Проверь логи
Get-Content "C:\Apps\toraygyrov-encyclopedia\logs\stdout.log" -Tail 30 -Wait
```

---

## 🆘 Решение проблем

### Проблема: Node.js приложение не запускается

**Решение:**
```powershell
# Проверь логи
Get-Content "C:\Apps\toraygyrov-encyclopedia\logs\stderr.log"

# Попробуй запустить вручную
cd "C:\Apps\toraygyrov-encyclopedia"
npm start
```

### Проблема: Nginx не может подключиться к приложению

**Решение:**
```powershell
# Проверь, что приложение слушает на 3000
netstat -ano | findstr :3000

# Проверь конфигурацию Nginx
cd "C:\nginx"
.\nginx.exe -t

# Проверь логи Nginx
Get-Content "C:\nginx\logs\error.log" -Tail 50
```

### Проблема: Сервис постоянно перезагружается

**Решение:**
```powershell
# Смотри логи ошибок
Get-Content "C:\Apps\toraygyrov-encyclopedia\logs\stderr.log" -Tail 100

# Возможные причины:
# 1. Неправильный .env файл
# 2. БД не инициализирована (npx prisma migrate deploy)
# 3. NODE_ENV не установлен
```

### Проблема: Доступ из интернета не работает

**Решение:**
```powershell
# 1. Проверь брандмауэр
Get-NetFirewallRule -DisplayName "Allow HTTP" | Format-List

# 2. Проверь, что Nginx работает
Get-Service nginx

# 3. Проверь маршрутизатор (Port Forwarding)
# Открой cmd и выполни:
ipconfig  # Найди Local IP адрес сервера

# 4. Проверь DNS (если используешь домен)
nslookup yourdomain.com
```

---

## 📊 Мониторинг и поддержка

### Проверка ресурсов:

```powershell
# CPU и RAM использование сервиса
Get-Process | Where-Object {$_.Name -eq "node"} | Format-Table Name, CPU, Memory

# Дисковое пространство
Get-Volume | Format-Table DriveLetter, Size, SizeRemaining
```

### Автоматический перезапуск сервера (опционально):

```powershell
# Если нужен еженощный перезапуск приложения (для очистки памяти)
# Используй Task Scheduler

$action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-Command 'nssm restart ToraygyrovEncyclopedia'"
$trigger = New-ScheduledTaskTrigger -Daily -At 3:00AM
Register-ScheduledTask -Action $action -Trigger $trigger `
  -TaskName "Restart-Toraygyrov-App" -RunLevel Highest
```

---

## 📞 Контакты и поддержка

Если что-то не работает:
1. Проверь логи (этап 6.3)
2. Убедись, что все процессы запущены:
   ```powershell
   Get-Service nginx
   nssm status ToraygyrovEncyclopedia
   ```
3. Перезагрузи сервер в критическом случае

---

**Версия:** 1.0  
**Дата:** 2026-06-06  
**Статус:** Production-ready
