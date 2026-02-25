@echo off
echo 🚀 DEPLOY AUTOMATICO SSPHERE - SEM INTERRUPCOES
echo ========================================

REM Instalar Vercel CLI se necessário
npm install -g vercel >nul 2>&1

REM Login automático (usar token se disponível)
vercel whoami >nul 2>&1 || vercel login

echo 📡 Deployando Backend...
cd "c:\Projetos Git\Sphere rede social\Devagram-Node"
vercel --prod --yes --confirm

echo 🎨 Deployando Frontend...  
cd "c:\Projetos Git\Sphere rede social\Devagram-react"
vercel --prod --yes --confirm

echo ✅ Deploy concluído!
echo 🌐 Verifique URLs no dashboard: https://vercel.com/dashboard