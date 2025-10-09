@echo off
echo Configuration et demarrage de PostgreSQL pour le SaaS
echo.

REM Verifier si PostgreSQL est installe
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo PostgreSQL n'est pas installe ou pas dans le PATH.
    echo.
    echo Veuillez installer PostgreSQL depuis: https://www.postgresql.org/download/windows/
    echo.
    echo Ou utilisez SQLite en attendant:
    echo 1. Ouvrez saas_backend/settings.py
    echo 2. Remplacez la configuration DATABASES par:
    echo    DATABASES = {
    echo        'default': {
    echo            'ENGINE': 'django.db.backends.sqlite3',
    echo            'NAME': BASE_DIR / 'db.sqlite3',
    echo        }
    echo    }
    echo.
    pause
    exit /b 1
)

echo PostgreSQL detecte. Verification du service...
echo.

REM Demarrer le service PostgreSQL
echo Demarrage du service PostgreSQL...
net start postgresql-x64-14 >nul 2>nul
if %errorlevel% equ 0 (
    echo Service PostgreSQL demarre avec succes.
) else (
    echo Tentative de demarrage du service...
    net start postgresql-x64-15 >nul 2>nul
    if %errorlevel% equ 0 (
        echo Service PostgreSQL 15 demarre avec succes.
    ) else (
        echo Erreur lors du demarrage du service PostgreSQL.
        echo Veuillez demarrer manuellement le service depuis:
        echo - Services Windows (services.msc)
        echo - Cherchez "postgresql" et demarrez le service
        echo.
        echo Ou utilisez SQLite temporairement (voir instructions ci-dessus).
        pause
        exit /b 1
    )
)

echo.
echo Creation de la base de donnees...
echo Entrez le mot de passe de l'utilisateur postgres quand demande:

REM Creer la base de donnees
psql -U postgres -c "CREATE DATABASE saas_db;" 2>nul
if %errorlevel% equ 0 (
    echo Base de donnees 'saas_db' creee avec succes.
) else (
    echo La base de donnees existe deja ou erreur lors de la creation.
)

echo.
echo Configuration terminee!
echo Vous pouvez maintenant executer: start_backend.bat
echo.
pause
