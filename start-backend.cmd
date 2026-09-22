@echo off
echo ========================================
echo   MoviTur - Reiniciar Backend
echo ========================================

set MVN=%USERPROFILE%\Downloads\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin\mvn.cmd
cd /d "%~dp0"

echo.
echo [1/3] A parar processo na porta 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo       A terminar PID %%a
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 3 /nobreak >nul

echo [2/3] A compilar projeto...
call "%MVN%" -o compile -q
if errorlevel 1 (
    echo ERRO na compilacao!
    pause
    exit /b 1
)

echo [3/3] A iniciar Spring Boot (com movitur.env)...
echo.
echo   Frontend: http://localhost:3000/cliente
echo   Admin:    http://localhost:3000/admin/login
echo   API:      http://localhost:8080/api
echo.
echo   IMPORTANTE: Tambem arranque o frontend com .\run-frontend.ps1
echo               ou use .\run-all.ps1 para os dois servicos.
powershell -ExecutionPolicy Bypass -File "%~dp0run-backend.ps1"
