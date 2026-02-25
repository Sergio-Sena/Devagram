@echo off
echo.
echo ========================================
echo 🚀 DEPLOY SSPHERE - VERCEL + ROUTE53
echo ========================================
echo.

REM Verificar se Vercel CLI está instalado
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI não encontrado!
    echo 📦 Instalando Vercel CLI...
    npm install -g vercel
)

echo ✅ Vercel CLI encontrado
echo.

REM Deploy Backend
echo 📡 DEPLOY BACKEND (API)...
echo ========================================
cd "c:\Projetos Git\Sphere rede social\Devagram-Node"

echo 🔧 Configurando projeto backend...
vercel --prod --confirm

if %errorlevel% neq 0 (
    echo ❌ Erro no deploy do backend!
    pause
    exit /b 1
)

echo ✅ Backend deployado com sucesso!
echo.

REM Deploy Frontend  
echo 🎨 DEPLOY FRONTEND...
echo ========================================
cd "c:\Projetos Git\Sphere rede social\Devagram-react"

echo 🔧 Configurando projeto frontend...
vercel --prod --confirm

if %errorlevel% neq 0 (
    echo ❌ Erro no deploy do frontend!
    pause
    exit /b 1
)

echo ✅ Frontend deployado com sucesso!
echo.

REM Mostrar URLs
echo 🌐 URLS GERADAS:
echo ========================================
echo 📡 Backend API: Verificar no dashboard da Vercel
echo 🎨 Frontend: Verificar no dashboard da Vercel
echo 🔧 Dashboard: https://vercel.com/dashboard
echo.

echo 📋 PRÓXIMOS PASSOS:
echo ========================================
echo 1. Anotar as URLs geradas no dashboard da Vercel
echo 2. Configurar variáveis de ambiente (ver guia)
echo 3. Configurar domínios customizados no Route53
echo 4. Testar aplicação em produção
echo.

echo ✅ Deploy inicial concluído!
echo 📖 Consulte DEPLOY-VERCEL-ROUTE53.md para próximos passos
echo.
pause