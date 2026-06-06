# 🤖 Гайд для Claude Agent: Безопасное развёртывание

**ВАЖНО:** Этот гайд предназначен для автоматизированного развёртывания через Claude Agent с максимальной безопасностью.

**Принцип:** Проверь ВСЁ дважды, прежде чем нажать на кнопку ❌→✅→✅→ВЫПОЛНИТЬ

---

## ⚠️ КРИТИЧЕСКОЕ ПРАВИЛО

**НИКОГДА не выполняй действия без явного согласия пользователя на каждый крупный шаг.**

Перед каждым из этих действий ВСЕГДА спроси пользователя:
- Создание/удаление файлов
- Изменение конфигурации сервисов
- Модификация брандмауэра
- Перезагрузка сервисов
- Любые деструктивные операции

---

## 🔍 ЭТАП 0: PRE-FLIGHT CHECKS (ОБЯЗАТЕЛЬНО!)

Перед любыми действиями выполни эти проверки и покажи результаты пользователю.

### 0.1 Проверка окружения

```powershell
# Проверь что это Windows Server 2019+
[System.Environment]::OSVersion.VersionString

# Проверь администраторские права
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] 'Administrator')
Write-Host "Администратор: $isAdmin"

# Проверь что PowerShell 5.0+
$PSVersionTable.PSVersion

# Проверь диск
Get-Volume | Format-Table DriveLetter, Size, SizeRemaining
```

**Что проверить:**
- [ ] Windows Server 2019 или новее
- [ ] ЕСТЬ администраторские права
- [ ] PowerShell 5.0 или новее
- [ ] Свободно минимум 20 ГБ на диске C:\

**СТОП если:** Что-то из выше неправильно → Попроси пользователя исправить

---

### 0.2 Проверка существующей инсталляции

```powershell
# Проверь существует ли уже развёртывание
Test-Path "C:\Apps\toraygyrov-encyclopedia"
Test-Path "C:\Apps\toraygyrov-encyclopedia\.env"
Test-Path "C:\Apps\toraygyrov-encyclopedia\prisma\dev.db"

# Проверь существующие сервисы
Get-Service | Where-Object {$_.Name -like "*toraygyrov*" -or $_.Name -like "*Encyclopedia*"}

# Проверь занятые порты
netstat -ano | findstr :3000
netstat -ano | findstr :80
netstat -ano | findstr :443
```

**Что проверить:**
- [ ] Нет ли уже развёртывания в C:\Apps\toraygyrov-encyclopedia ?
- [ ] Нет ли уже сервиса ToraygyrovEncyclopedia ?
- [ ] Свободны ли порты 3000, 80, 443 ?

**СТОП если:** 
- Найдено существующее развёртывание → Спроси пользователя обновляем или полная переустановка?
- Порты заняты → Попроси освободить или использовать другие порты

---

### 0.3 Проверка зависимостей

```powershell
# Проверь Node.js
$node = node --version 2>$null
$npm = npm --version 2>$null
Write-Host "Node.js: $node"
Write-Host "npm: $npm"

# Проверь NSSM
$nssm = nssm --version 2>$null
Write-Host "NSSM: $nssm"

# Проверь Nginx (если требуется)
$nginx = Get-Service nginx -ErrorAction SilentlyContinue
Write-Host "Nginx статус: $($nginx.Status)"
```

**Что проверить:**
- [ ] Node.js 18+ установлен
- [ ] npm 8+ установлен
- [ ] NSSM установлен и доступен
- [ ] Nginx установлен (если используется)

**СТОП если:** Какая-то зависимость не установлена → Попроси установить

---

### 0.4 Проверка файловой структуры проекта

```powershell
# Обязательные файлы
@(
    "package.json",
    "next.config.mjs",
    "tsconfig.json",
    "tailwind.config.ts",
    "prisma/schema.prisma",
    ".env.windows-server.example",
    "DEPLOYMENT_WINDOWS_SERVER.md"
) | ForEach-Object {
    $exists = Test-Path $_
    Write-Host "$_: $(if($exists) {'✓'} else {'✗'})"
}

# Обязательные папки
@(
    "app",
    "components",
    "lib",
    "prisma",
    "public",
    "scripts"
) | ForEach-Object {
    $exists = Test-Path $_
    Write-Host "📁 $_/: $(if($exists) {'✓'} else {'✗'})"
}
```

