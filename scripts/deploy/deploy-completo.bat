@echo off
echo.
echo ========================================
echo 🚀 SSPHERE - DEPLOY COMPLETO
echo    Vercel + Route53 + Domínio Customizado
echo ========================================
echo.

echo Este script irá:
echo 1. 📦 Verificar dependências
echo 2. 🚀 Deploy inicial na Vercel
echo 3. ⚙️ Configurar variáveis de ambiente
echo 4. 🌐 Configurar domínios customizados
echo 5. 🧪 Testar aplicação em produção
echo.

set /p CONTINUAR="Deseja continuar? (S/N): "
if /i not "%CONTINUAR%"=="S" (
    echo ❌ Deploy cancelado pelo usuário
    pause
    exit /b 0
)

echo.
echo ========================================
echo 📦 VERIFICANDO DEPENDÊNCIAS...
echo ========================================

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo 📥 Instale Node.js: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

REM Verificar npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado!
    pause
    exit /b 1
)
echo ✅ npm encontrado

REM Verificar/Instalar Vercel CLI
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Instalando Vercel CLI...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar Vercel CLI!
        pause
        exit /b 1
    )
)
echo ✅ Vercel CLI encontrado

REM Verificar AWS CLI
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS CLI não encontrado!
    echo 📥 Instale AWS CLI: https://aws.amazon.com/cli/
    pause
    exit /b 1
)
echo ✅ AWS CLI encontrado

echo.
echo ========================================
echo 🔐 VERIFICANDO AUTENTICAÇÃO...
echo ========================================

echo Verificando login na Vercel...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔑 Fazendo login na Vercel...
    vercel login
    if %errorlevel% neq 0 (
        echo ❌ Erro no login da Vercel!
        pause
        exit /b 1
    )
)
echo ✅ Autenticado na Vercel

echo Verificando configuração AWS...
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS não configurado!
    echo 🔧 Execute: aws configure
    pause
    exit /b 1
)
echo ✅ AWS configurado

echo.
echo ========================================
echo 🚀 ETAPA 1: DEPLOY INICIAL
echo ========================================
call deploy-vercel.bat
if %errorlevel% neq 0 (
    echo ❌ Erro no deploy inicial!
    pause
    exit /b 1
)

echo.
echo ========================================
echo ⚙️ ETAPA 2: CONFIGURAR VARIÁVEIS
echo ========================================
call config-env-vercel.bat
if %errorlevel% neq 0 (
    echo ❌ Erro na configuração de variáveis!
    pause
    exit /b 1
)

echo.
echo ========================================
echo 🌐 ETAPA 3: CONFIGURAR DOMÍNIOS
echo ========================================
call config-dominios.bat
if %errorlevel% neq 0 (
    echo ❌ Erro na configuração de domínios!
    pause
    exit /b 1
)

echo.
echo ========================================
echo ⏳ AGUARDANDO PROPAGAÇÃO DNS...
echo ========================================
echo Aguardando 2 minutos para propagação DNS...
timeout /t 120 /nobreak

echo.
echo ========================================
echo 🧪 ETAPA 4: TESTES FINAIS
echo ========================================
call test-producao.bat

echo.
echo ========================================
echo 🎉 DEPLOY CONCLUÍDO COM SUCESSO!
echo ========================================
echo.
echo 🌐 Suas URLs de produção:
echo   Frontend: https://ssphere.sstechnologies-cloud.com
echo   API: https://api.ssphere.sstechnologies-cloud.com
echo.
echo 🔧 Dashboards úteis:
echo   Vercel: https://vercel.com/dashboard
echo   AWS Route53: https://console.aws.amazon.com/route53
echo.
echo 📚 Documentação:
echo   Guia completo: DEPLOY-VERCEL-ROUTE53.md
echo.
echo ✅ SSphere está online e funcionando!
echo.
pause