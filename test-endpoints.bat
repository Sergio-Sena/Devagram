@echo off
echo ===== Testando endpoints do Devagram =====
echo.

echo === Configurando variáveis ===
set BACKEND_URL=http://localhost:3000/api
set FRONTEND_URL=http://localhost:3001
set TOKEN=

echo.
echo === Testando endpoints do Backend ===
echo.

echo 1. Testando endpoint de login...
curl -X POST %BACKEND_URL%/login -H "Content-Type: application/json" -d "{\"login\":\"user1@devagram.com\",\"senha\":\"2700\"}" -s > login_response.json
echo Resposta salva em login_response.json

echo.
echo 2. Extraindo token do login...
for /f "tokens=*" %%a in ('type login_response.json ^| findstr /C:"token"') do (
    set TOKEN_LINE=%%a
)
echo Token obtido e armazenado para próximos testes

echo.
echo 3. Testando endpoint de feed...
curl -X GET "%BACKEND_URL%/feed" -H "Authorization: Bearer %TOKEN%" -s > feed_response.json
echo Resposta salva em feed_response.json

echo.
echo 4. Testando endpoint de pesquisa...
curl -X GET "%BACKEND_URL%/pesquisa?filtro=user" -H "Authorization: Bearer %TOKEN%" -s > pesquisa_response.json
echo Resposta salva em pesquisa_response.json

echo.
echo 5. Testando endpoint de usuário...
curl -X GET "%BACKEND_URL%/usuario?id=user1" -H "Authorization: Bearer %TOKEN%" -s > usuario_response.json
echo Resposta salva em usuario_response.json

echo.
echo === Testando endpoints do Frontend ===
echo.

echo 1. Testando acesso à página inicial do frontend...
curl -X GET %FRONTEND_URL% -s > frontend_home.html
echo Resposta salva em frontend_home.html

echo.
echo 2. Testando acesso à página de reset de cache...
curl -X GET %FRONTEND_URL%/reset.html -s > frontend_reset.html
echo Resposta salva em frontend_reset.html

echo.
echo === Testes concluídos ===
echo Verifique os arquivos de resposta para analisar os resultados
echo.