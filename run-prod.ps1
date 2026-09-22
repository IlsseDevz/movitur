# ============================================================
# Arranca o JAR de producao com variaveis de movitur.env
# Uso:  ./build-prod.ps1   (primeira vez ou apos alteracoes)
#       ./run-prod.ps1
# ============================================================
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$jar = Join-Path $root "target\movitur-backend-0.0.1-SNAPSHOT.jar"

if (-not (Test-Path $jar)) {
    Write-Host "JAR nao encontrado. Execute primeiro: ./build-prod.ps1" -ForegroundColor Red
    exit 1
}

$envFile = Join-Path $root "movitur.env"
if (Test-Path $envFile) {
    Write-Host "A carregar credenciais de movitur.env..." -ForegroundColor Cyan
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $idx = $line.IndexOf("=")
            $key = $line.Substring(0, $idx).Trim()
            $value = $line.Substring($idx + 1).Trim()
            if ($value.StartsWith('"') -and $value.EndsWith('"')) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
} else {
    Write-Host "Aviso: movitur.env nao encontrado." -ForegroundColor Yellow
}

if (-not $env:SPRING_PROFILES_ACTIVE) {
    [Environment]::SetEnvironmentVariable("SPRING_PROFILES_ACTIVE", "prod", "Process")
}

$port = if ($env:MOVITUR_SERVER_PORT) { $env:MOVITUR_SERVER_PORT } else { "8080" }
Write-Host "A arrancar MoviTur (perfil prod) na porta $port..." -ForegroundColor Cyan
java -jar $jar --server.port=$port
