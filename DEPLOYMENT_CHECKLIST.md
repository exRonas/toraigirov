# ✅ Чек-лист развёртывания на Windows Server 2019

**Версия:** 1.0  
**Дата:** 2026-06-06  
**Статус:** Production-ready

---

## 📋 Pre-deployment (перед началом)

- [ ] Доступ администратора на Windows Server 2019
- [ ] Статический IP адрес сервера  
- [ ] Доменное имя или публичный IP адрес
- [ ] Проверена скорость интернета на сервере (не менее 5 Mbps)
- [ ] Созданы резервные копии данных

---

## 💻 Этап 1: Установка ПО (30 минут)

### Node.js
- [ ] Скачана LTS версия Node.js (20.x или 22.x)
- [ ] Установлена с добавлением в PATH
- [ ] Проверена: `node --version` и `npm --version`

### NSSM
- [ ] Скачан NSSM с https://nssm.cc/download
- [ ] Распакован в `C:\nssm\`
- [ ] Добавлен в PATH (System Properties → Environment Variables)
- [ ] Проверен: `nssm --version`

### Nginx (опционально, если не установлен)
- [ ] Скачан Nginx с https://nginx.org/
- [ ] Распакован в `C:\nginx\`
- [ ] Проверен: `C:\nginx\nginx.exe -t`

### Git (опционально)
- [ ] Установлен Git для управления версиями
- [ ] Проверен: `git --version`

---

## 📂 Этап 2: Подготовка приложения (20 минут)

### Копирование проекта
- [ ] Создана папка `C:\Apps\toraygyrov-encyclopedia`
- [ ] Скопирован весь проект туда
  - [ ] Либо через `git clone`
  - [ ] Либо вручную (копирование файлов)

### Зависимости
- [ ] Выполнена команда `npm install` в папке приложения
- [ ] ⏱️ Ожидание 5-10 минут (зависит от скорости)
- [ ] Проверено что не было ошибок

### Файл .env
- [ ] Скопирован `.env.windows-server.example` как `.env`
- [ ] Заполнены все необходимые значения:
  - [ ] DATABASE_URL правильный путь
  - [ ] NEXTAUTH_SECRET сгенерирован (минимум 32 символа)
  - [ ] ADMIN_PASSWORD_HASH_B64 создан через bcrypt
  - [ ] NEXTAUTH_URL указан правильно
- [ ] Файл .env скрыт: `attrib +h C:\Apps\toraygyrov-encyclopedia\.env`
- [ ] Права доступа установлены: только администратор может читать

### База данных
- [ ] Выполнена команда `npx prisma migrate deploy`
- [ ] Проверено что БД инициализирована без ошибок

### Сборка
- [ ] Выполнена команда `npm run build`
- [ ] ⏱️ Ожидание 2-5 минут
- [ ] Создана папка `.next` (знак успешной сборки)
- [ ] Проверены возможные ошибки в логе

---

## 🔧 Этап 3: Конфигурация Windows Service (15 минут)

### Создание сервиса через NSSM
- [ ] Запущен PowerShell от администратора
- [ ] Выполнен скрипт `scripts/deploy-windows-server.ps1`
  - [ ] Или вручную выполнены команды из DEPLOYMENT_WINDOWS_SERVER.md
- [ ] Создан сервис "ToraygyrovEncyclopedia"
- [ ] Проверен статус: `nssm status ToraygyrovEncyclopedia`
  - Результат должен быть: `SERVICE_RUNNING`

### Логирование
- [ ] Создана папка `C:\Apps\toraygyrov-encyclopedia\logs`
- [ ] Проверено что логи пишутся:
  - [ ] `logs\stdout.log` (основной лог)
  - [ ] `logs\stderr.log` (ошибки)

### Автоперезапуск
- [ ] Проверено что сервис автоматически перезагружается при падении
  - Команда: `nssm dump ToraygyrovEncyclopedia`
  - Должны быть параметры AppExit и AppRestartDelay

---

## 🌐 Этап 4: Конфигурация Nginx (20 минут)

### Основной конфиг
- [ ] Скопирован файл `nginx/toraygyrov.conf` в `C:\nginx\conf\sites-available\`
- [ ] Отредактирован для твоего доменного имени/IP:
  - [ ] Меняны все `yourdomain.com` на настоящий домен
  - [ ] Меняны IP адреса если нужно
  - [ ] Проверены пути к логам

### Подключение в основной конфиг
- [ ] Открыт `C:\nginx\conf\nginx.conf`
- [ ] В блоке `http { }` добавлена строка:
  ```nginx
  include C:/nginx/conf/sites-available/*.conf;
  ```
- [ ] Сохранён файл

### Проверка синтаксиса
- [ ] Выполнена команда: `C:\nginx\nginx.exe -t`
- [ ] Результат: "configuration file ... test is successful"

### Перезагрузка Nginx
- [ ] Выполнена команда: `Restart-Service nginx`
- [ ] Или если вручную: `C:\nginx\nginx.exe -s reload`

### Логи Nginx
- [ ] Проверены логи: `Get-Content C:\nginx\logs\error.log -Tail 20`
- [ ] Нет критических ошибок (warnings обычно в порядке)

---

## 🔓 Этап 5: Открытие доступа из интернета (15 минут)

### Брандмауэр Windows
- [ ] Открыт порт 80 (HTTP)
  - [ ] Команда: `New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -Protocol tcp -LocalPort 80 -Action Allow`
- [ ] Открыт порт 443 (HTTPS, если используешь SSL)
  - [ ] Команда: `New-NetFirewallRule -DisplayName "Allow HTTPS" -Direction Inbound -Protocol tcp -LocalPort 443 -Action Allow`
- [ ] Проверено: `Get-NetFirewallRule -DisplayName "Allow HTTP"`

### Маршрутизатор (если за NAT)
- [ ] Открыт веб-интерфейс маршрутизатора (192.168.1.1 обычно)
- [ ] Найдена секция "Port Forwarding" или "Проброс портов"
- [ ] Добавлены правила:
  - [ ] Внешний порт 80 → Внутренний IP:80
  - [ ] Внешний порт 443 → Внутренний IP:443
- [ ] Сохранены изменения

### DNS (если есть доменное имя)
- [ ] Открыт веб-интерфейс регистратора домена
- [ ] Добавлена A-запись:
  - [ ] yourdomain.com → ваш публичный IP адрес
- [ ] Дождались распространения DNS (обычно 5 минут - 24 часа)
- [ ] Проверено: `nslookup yourdomain.com` на локальном компьютере

### SSL сертификат (рекомендуется)
- [ ] Установлен Certbot
- [ ] Получен бесплатный сертификат Let's Encrypt
  - [ ] Команда: `certbot certonly --webroot -w C:\nginx\html -d yourdomain.com`
- [ ] Обновлены пути в `nginx/toraygyrov.conf`:
  - [ ] ssl_certificate /path/to/fullchain.pem
  - [ ] ssl_certificate_key /path/to/privkey.pem
- [ ] Раскомментированы строки с SSL в конфиге Nginx
- [ ] Перезагружен Nginx: `Restart-Service nginx`

---

## ✔️ Этап 6: Тестирование (10 минут)

### Локальное тестирование
- [ ] На сервере открыт браузер
- [ ] Проверены адреса:
  - [ ] http://localhost (должен работать)
  - [ ] http://localhost:3000 (должен работать)
  - [ ] http://127.0.0.1 (должен работать)

### Тестирование из интернета
- [ ] На локальном компьютере открыт браузер
- [ ] Проверены адреса:
  - [ ] http://yourdomain.com (если нет SSL, то будет переадресация на HTTPS и ошибка)
  - [ ] https://yourdomain.com (если есть SSL)
  - [ ] http://публичный-IP-сервера (должен работать)
- [ ] Страница загружается полностью (включая CSS, JS, изображения)
- [ ] Логотип виден
- [ ] Переключатель языка работает (RU/KZ)

### Функциональное тестирование
- [ ] Переход на разные разделы работает
- [ ] Поиск работает
- [ ] Фото в архиве загружаются
- [ ] Видео проигрываются (если добавлены)
- [ ] Вход в админку работает:
  - [ ] URL: `/admin/login`
  - [ ] Email: admin@toraygyrov.kz
  - [ ] Password: твой установленный пароль
- [ ] Админ-панель полностью функциональна

### Проверка логов
- [ ] Логи приложения:
  ```powershell
  Get-Content "C:\Apps\toraygyrov-encyclopedia\logs\stdout.log" -Tail 50
  ```
  - [ ] Нет ошибок, только информационные сообщения
  
- [ ] Логи Nginx:
  ```powershell
  Get-Content "C:\nginx\logs\error.log" -Tail 20
  ```
  - [ ] Нет критических ошибок

---

## 📊 Этап 7: Мониторинг и поддержка (текущее)

### Проверка статуса сервисов (ежедневно)
- [ ] Сервис приложения: `nssm status ToraygyrovEncyclopedia`
- [ ] Сервис Nginx: `Get-Service nginx | Format-List Status`

### Проверка логов (еженедельно)
- [ ] Проверены логи приложения на ошибки
- [ ] Проверены логи Nginx на проблемы

### Мониторинг ресурсов (еженедельно)
- [ ] Проверен диск: `Get-Volume | Format-Table`
- [ ] Проверена оперативная память: `Get-Process node | Format-Table Memory`
- [ ] Проверена БД на размер: `Get-Item C:\Apps\toraygyrov-encyclopedia\prisma\dev.db`

### Резервные копии (еженедельно)
- [ ] Создана резервная копия БД:
  ```powershell
  Copy-Item "C:\Apps\toraygyrov-encyclopedia\prisma\dev.db" "D:\backups\dev.db.$(Get-Date -Format 'yyyyMMdd-HHmm').bak"
  ```
- [ ] Создана резервная копия .env файла (в безопасное место)
- [ ] Создана резервная копия загруженных файлов (фото/видео):
  ```powershell
  Copy-Item "C:\Apps\toraygyrov-encyclopedia\public\uploads" "D:\backups\uploads-backup-$(Get-Date -Format 'yyyyMMdd')" -Recurse
  ```

---

## 🆘 Решение проблем

### Если сервис не запускается
- [ ] Проверены логи: `Get-Content "C:\Apps\toraygyrov-encyclopedia\logs\stderr.log"`
- [ ] Проверена .env файл (все значения правильные?)
- [ ] Проверена БД инициализирована: `npx prisma migrate deploy`
- [ ] Попробован ручной запуск: `npm start` в папке приложения

### Если Nginx не подключается к приложению
- [ ] Проверено что сервис работает: `nssm status ToraygyrovEncyclopedia`
- [ ] Проверено что приложение слушает на 3000: `netstat -ano | findstr :3000`
- [ ] Проверена конфигурация Nginx: `C:\nginx\nginx.exe -t`
- [ ] Проверены логи Nginx: `Get-Content C:\nginx\logs\error.log -Tail 50`

### Если доступ из интернета не работает
- [ ] Проверены правила брандмауэра: `Get-NetFirewallRule -DisplayName "Allow *"`
- [ ] Проверена конфигурация маршрутизатора (Port Forwarding)
- [ ] Проверена DNS резолюция: `nslookup yourdomain.com`
- [ ] Проверены логи Nginx на блокировку

---

## 📞 Полезные команды

```powershell
# Статус сервисов
nssm status ToraygyrovEncyclopedia
Get-Service nginx

# Перезагрузка сервисов
nssm restart ToraygyrovEncyclopedia
Restart-Service nginx

# Просмотр логов
Get-Content "C:\Apps\toraygyrov-encyclopedia\logs\stdout.log" -Tail 100 -Wait
Get-Content "C:\nginx\logs\error.log" -Tail 50

# Проверка портов
netstat -ano | findstr :3000
netstat -ano | findstr :80

# Проверка процессов
Get-Process node | Format-Table
Get-Process nginx | Format-Table

# Проверка ресурсов
Get-Process node | Format-Table CPU, Memory
Get-Volume | Format-Table

# Перезагрузка Nginx конфига
C:\nginx\nginx.exe -t  # Проверка синтаксиса
C:\nginx\nginx.exe -s reload  # Перезагрузка

# Остановка/старт сервиса
nssm stop ToraygyrovEncyclopedia
nssm start ToraygyrovEncyclopedia
```

---

## 📖 Документы

- **Подробная инструкция:** `DEPLOYMENT_WINDOWS_SERVER.md`
- **Скрипт развёртывания:** `scripts/deploy-windows-server.ps1`
- **Конфигурация Nginx:** `nginx/toraygyrov.conf`
- **Пример .env:** `.env.windows-server.example`
- **Структура приложения:** `STRUCTURE.md`
- **Гайд администратора:** `ADMIN_GUIDE.md`

---

## ✅ Финальная проверка

- [ ] Все пункты выше выполнены
- [ ] Сайт доступен из интернета
- [ ] Админ-панель работает
- [ ] Логи не содержат ошибок
- [ ] Резервные копии созданы
- [ ] Документация обновлена с информацией о сервере

**Дата развёртывания:** _______________  
**Ответственный:** _______________  
**Статус:** ✅ Завершено / ⏳ В процессе / ❌ Требует доработки

---

**Спасибо за использование энциклопедии Торайгырова!** 🎓