**Что проверить:**
- [ ] Все основные файлы присутствуют
- [ ] Все основные папки присутствуют
- [ ] Нет ошибок синтаксиса в JSON файлах

**СТОП если:** Отсутствуют критические файлы → Проект поврежден, отказать

---

### 0.5 Проверка .env файла

```powershell
# Проверь существование .env
if (Test-Path ".env") {
    Write-Host ".env СУЩЕСТВУЕТ"
    # Проверь содержимое (ОСТОРОЖНО с чувствительными данными!)
    Write-Host "Ключи в .env:"
    (Get-Content .env) | grep "=" | ForEach-Object { $_.Split("=")[0] }
} else {
    Write-Host ".env НЕ найден - нужно создать"
}

# Проверь .env.example
if (Test-Path ".env.windows-server.example") {
    Write-Host "✓ .env.windows-server.example найден"
}
```

**Что проверить:**
- [ ] .env существует ИЛИ .env.windows-server.example существует
- [ ] В .env есть NEXTAUTH_SECRET (минимум 32 символа)
- [ ] В .env есть ADMIN_PASSWORD_HASH_B64
- [ ] DATABASE_URL не пустой

**СТОП если:** 
- .env не существует И .env.windows-server.example не существует → Прекрати
- Критические переменные пустые → Попроси заполнить

---

### 0.6 Проверка исходящего подключения

```powershell
# Тест интернета
try {
    $test = Invoke-WebRequest -Uri "https://registry.npmjs.org/next" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✓ npm registry доступен"
} catch {
    Write-Host "✗ npm registry НЕ доступен"
}

# Тест резолюции DNS
try {
    [System.Net.Dns]::GetHostAddresses("nodejs.org") | Out-Null
    Write-Host "✓ DNS работает"
} catch {
    Write-Host "✗ DNS НЕ работает"
}
```

**Что проверить:**
- [ ] Есть подключение в интернет
- [ ] npm registry доступен
- [ ] DNS резолюция работает

**СТОП если:** Нет интернета → Невозможно установить зависимости

---

## 📋 ЭТАП 1: СОЗДАНИЕ БЭКАПОВ (ПЕРЕД ВСЕМ!)

**НИКОГДА не развёртывай без бэкапов!**

```powershell
$backupDate = Get-Date -Format "yyyyMMdd-HHmm"
$backupDir = "C:\Backups\toraygyrov-$backupDate"

Write-Host "Создаю бэкап в: $backupDir"

# Если есть существующее развёртывание - бэкапим его
if (Test-Path "C:\Apps\toraygyrov-encyclopedia") {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    # Бэкап БД
    if (Test-Path "C:\Apps\toraygyrov-encyclopedia\prisma\dev.db") {
        Copy-Item "C:\Apps\toraygyrov-encyclopedia\prisma\dev.db" "$backupDir\dev.db.backup"
        Write-Host "✓ БД бэкапирована"
    }
    
    # Бэкап .env
    if (Test-Path "C:\Apps\toraygyrov-encyclopedia\.env") {
        Copy-Item "C:\Apps\toraygyrov-encyclopedia\.env" "$backupDir\.env.backup"
        Write-Host "✓ .env бэкапирован"
    }
    
    # Бэкап uploads
    if (Test-Path "C:\Apps\toraygyrov-encyclopedia\public\uploads") {
        Copy-Item "C:\Apps\toraygyrov-encyclopedia\public\uploads" "$backupDir\uploads-backup" -Recurse
        Write-Host "✓ uploads бэкапирован"
    }
}

Write-Host ""
Write-Host "Бэкапы готовы в: $backupDir"
```

**ПРОВЕРЬ:**
- [ ] Бэкап папка создана
- [ ] БД скопирована
- [ ] .env скопирован
- [ ] uploads скопированы (если существуют)

