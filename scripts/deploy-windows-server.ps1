# 🚀 Скрипт развёртывания на Windows Server 2019
# Запусти от администратора!
# Usage: powershell -ExecutionPolicy Bypass -File deploy-windows-server.ps1

param(
    [string]$AppPath = "C:\Apps\toraygyrov-encyclopedia",
    [string]$AppName = "ToraygyrovEncyclopedia",
    [string]$Port = 3000,
    [string]$NodeEnv = "production"
)

# Цвета для вывода
function Write-Success { Write-Host $args[0] -ForegroundColor Green }
function Write-Error_ { Write-Host $args[0] -ForegroundColor Red }
function Write-Info { Write-Host $args[0] -ForegroundColor Cyan }

# Проверка администраторских прав
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] 'Administrator')
if (-not $isAdmin) {
    Write-Error_ "❌ Требуются права администратора! Запусти PowerShell от администратора."
    exit 1
}

Write-Info "🚀 Начинаю развёртывание энциклопедии Торайгырова"
Write-Info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ═══════════════════════════════════════════════════════
# ЭТАП 1: Проверка Node.js
# ═══════════════════════════════════════════════════════
Write-Info "`n📦 Этап 1: Проверка Node.js..."

$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Error_ "❌ Node.js не установлен!"
    Write-Info "   Скачай с https://nodejs.org/ и установи LTS версию"
    exit 1
}
Write-Success "✅ Node.js $nodeVersion найден"

# ═══════════════════════════════════════════════════════
# ЭТАП 2: Проверка NSSM
# ═══════════════════════════════════════════════════════
Write-Info "`n🛠️  Этап 2: Проверка NSSM..."

$nssmVersion = nssm --version 2>$null
if (-not $nssmVersion) {
    Write-Error_ "❌ NSSM не установлен!"
    Write-Info "   Скачай с https://nssm.cc/download"
    Write-Info "   Распакуй в C:\nssm\ и добавь в PATH"
    exit 1
}
Write-Success "✅ NSSM $nssmVersion найден"

# ═══════════════════════════════════════════════════════
# ЭТАП 3: Проверка приложения
# ═══════════════════════════════════════════════════════
Write-Info "`n📂 Этап 3: Проверка приложения в $AppPath..."

if (-not (Test-Path $AppPath)) {
    Write-Error_ "❌ Папка приложения не найдена: $AppPath"
    exit 1
}
Write-Success "✅ Папка приложения найдена"

# ═══════════════════════════════════════════════════════
# ЭТАП 4: Проверка зависимостей
# ═══════════════════════════════════════════════════════
Write-Info "`n📦 Этап 4: Проверка npm зависимостей..."

if (-not (Test-Path "$AppPath\node_modules")) {
    Write-Info "   node_modules не найдены, устанавливаю..."
    Push-Location $AppPath
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error_ "❌ Ошибка установки зависимостей"
        Pop-Location
        exit 1
    }
    Pop-Location
    Write-Success "✅ Зависимости установлены"
} else {
    Write-Success "✅ node_modules уже существуют"
}

# ═══════════════════════════════════════════════════════
# ЭТАП 5: Проверка .env файла
# ═══════════════════════════════════════════════════════
Write-Info "`n⚙️  Этап 5: Проверка .env файла..."

if (-not (Test-Path "$AppPath\.env")) {
    Write-Error_ "❌ Файл .env не найден!"
    Write-Info "   Создай $AppPath\.env с необходимыми переменными"
    Write-Info "   Шаблон см. в DEPLOYMENT_WINDOWS_SERVER.md"
    exit 1
}
Write-Success "✅ .env файл найден"

# ═══════════════════════════════════════════════════════
# ЭТАП 6: Сборка приложения
# ═══════════════════════════════════════════════════════
Write-Info "`n🔨 Этап 6: Проверка сборки приложения..."

if (-not (Test-Path "$AppPath\.next")) {
    Write-Info "   .next папка не найдена, выполняю сборку..."
    Push-Location $AppPath
    Write-Info "   Генерирую Prisma клиент..."
    npx prisma generate

    Write-Info "   Выполняю npm run build..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error_ "❌ Ошибка сборки приложения"
        Pop-Location
        exit 1
    }
    Pop-Location
    Write-Success "✅ Приложение собрано"
} else {
    Write-Success "✅ .next папка уже существует"
}

# ═══════════════════════════════════════════════════════
# ЭТАП 7: Инициализация БД
# ═══════════════════════════════════════════════════════
Write-Info "`n🗄️  Этап 7: Проверка миграций БД..."

Push-Location $AppPath
Write-Info "   Выполняю миграции Prisma..."
npx prisma migrate deploy
Pop-Location
Write-Success "✅ БД инициализирована"

# ═══════════════════════════════════════════════════════
# ЭТАП 8: Создание логов папки
# ═══════════════════════════════════════════════════════
Write-Info "`n📝 Этап 8: Создание папки логов..."

