# Arranca o frontend Next.js MoviTur
# Uso: ./run-frontend.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\frontend
Write-Host "A arrancar frontend Next.js (http://127.0.0.1:3000)..." -ForegroundColor Cyan
npx next dev -H 127.0.0.1 -p 3000