**ВАЖНО:** Сохрани путь к бэкапу - пригодится для отката!

---

## 🔐 ЭТАП 2: ВАЛИДАЦИЯ КОНФИГУРАЦИИ

**Все проверки ПЕРЕД применением.**

### 2.1 Проверка Nginx конфигурации

```powershell
# Если используется Nginx
if (Test-Path "C:\nginx\nginx.exe") {
    Write-Host "Проверяю Nginx конфигурацию..."
    
    $result = & "C:\nginx\nginx.exe" -t 2>&1
    Write-Host $result
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Nginx конфиг корректен"
    } else {
        Write-Host "✗ ОШИБКА в Nginx конфиге!"
        Write-Host "Исправь конфиг перед продолжением"
        exit 1
    }
}
```

### 2.2 Проверка синтаксиса JSON/TOML

```powershell
# Проверь package.json
try {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "✓ package.json валиден"
    Write-Host "  Версия: $($pkg.version)"
    Write-Host "  Name: $($pkg.name)"
} catch {
    Write-Host "✗ ОШИБКА в package.json: $_"
    exit 1
}

# Проверь next.config
try {
    $nextConfig = Get-Content "next.config.mjs" -Raw
    # Простая проверка синтаксиса
    if ($nextConfig -match "export default") {
        Write-Host "✓ next.config.mjs выглядит корректно"
    }
} catch {
    Write-Host "⚠️  Не удалось проверить next.config.mjs"
}
```

### 2.3 Проверка Prisma схемы

```powershell
try {
    # Сгенерируй Prisma клиент (dry-run)
    Write-Host "Проверяю Prisma схему..."
    
    & npx prisma validate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Prisma схема валидна"
    } else {
        Write-Host "✗ ОШИБКА в Prisma схеме"
        exit 1
    }
} catch {
    Write-Host "⚠️  Ошибка при проверке: $_"
}
```

### 2.4 Проверка переменных окружения

```powershell
Write-Host "Проверяю обязательные переменные окружения..."

if (-not (Test-Path ".env")) {
    Write-Host "✗ .env не найден"
    exit 1
}

$envVars = @{
    "DATABASE_URL" = $false
    "NEXTAUTH_SECRET" = $false
    "NEXTAUTH_URL" = $false
    "ADMIN_PASSWORD_HASH_B64" = $false
    "NODE_ENV" = $false
}

(Get-Content .env) | ForEach-Object {
    if ($_ -match "^([^=]+)=") {
        $key = $matches[1].Trim()
        if ($envVars.ContainsKey($key)) {
            $envVars[$key] = $true
        }
    }
}

$envVars.GetEnumerator() | ForEach-Object {
    $status = if ($_.Value) { "✓" } else { "✗" }
    Write-Host "$status $($_.Key)"
}

# Проверь что NEXTAUTH_SECRET длинный
$secret = (Get-Content .env | Select-String "^NEXTAUTH_SECRET=").ToString().Split("=")[1]
if ($secret.Length -ge 32) {
    Write-Host "✓ NEXTAUTH_SECRET достаточно длинный ($($secret.Length) символов)"
} else {
    Write-Host "✗ NEXTAUTH_SECRET слишком короткий: $($secret.Length) символов (нужно минимум 32)"
    exit 1
}
```

---

## 🧪 ЭТАП 3: СУХОЙ ЗАПУСК (DRY-RUN)

**Попытаемся собрать и запустить БЕЗ обновления сервиса**

### 3.1 Проверка npm зависимостей

```powershell
Write-Host "Проверяю npm зависимости..."

# Не устанавливаем, только проверяем
$packageCheck = & npm list --depth=0 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Обнаружены проблемы с зависимостями:"
    Write-Host $packageCheck
    Write-Host ""
    Write-Host "Это может быть нормально. Будут переустановлены при 'npm install'"
}
```

### 3.2 Проверка сборки (на тестовой папке)

