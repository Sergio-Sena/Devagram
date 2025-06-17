@echo off
echo Reiniciando servidores Devagram...

echo.
echo === Parando processos existentes ===
taskkill /f /im node.exe 2>nul

echo.
echo === Iniciando servidor backend (Devagram-Node) ===
start cmd /k "cd c:\Projetos Git\Devaria\Devagram-Node && npm run dev"

echo.
echo === Iniciando servidor frontend (Devagram-react) ===
start cmd /k "cd c:\Projetos Git\Devaria\Devagram-react && npm run dev"

echo.
echo === Servidores reiniciados ===
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3001
echo.
echo Credenciais de acesso:
echo - Email: user1@devagram.com | Senha: 2700
echo - Email: user2@devagram.com | Senha: 2700
echo - Email: user3@devagram.com | Senha: 2700
echo.
echo Acesse http://localhost:3001/reset.html para limpar o cache antes de fazer login.