# ============================================================
# Build de producao: frontend Next.js (estatico) + JAR Spring Boot
# Uso:  ./build-prod.ps1
# Saida: target/movitur-backend-0.0.1-SNAPSHOT.jar
# ============================================================
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host "=== 1/2 Frontend (npm run build, export estatico) ===" -ForegroundColor Cyan
$frontend = Join-Path $root "frontend"
$mw = Join-Path $frontend "src\middleware.ts"
$mwBak = Join-Path $frontend "src\middleware.ts.deploybak"
Push-Location $frontend
$env:MOVITUR_STATIC_EXPORT = "1"
$env:NEXT_PUBLIC_API_URL = "/api"
if (Test-Path $mw) {
    Rename-Item $mw $mwBak -Force
}
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build falhou" }
} finally {
    if (Test-Path $mwBak) {
        Rename-Item $mwBak $mw -Force
    }
    Pop-Location
}

$outDir = Join-Path $frontend "out"
$staticDir = Join-Path $root "src\main\resources\static"
if (-not (Test-Path $outDir)) {
    throw "Pasta frontend/out nao encontrada apos o build"
}
Write-Host "A copiar frontend/out para src/main/resources/static ..." -ForegroundColor Cyan
if (Test-Path $staticDir) {
    Remove-Item $staticDir -Recurse -Force
}
Copy-Item $outDir $staticDir -Recurse

Write-Host "=== 2/2 Backend (mvn package) ===" -ForegroundColor Cyan
$mvnCmd = "mvn"
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    $mvnCmd = "C:\Users\USER\Downloads\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin\mvn.cmd"
}

& $mvnCmd package -DskipTests
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$jar = Join-Path $root "target\movitur-backend-0.0.1-SNAPSHOT.jar"
Write-Host ""
Write-Host "Build concluido: $jar" -ForegroundColor Green
Write-Host "Para arrancar em producao: ./run-prod.ps1" -ForegroundColor Green