```powershell
Write-Host "Проверяю сборку (может занять 2-5 минут)..."

# Очистим node_modules временно для проверки
# НО СНАЧАЛА спросим пользователя!

Write-Host ""
Write-Host "⚠️  ОСТАНОВКА ДЛЯ СОГЛАСИЯ:"
Write-Host "Я хочу попробовать полностью пересобрать проект."
Write-Host "Это займёт 5-10 минут и не повредит ничего."
Write-Host ""
Write-Host "Продолжить? (Y/N)"

# Дождемся согласия пользователя перед тем как продолжить
```

### 3.3 Проверка запуска приложения

```powershell
Write-Host "Запускаю приложение в режиме dry-run..."

# Запусти с timeout 10 секунд
$job = Start-Job -ScriptBlock {
    cd "C:\Apps\toraygyrov-encyclopedia"
    npm start
}

Start-Sleep -Seconds 10

# Проверь что приложение слушает на 3000
$port3000 = netstat -ano | findstr :3000

if ($port3000) {
    Write-Host "✓ Приложение успешно запустилось на порту 3000"
} else {
    Write-Host "✗ Приложение НЕ слушает на порту 3000"
    Write-Host "Это может означать ошибку при запуске"
}

# Останови job
Stop-Job -Job $job
Remove-Job -Job $job
```

---

## ⏸️ КОНТРОЛЬНАЯ ТОЧКА 1: РЕШЕНИЕ ПОЛЬЗОВАТЕЛЯ

**СТОП. Все проверки выполнены. Спроси пользователя:**

```
✓ ВСЕ PRE-FLIGHT CHECKS ПРОЙДЕНЫ
✓ БЭКАПЫ СОЗДАНЫ (путь: C:\Backups\toraygyrov-DATE)
✓ КОНФИГУРАЦИЯ ВАЛИДНА
✓ СУХОЙ ЗАПУСК УСПЕШЕН

═════════════════════════════════════════════════════════

Готов приступить к основному развёртыванию?

Это будет:
1. npm install (установка зависимостей)
2. npx prisma migrate (инициализация БД)
3. npm run build (сборка приложения)
4. Создание Windows Service
5. Запуск сервиса

ПРЕРЫВ-ТОЧКА: Ты МОЖЕШЬ отменить в любой момент!

Введи YES чтобы продолжить или NO чтобы отменить:
```

**ВАЖНО:** Если пользователь ввёл что-то другое - переспроси

---

## 🔧 ЭТАП 4: ОСНОВНОЕ РАЗВЁРТЫВАНИЕ

(Выполняется ТОЛЬКО если пользователь согласился)

### 4.1 Создание папок и структуры

```powershell
Write-Host "Этап 4.1: Подготовка структуры папок..."

# Создай основные папки
@(
    "C:\Apps\toraygyrov-encyclopedia\logs",
    "C:\Apps\toraygyrov-encyclopedia\public\uploads"
) | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
        Write-Host "✓ Создана: $_"
    }
}
```

### 4.2 Установка зависимостей

```powershell
Write-Host "Этап 4.2: Установка зависимостей (может занять 5-10 минут)..."

Push-Location "C:\Apps\toraygyrov-encyclopedia"

try {
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Зависимости установлены"
    } else {
        Write-Host "✗ ОШИБКА при установке зависимостей"
        Write-Host "Откатываю изменения..."
        # Откат: удалить node_modules
        Remove-Item "node_modules" -Recurse -Force
        pop-Location
        exit 1
    }
} catch {
    Write-Host "✗ КРИТИЧЕСКАЯ ОШИБКА: $_"
    Pop-Location
    exit 1
}

Pop-Location
```

### 4.3 Инициализация БД

```powershell
Write-Host "Этап 4.3: Инициализация БД..."

Push-Location "C:\Apps\toraygyrov-encyclopedia"

try {
    Write-Host "  - Генерирую Prisma клиент..."
    npx prisma generate
    
    Write-Host "  - Применяю миграции..."
    npx prisma migrate deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ БД инициализирована успешно"
    } else {
        Write-Host "✗ ОШИБКА при инициализации БД"
        Write-Host "Откатываю: восстанавливаю БД из бэкапа..."
        
        # Откат: восстановить из бэкапа
        if (Test-Path "$backupDir\dev.db.backup") {
            Copy-Item "$backupDir\dev.db.backup" "prisma\dev.db" -Force
            Write-Host "✓ БД восстановлена из бэкапа"
        }
        Pop-Location
        exit 1
    }
} catch {
    Write-Host "✗ КРИТИЧЕСКАЯ ОШИБКА: $_"
    Pop-Location
    exit 1
}

Pop-Location
```

