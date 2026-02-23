@echo off
echo ========================================
echo  REINICIANDO FRONTEND - SSphere
echo ========================================
echo.

cd "c:\Projetos Git\Sphere rede social\Devagram-react"

echo Parando processos Node.js...
taskkill /F /IM node.exe 2>nul

echo.
echo Aguardando 2 segundos...
timeout /t 2 /nobreak >nul

echo.
echo Limpando cache do Next.js...
if exist .next rmdir /s /q .next

echo.
echo Iniciando servidor frontend (porta 3001)...
echo URL da API: http://localhost:3000
echo.
echo ========================================
echo  Aguarde o servidor iniciar...
echo  Acesse: http://localhost:3001
echo ========================================
echo.

npm run dev
