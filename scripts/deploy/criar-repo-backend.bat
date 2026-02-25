@echo off
echo ========================================
echo  CRIANDO REPOSITORIO SEPARADO - BACKEND
echo ========================================
echo.

cd "c:\Projetos Git"

echo Copiando Devagram-Node...
xcopy "Sphere rede social\Devagram-Node" "SSphere-Backend" /E /I /H /Y

cd SSphere-Backend

echo.
echo Inicializando Git...
git init
git add .
git commit -m "Initial commit - SSphere Backend"

echo.
echo ========================================
echo  PRONTO! Agora execute estes comandos:
echo ========================================
echo.
echo git remote add origin https://github.com/Sergio-Sena/SSphere-Backend.git
echo git branch -M main
echo git push -u origin main
echo.
echo ========================================
pause