### 4.4 Сборка приложения

```powershell
Write-Host "Этап 4.4: Сборка приложения (может занять 3-5 минут)..."

Push-Location "C:\Apps\toraygyrov-encyclopedia"

try {
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Приложение собрано успешно"
        
        # Проверь что .next создан
        if (Test-Path ".next") {
            Write-Host "✓ Папка .next создана"
        }
    } else {
        Write-Host "✗ ОШИБКА при сборке приложения"
        Write-Host "Откатываю: удаляю .next..."
        Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
        Pop-Location
        exit 1
    }
} catch {
    Write-Host "✗ КРИТИЧЕСКАЯ ОШИБКА: $_"
    Pop-Location
    exit 1
}

Pop-Location
```

---

## ⏸️ КОНТРОЛЬНАЯ ТОЧКА 2: ПЕРЕД СОЗДАНИЕМ СЕРВИСА

```
✓ Зависимости установлены
✓ БД инициализирована  
✓ Приложение собрано

═════════════════════════════════════════════════════════

Сейчас создам Windows Service 'ToraygyrovEncyclopedia'

Это означает:
- Приложение будет запускаться при старте сервера
- Автоматический перезапуск при падении
- Постоянный доступ 24/7

Продолжить? (YES/NO)
```

---

## 🛠️ ЭТАП 5: СОЗДАНИЕ WINDOWS SERVICE

(ТОЛЬКО если пользователь согласился)

### 5.1 Проверка перед созданием сервиса

```powershell
Write-Host "Этап 5.1: Проверка перед созданием сервиса..."

# Проверь что приложение может запуститься
Write-Host "  - Пытаюсь запустить приложение вручную..."

$testJob = Start-Job -ScriptBlock {
    cd "C:\Apps\toraygyrov-encyclopedia"
    npm start 2>&1 | Select-Object -First 20
}

Start-Sleep -Seconds 5

$output = Receive-Job -Job $testJob

if ($output -match "started|listening|ready") {
    Write-Host "✓ Приложение запустилось успешно"
    Stop-Job -Job $testJob
    Remove-Job -Job $testJob
} else {
    Write-Host "⚠️  Приложение может не запуститься"
    Write-Host "Вывод: $output"
    Write-Host "Проверь логи и .env перед продолжением"
    exit 1
}
```

### 5.2 Создание сервиса

```powershell
Write-Host "Этап 5.2: Создание Windows Service..."

$appName = "ToraygyrovEncyclopedia"
$appPath = "C:\Apps\toraygyrov-encyclopedia"
$nodePath = (Get-Command node).Source

Write-Host "  - Создаю сервис: $appName"
Write-Host "  - Node.js путь: $nodePath"

nssm install $appName $nodePath "C:\Apps\toraygyrov-encyclopedia\node_modules\.bin\next start"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Сервис создан"
} else {
    Write-Host "✗ ОШИБКА при создании сервиса"
    exit 1
}

# Конфигурируй сервис
Write-Host "  - Конфигурирую параметры..."

nssm set $appName AppDirectory $appPath
nssm set $appName AppEnvironmentExtra "NODE_ENV=production"
nssm set $appName AppExit Default Restart
nssm set $appName AppRestartDelay 5000
nssm set $appName AppStdout "$appPath\logs\stdout.log"
nssm set $appName AppStderr "$appPath\logs\stderr.log"
nssm set $appName AppRotateFiles 1
nssm set $appName AppRotateOnline 1
nssm set $appName AppRotateSeconds 86400
nssm set $appName AppRotateBytes 104857600

Write-Host "✓ Параметры сервиса установлены"
```

