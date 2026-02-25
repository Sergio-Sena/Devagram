@echo off
echo.
echo ========================================
echo 🌐 CONFIGURAR DOMÍNIOS CUSTOMIZADOS
echo ========================================
echo.

echo IMPORTANTE: Você precisa ter o Hosted Zone ID do Route53
echo Exemplo: Z1234567890ABC
echo.
set /p HOSTED_ZONE_ID="Digite o Hosted Zone ID do Route53: "

if "%HOSTED_ZONE_ID%"=="" (
    echo ❌ Hosted Zone ID é obrigatório!
    pause
    exit /b 1
)

echo.
echo 🔧 ADICIONANDO DOMÍNIOS NA VERCEL...
echo ========================================

echo Adicionando domínio da API...
cd "c:\Projetos Git\Sphere rede social\Devagram-Node"
vercel domains add api.ssphere.sstechnologies-cloud.com

echo Adicionando domínio do frontend...
cd "c:\Projetos Git\Sphere rede social\Devagram-react"
vercel domains add ssphere.sstechnologies-cloud.com

echo.
echo 📡 CONFIGURANDO DNS NO ROUTE53...
echo ========================================

echo Criando registro CNAME para API...
aws route53 change-resource-record-sets --hosted-zone-id %HOSTED_ZONE_ID% --change-batch "{\"Changes\":[{\"Action\":\"UPSERT\",\"ResourceRecordSet\":{\"Name\":\"api.ssphere.sstechnologies-cloud.com\",\"Type\":\"CNAME\",\"TTL\":300,\"ResourceRecords\":[{\"Value\":\"cname.vercel-dns.com\"}]}}]}"

echo Criando registro CNAME para frontend...
aws route53 change-resource-record-sets --hosted-zone-id %HOSTED_ZONE_ID% --change-batch "{\"Changes\":[{\"Action\":\"UPSERT\",\"ResourceRecordSet\":{\"Name\":\"ssphere.sstechnologies-cloud.com\",\"Type\":\"CNAME\",\"TTL\":300,\"ResourceRecords\":[{\"Value\":\"cname.vercel-dns.com\"}]}}]}"

echo.
echo ⚙️ ATUALIZANDO VARIÁVEIS DE AMBIENTE...
echo ========================================

echo Atualizando CORS_ORIGIN no backend...
cd "c:\Projetos Git\Sphere rede social\Devagram-Node"
vercel env rm CORS_ORIGIN production
echo Digite: https://ssphere.sstechnologies-cloud.com
vercel env add CORS_ORIGIN production

echo Atualizando NEXT_PUBLIC_API_URL no frontend...
cd "c:\Projetos Git\Sphere rede social\Devagram-react"
vercel env rm NEXT_PUBLIC_API_URL production
echo Digite: https://api.ssphere.sstechnologies-cloud.com
vercel env add NEXT_PUBLIC_API_URL production

echo.
echo 🔄 REDEPLOYANDO COM DOMÍNIOS CUSTOMIZADOS...
echo ========================================

echo Redeployando backend...
cd "c:\Projetos Git\Sphere rede social\Devagram-Node"
vercel --prod

echo Redeployando frontend...
cd "c:\Projetos Git\Sphere rede social\Devagram-react"
vercel --prod

echo.
echo ✅ CONFIGURAÇÃO CONCLUÍDA!
echo ========================================
echo 🌐 Frontend: https://ssphere.sstechnologies-cloud.com
echo 📡 API: https://api.ssphere.sstechnologies-cloud.com
echo.
echo ⏳ Aguarde 5-10 minutos para propagação DNS
echo 🧪 Execute test-producao.bat para testar
echo.
pause