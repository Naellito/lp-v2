@echo off
echo ========================================
echo    LOUP-GAROU - Installation
echo ========================================
echo.

echo [1/3] Installation du serveur...
cd server
call npm install
if errorlevel 1 (
    echo Erreur lors de l'installation du serveur
    pause
    exit /b 1
)
cd ..

echo.
echo [2/3] Installation du client...
cd client
call npm install
if errorlevel 1 (
    echo Erreur lors de l'installation du client
    pause
    exit /b 1
)

echo.
echo [3/3] Configuration de l'environnement...
if not exist .env (
    copy .env.example .env
    echo Fichier .env cree
)
cd ..

echo.
echo ========================================
echo    Installation terminee !
echo ========================================
echo.
echo Pour lancer le jeu :
echo   1. Double-cliquez sur start-server.bat
echo   2. Double-cliquez sur start-client.bat
echo.
pause