### 5.3 Проверка конфигурации сервиса

```powershell
Write-Host "Этап 5.3: Проверка конфигурации сервиса..."

$config = nssm dump ToraygyrovEncyclopedia

Write-Host "Параметры сервиса:"
Write-Host $config

# Проверь критические параметры
if ($config -match "NODE_ENV") {
    Write-Host "✓ NODE_ENV установлен"
}

if ($config -match "AppRestartDelay") {
    Write-Host "✓ Автоперезапуск настроен"
}
```

---

## ⏸️ КОНТРОЛЬНАЯ ТОЧКА 3: ПЕРЕД СТАРТОМ СЕРВИСА

```
✓ Windows Service создан
✓ Параметры установлены
✓ Конфигурация проверена

═════════════════════════════════════════════════════════

Сейчас запущу сервис. Это запустит приложение!

Если возникнут проблемы:
1. Проверю логи: logs\stderr.log
2. Остановлю сервис
3. Восстановлю из бэкапа если нужно

Запустить сервис? (YES/NO)
```

---

## ▶️ ЭТАП 6: ЗАПУСК СЕРВИСА

(ТОЛЬКО если пользователь согласился)

### 6.1 Запуск

```powershell
Write-Host "Этап 6.1: Запуск сервиса..."

nssm start ToraygyrovEncyclopedia

Start-Sleep -Seconds 5

# Проверь статус
$status = nssm status ToraygyrovEncyclopedia

Write-Host "Статус сервиса: $status"

if ($status -eq "SERVICE_RUNNING") {
    Write-Host "✓ Сервис работает!"
} else {
    Write-Host "⚠️  Сервис не запустился"
    Write-Host "Статус: $status"
}
```

### 6.2 Проверка логов

```powershell
Write-Host "Этап 6.2: Проверка логов запуска..."

$logPath = "C:\Apps\toraygyrov-encyclopedia\logs\stdout.log"
$errLogPath = "C:\Apps\toraygyrov-encyclopedia\logs\stderr.log"

Write-Host ""
Write-Host "═══════ STDOUT ═══════"
if (Test-Path $logPath) {
    Get-Content $logPath -Tail 30 | Write-Host
} else {
    Write-Host "(логи ещё не созданы)"
}

Write-Host ""
Write-Host "═══════ STDERR ═══════"
if (Test-Path $errLogPath) {
    Get-Content $errLogPath -Tail 30 | Write-Host
} else {
    Write-Host "(ошибок нет)"
}
```

### 6.3 Проверка порта

```powershell
Write-Host "Этап 6.3: Проверка портов..."

Start-Sleep -Seconds 3

$port3000 = netstat -ano | findstr :3000

if ($port3000) {
    Write-Host "✓ Приложение слушает на порту 3000"
    Write-Host $port3000
} else {
    Write-Host "✗ Приложение НЕ слушает на порту 3000"
    Write-Host "Проверь логи выше"
    
    # Предложи откат
    Write-Host ""
    Write-Host "Хочешь откатить развёртывание? (YES/NO)"
}
```

---

## 🌐 ЭТАП 7: ПРОВЕРКА ДОСТУПА

### 7.1 Локальная проверка

```powershell
Write-Host "Этап 7.1: Локальная проверка..."

# Тест localhost
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Приложение доступно на http://localhost:3000"
    }
} catch {
    Write-Host "✗ Приложение НЕ доступно на localhost:3000"
    Write-Host "Ошибка: $_"
}

# Тест через 127.0.0.1
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:3000" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Приложение доступно на http://127.0.0.1:3000"
    }
} catch {
    Write-Host "✗ Ошибка при подключении на 127.0.0.1"
}
```

### 7.2 Проверка Nginx (если используется)

```powershell
Write-Host "Этап 7.2: Проверка Nginx..."

if (Test-Path "C:\nginx\nginx.exe") {
    $nginxStatus = Get-Service nginx -ErrorAction SilentlyContinue
    
    if ($nginxStatus.Status -eq "Running") {
        Write-Host "✓ Nginx работает"
        
        # Тест через Nginx
        try {
            $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ Приложение доступно через Nginx на http://localhost"
            }
        } catch {
            Write-Host "⚠️  Не удалось подключиться через Nginx"
        }
    } else {
        Write-Host "⚠️  Nginx не работает"
    }
}
```

