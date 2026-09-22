# Arranca backend + frontend MoviTur
# Uso: ./run-all.ps1
$ErrorActionPreference = "Stop"

Write-Host "A arrancar backend (8080) e frontend Next.js (3000)..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run-backend.ps1"
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run-frontend.ps1"

Write-Host "Backend: http://localhost:8080/api" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
 