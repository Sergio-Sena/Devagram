@echo off
echo ========================================
echo Parando todos os servidores Node.js...
echo ========================================
echo.

REM Matar todos os processos node.exe
taskkill /F /IM node.exe >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Todos os servidores Node.js foram parados
) else (
    echo ⚠️  Nenhum servidor Node.js estava rodando
)

echo.
echo ========================================
echo Limpando portas 3000 e 3001...
echo ========================================
echo.

REM Porta 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
    echo Liberando porta 3000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

REM Porta 3001
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
    echo Liberando porta 3001 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ✅ Portas liberadas!
echo.
pause