$logsPath = "$AppPath\logs"
if (-not (Test-Path $logsPath)) {
    New-Item -ItemType Directory -Path $logsPath -Force | Out-Null
    Write-Success "✅ Папка логов создана: $logsPath"
} else {
    Write-Success "✅ Папка логов уже существует"
}

# ═══════════════════════════════════════════════════════
# ЭТАП 9: Удаление старого сервиса (если существует)
# ═══════════════════════════════════════════════════════
Write-Info "`n🛑 Этап 9: Проверка существующего сервиса..."

$serviceExists = nssm status $AppName 2>$null
if ($serviceExists -ne "SERVICE_NOT_FOUND" -and $serviceExists -ne "") {
    Write-Info "   Сервис '$AppName' уже существует, удаляю..."
    nssm remove $AppName confirm
    Start-Sleep -Seconds 2
    Write-Success "✅ Старый сервис удален"
} else {
    Write-Info "   Сервис не существует, создаю новый"
}

# ═══════════════════════════════════════════════════════
# ЭТАП 10: Создание Windows Service
# ═══════════════════════════════════════════════════════
Write-Info "`n⚙️  Этап 10: Создание Windows Service..."

$nodePath = (Get-Command node).Source
Write-Info "   Путь Node.js: $nodePath"

# Установка сервиса
nssm install $AppName $nodePath "C:\Apps\toraygyrov-encyclopedia\node_modules\.bin\next start"
Write-Success "✅ Сервис установлен"

# Настройка параметров сервиса
Write-Info "   Настраиваю параметры сервиса..."
nssm set $AppName AppDirectory $AppPath
nssm set $AppName AppEnvironmentExtra "NODE_ENV=$NodeEnv"
nssm set $AppName AppExit Default Restart
nssm set $AppName AppRestartDelay 5000
nssm set $AppName AppStdout "$logsPath\stdout.log"
nssm set $AppName AppStderr "$logsPath\stderr.log"
nssm set $AppName AppRotateFiles 1
nssm set $AppName AppRotateOnline 1
nssm set $AppName AppRotateSeconds 86400
nssm set $AppName AppRotateBytes 104857600
Write-Success "✅ Параметры настроены"

# ═══════════════════════════════════════════════════════
# ЭТАП 11: Открытие портов брандмауэра
# ═══════════════════════════════════════════════════════
Write-Info "`n🔓 Этап 11: Открытие портов брандмауэра..."

$httpRule = Get-NetFirewallRule -DisplayName "Allow HTTP" -ErrorAction SilentlyContinue
if (-not $httpRule) {
    New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -Protocol tcp -LocalPort 80 -Action Allow | Out-Null
    Write-Success "✅ Порт 80 открыт"
} else {
    Write-Info "   Порт 80 уже открыт"
}

$httpsRule = Get-NetFirewallRule -DisplayName "Allow HTTPS" -ErrorAction SilentlyContinue
if (-not $httpsRule) {
    New-NetFirewallRule -DisplayName "Allow HTTPS" -Direction Inbound -Protocol tcp -LocalPort 443 -Action Allow | Out-Null
    Write-Success "✅ Порт 443 открыт"
} else {
    Write-Info "   Порт 443 уже открыт"
}

# ═══════════════════════════════════════════════════════
# ЭТАП 12: Запуск сервиса
# ═══════════════════════════════════════════════════════
Write-Info "`n▶️  Этап 12: Запуск сервиса..."

nssm start $AppName
Start-Sleep -Seconds 3

$serviceStatus = nssm status $AppName
if ($serviceStatus -eq "SERVICE_RUNNING") {
    Write-Success "✅ Сервис запущен и работает"
} else {
    Write-Error_ "⚠️  Статус сервиса: $serviceStatus"
    Write-Info "   Проверь логи: Get-Content '$logsPath\stderr.log' -Tail 50"
}

# ═══════════════════════════════════════════════════════
# ИТОГОВАЯ ИНФОРМАЦИЯ
# ═══════════════════════════════════════════════════════
Write-Info "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Success "✅ Развёртывание завершено!"
Write-Info "`n📋 Информация о сервисе:"
Write-Info "   Имя сервиса: $AppName"
Write-Info "   Путь приложения: $AppPath"
Write-Info "   Логи: $logsPath"

Write-Info "`n🔍 Полезные команды:"
Write-Info "   Статус:      nssm status $AppName"
Write-Info "   Перезапуск:  nssm restart $AppName"
Write-Info "   Остановка:   nssm stop $AppName"
Write-Info "   Логи:        Get-Content '$logsPath\stdout.log' -Tail 50"

Write-Info "`n🌐 Доступ к приложению:"
Write-Info "   Локально: http://localhost:3000"
Write-Info "   Через Nginx: http://localhost или https://yourdomain.com"

Write-Info "`n📖 Дальше смотри DEPLOYMENT_WINDOWS_SERVER.md"
Write-Info "   для настройки Nginx и доступа из интернета"
Write-Info ""
