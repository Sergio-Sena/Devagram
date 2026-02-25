@echo off
echo ========================================
echo Iniciando Servidores SSphere
echo ========================================
echo.

REM Verificar se as portas estão livres
netstat -ano | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo ❌ Porta 3000 já está em uso!
    echo Execute parar-servidores.bat primeiro
    pause
    exit /b 1
)

netstat -ano | findstr ":3001" >nul
if %errorlevel% equ 0 (
    echo ❌ Porta 3001 já está em uso!
    echo Execute parar-servidores.bat primeiro
    pause
    exit /b 1
)

echo ✅ Portas 3000 e 3001 estão livres
echo.

REM Iniciar Backend
echo ========================================
echo 🚀 Iniciando Backend (porta 3000)...
echo ========================================
start "SSphere Backend" cmd /k "cd Devagram-Node && npm run dev"
timeout /t 5 /nobreak >nul

REM Iniciar Frontend
echo.
echo ========================================
echo 🚀 Iniciando Frontend (porta 3001)...
echo ========================================
start "SSphere Frontend" cmd /k "cd Devagram-react && npm run dev"

echo.
echo ========================================
echo ✅ Servidores iniciados!
echo ========================================
echo.
echo 🌐 URLs:
echo    Backend:  http://localhost:3000/api
echo    Frontend: http://localhost:3001
echo.
echo 📋 Credenciais de teste:
echo    Email: teste@teste.com
echo    Senha: 1234
echo.
echo ⚠️  Aguarde alguns segundos para os servidores iniciarem
echo.
pause
