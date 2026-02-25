@echo off
echo.
echo ========================================
echo 🧪 TESTE SSPHERE EM PRODUÇÃO
echo ========================================
echo.

echo 📡 TESTANDO API...
echo ========================================
echo Testando conexão com API...
curl -s -o nul -w "Status: %%{http_code} - Tempo: %%{time_total}s\n" https://api.ssphere.sstechnologies-cloud.com/api/status

echo.
echo Testando endpoint de login...
curl -s -o nul -w "Status: %%{http_code} - Tempo: %%{time_total}s\n" -X POST https://api.ssphere.sstechnologies-cloud.com/api/login

echo.
echo 🎨 TESTANDO FRONTEND...
echo ========================================
echo Testando página inicial...
curl -s -o nul -w "Status: %%{http_code} - Tempo: %%{time_total}s\n" https://ssphere.sstechnologies-cloud.com

echo.
echo 🔍 VERIFICANDO DNS...
echo ========================================
echo Resolvendo DNS da API...
nslookup api.ssphere.sstechnologies-cloud.com

echo.
echo Resolvendo DNS do frontend...
nslookup ssphere.sstechnologies-cloud.com

echo.
echo 📊 VERIFICANDO SSL...
echo ========================================
echo Verificando certificado da API...
curl -s -I https://api.ssphere.sstechnologies-cloud.com | findstr "HTTP"

echo Verificando certificado do frontend...
curl -s -I https://ssphere.sstechnologies-cloud.com | findstr "HTTP"

echo.
echo 🔧 INFORMAÇÕES DO DEPLOY...
echo ========================================
cd "c:\Projetos Git\Sphere rede social\Devagram-Node"
echo Backend:
vercel ls --scope=team_ssphere 2>nul || vercel ls

echo.
cd "c:\Projetos Git\Sphere rede social\Devagram-react"
echo Frontend:
vercel ls --scope=team_ssphere 2>nul || vercel ls

echo.
echo ========================================
echo 📋 RESUMO DOS TESTES
echo ========================================
echo 🌐 URLs de Produção:
echo   Frontend: https://ssphere.sstechnologies-cloud.com
echo   API: https://api.ssphere.sstechnologies-cloud.com
echo.
echo 🔧 Dashboards:
echo   Vercel: https://vercel.com/dashboard
echo   AWS Route53: https://console.aws.amazon.com/route53
echo.
echo ✅ Testes concluídos!
echo.
pause