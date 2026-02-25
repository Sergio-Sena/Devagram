@echo off
echo ========================================
echo Limpando portas 3000, 3001, 3002...
echo ========================================
echo.

REM Porta 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
    echo Matando processo na porta 3000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

REM Porta 3001
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
    echo Matando processo na porta 3001 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

REM Porta 3002
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002"') do (
    echo Matando processo na porta 3002 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ========================================
echo Portas limpas! Pronto para iniciar.
echo ========================================
echo.
echo Agora execute:
echo 1. cd Devagram-Node ^&^& npm run dev
echo 2. cd Devagram-react ^&^& npm run dev
echo.
pause
