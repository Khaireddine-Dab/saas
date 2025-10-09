@echo off
echo Configuration de la base de données PostgreSQL pour le SaaS
echo.
echo Ce script va:
echo 1. Creer la base de donnees saas_db
echo 2. Configurer les permissions
echo.
echo Assurez-vous que PostgreSQL est installe et en cours d'execution
echo.

set /p continue=Continuer? (y/n): 
if "%continue%" neq "y" (
    echo Operation annulee.
    pause
    exit /b
)

echo.
echo Connexion a PostgreSQL...
echo Entrez le mot de passe de l'utilisateur postgres quand demande
psql -U postgres -f setup_database.sql

if %errorlevel% equ 0 (
    echo.
    echo Base de donnees configuree avec succes!
    echo Vous pouvez maintenant executer: start_backend.bat
) else (
    echo.
    echo Erreur lors de la configuration de la base de donnees.
    echo Verifiez que PostgreSQL est installe et en cours d'execution.
)

echo.
pause