---

## ✔️ ЭТАП 8: ФИНАЛЬНАЯ ПРОВЕРКА

### 8.1 Статус всех сервисов

```powershell
Write-Host "═══════════════════════════════════════════"
Write-Host "ФИНАЛЬНЫЙ СТАТУС"
Write-Host "═══════════════════════════════════════════"

Write-Host ""
Write-Host "Node.js приложение:"
$appStatus = nssm status ToraygyrovEncyclopedia
Write-Host "  Статус: $appStatus"

Write-Host ""
Write-Host "Nginx:"
if (Test-Path "C:\nginx\nginx.exe") {
    $nginx = Get-Service nginx -ErrorAction SilentlyContinue
    Write-Host "  Статус: $($nginx.Status)"
}

Write-Host ""
Write-Host "Порты:"
netstat -ano | findstr ":3000" | ForEach-Object { Write-Host "  3000: $_" }
netstat -ano | findstr ":80" | ForEach-Object { Write-Host "  80: $_" }

Write-Host ""
Write-Host "БД:"
if (Test-Path "C:\Apps\toraygyrov-encyclopedia\prisma\dev.db") {
    $dbSize = (Get-Item "C:\Apps\toraygyrov-encyclopedia\prisma\dev.db").Length / 1MB
    Write-Host "  ✓ БД существует ($([math]::Round($dbSize, 2)) MB)"
}

Write-Host ""
Write-Host "Логи:"
$logSize = if (Test-Path "C:\Apps\toraygyrov-encyclopedia\logs\stdout.log") {
    (Get-Item "C:\Apps\toraygyrov-encyclopedia\logs\stdout.log").Length / 1KB
    "$([math]::Round($logSize, 0)) KB"
} else {
    "нет"
}
Write-Host "  stdout.log: $logSize"
```

### 8.2 Рекомендации

```powershell
Write-Host ""
Write-Host "═══════════════════════════════════════════"
Write-Host "✓ РАЗВЁРТЫВАНИЕ ЗАВЕРШЕНО"
Write-Host "═══════════════════════════════════════════"

Write-Host ""
Write-Host "📋 Дальше:"
Write-Host "  1. Откройте браузер на http://localhost:3000"
Write-Host "  2. Проверьте работу сайта"
Write-Host "  3. Войдите в админку: /admin/login"
Write-Host "  4. Добавьте контент"
Write-Host ""
Write-Host "📞 Если что-то не работает:"
Write-Host "  1. Проверьте логи: Get-Content 'C:\Apps\toraygyrov-encyclopedia\logs\stdout.log' -Tail 50"
Write-Host "  2. Перезагрузите сервис: nssm restart ToraygyrovEncyclopedia"
Write-Host "  3. Смотрите DEPLOYMENT_WINDOWS_SERVER.md в разделе Решение проблем"
Write-Host ""
Write-Host "🔄 Бэкапы сохранены в: $backupDir"
Write-Host "   Используй для отката если нужно"
Write-Host ""
```

---

## 🔙 ОТКАТ (ЕСЛИ ЧТО-ТО ПОШЛО НЕ ТАК)

**ТОЛЬКО если пользователь запросил откат:**

