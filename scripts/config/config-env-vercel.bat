@echo off
echo.
echo ========================================
echo ⚙️ CONFIGURAR VARIÁVEIS DE AMBIENTE
echo ========================================
echo.

echo 📡 CONFIGURANDO BACKEND...
echo ========================================
cd "c:\Projetos Git\Sphere rede social\Devagram-Node"

echo Configurando MONGODB_URI...
vercel env add MONGODB_URI production
echo.

echo Configurando JWT_SECRET...
vercel env add JWT_SECRET production
echo.

echo Configurando AWS_ACCESS_KEY_ID...
vercel env add AWS_ACCESS_KEY_ID production
echo.

echo Configurando AWS_SECRET_ACCESS_KEY...
vercel env add AWS_SECRET_ACCESS_KEY production
echo.

echo Configurando AWS_BUCKET_NAME...
vercel env add AWS_BUCKET_NAME production
echo.

echo Configurando AWS_REGION...
vercel env add AWS_REGION production
echo.

echo Configurando CORS_ORIGIN...
vercel env add CORS_ORIGIN production
echo.

echo ✅ Variáveis do backend configuradas!
echo.

echo 🎨 CONFIGURANDO FRONTEND...
echo ========================================
cd "c:\Projetos Git\Sphere rede social\Devagram-react"

echo Configurando NEXT_PUBLIC_API_URL...
vercel env add NEXT_PUBLIC_API_URL production
echo.

echo ✅ Variáveis do frontend configuradas!
echo.

echo 🔄 REDEPLOYANDO COM NOVAS VARIÁVEIS...
echo ========================================

echo Redeployando backend...
cd "c:\Projetos Git\Sphere rede social\Devagram-Node"
vercel --prod

echo Redeployando frontend...
cd "c:\Projetos Git\Sphere rede social\Devagram-react"
vercel --prod

echo.
echo ✅ Configuração concluída!
echo 📖 Próximo passo: configurar domínios customizados
echo.
pause