```powershell
Write-Host "⚠️  ОТКАТ РАЗВЁРТЫВАНИЯ"
Write-Host ""
Write-Host "Это восстановит состояние из бэкапа"
Write-Host "Путь к бэкапу: $backupDir"
Write-Host ""
Write-Host "Подтверди откат? (YES/NO)"

# Дождись YES

Write-Host ""
Write-Host "Откатываю..."

# 1. Останови сервис
Write-Host "  1. Останавливаю сервис..."
nssm stop ToraygyrovEncyclopedia

# 2. Восстанови БД
if (Test-Path "$backupDir\dev.db.backup") {
    Write-Host "  2. Восстанавливаю БД..."
    Copy-Item "$backupDir\dev.db.backup" "C:\Apps\toraygyrov-encyclopedia\prisma\dev.db" -Force
}

# 3. Восстанови .env
if (Test-Path "$backupDir\.env.backup") {
    Write-Host "  3. Восстанавливаю .env..."
    Copy-Item "$backupDir\.env.backup" "C:\Apps\toraygyrov-encyclopedia\.env" -Force
}

# 4. Запусти заново
Write-Host "  4. Запускаю сервис..."
nssm start ToraygyrovEncyclopedia

Write-Host ""
Write-Host "✓ ОТКАТ ЗАВЕРШЕН"
Write-Host "Сервис перезапущен со старыми данными"
```

---

## 📊 МОНИТОРИНГ ПОСЛЕ РАЗВЁРТЫВАНИЯ

```powershell
# Эту команду запусти в отдельном PowerShell окне для постоянного мониторинга

while ($true) {
    Clear-Host
    
    $time = Get-Date -Format "HH:mm:ss"
    Write-Host "[$time] === МОНИТОРИНГ ПРИЛОЖЕНИЯ ==="
    
    # Статус сервиса
    $status = nssm status ToraygyrovEncyclopedia
    Write-Host "Статус: $status"
    
    # Ресурсы
    $proc = Get-Process node -ErrorAction SilentlyContinue
    if ($proc) {
        Write-Host "CPU: $($proc.CPU)%"
        Write-Host "RAM: $($proc.Memory / 1MB) MB"
    }
    
    # Логи (последние ошибки)
    $errors = Get-Content "C:\Apps\toraygyrov-encyclopedia\logs\stderr.log" -Tail 3 -ErrorAction SilentlyContinue
    if ($errors) {
        Write-Host "Ошибки:"
        Write-Host $errors
    }
    
    Start-Sleep -Seconds 10
}
```

---

## 📝 ЛОГИРОВАНИЕ РАЗВЁРТЫВАНИЯ

**Все действия логируются в файл:**

```powershell
# Запусти весь скрипт с логированием
$logFile = "C:\deployment-log-$(Get-Date -Format 'yyyyMMdd-HHmm').txt"

Start-Transcript -Path $logFile

# ... весь код развёртывания ...

Stop-Transcript

Write-Host "Лог развёртывания сохранён в: $logFile"
```

---

## ✅ ЧЕК-ЛИСТ ДЛЯ CLAUDE AGENT

Перед каждым развёртыванием убедись:

- [ ] Выполнены все 0.X проверки (Pre-flight)
- [ ] Созданы бэкапы
- [ ] Валидирована конфигурация
- [ ] Выполнен сухой запуск (dry-run)
- [ ] Получено согласие пользователя на контрольной точке 1
- [ ] Установлены зависимости БЕЗ ошибок
- [ ] БД инициализирована БЕЗ ошибок
- [ ] Приложение собрано БЕЗ ошибок
- [ ] Получено согласие пользователя на контрольной точке 2
- [ ] Windows Service создан БЕЗ ошибок
- [ ] Получено согласие пользователя на контрольной точке 3
- [ ] Сервис запущен и работает
- [ ] Порт 3000 слушает
- [ ] Логи не содержат критических ошибок
- [ ] Приложение доступно локально
- [ ] Выполнена финальная проверка
- [ ] Пользователю показана информация о доступе

---

## 🚨 КРИТИЧЕСКИЕ ПРАВИЛА ДЛЯ CLAUDE AGENT

1. **НИКОГДА не игнорируй ошибки** — стоп и спроси пользователя
2. **ВСЕГДА создавай бэкапы перед изменениями**
3. **ВСЕГДА спрашивай согласие перед крупными операциями**
4. **ВСЕГДА проверяй логи после критических действий**
5. **ВСЕГДА предоставляй способ отката**
6. **НИКОГДА не удаляй исходные данные без подтверждения**
7. **ВСЕГДА показывай результаты проверок пользователю**

---

**Версия:** 1.0  
**Дата:** 2026-06-06  
**Статус:** Безопасен для автоматизации
