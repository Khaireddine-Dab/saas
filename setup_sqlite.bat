@echo off
echo Configuration avec SQLite (solution rapide)
echo.

echo Modification du fichier settings.py pour utiliser SQLite...
echo.

REM Faire une sauvegarde du fichier settings.py
copy saas_backend\settings.py saas_backend\settings.py.backup

REM Modifier le fichier settings.py pour utiliser SQLite
powershell -Command "(Get-Content saas_backend\settings.py) -replace 'ENGINE.*postgresql.*', 'ENGINE': 'django.db.backends.sqlite3'," -replace "NAME.*config.*DB_NAME.*", "NAME': BASE_DIR / 'db.sqlite3'," -replace "USER.*config.*DB_USER.*", "" -replace "PASSWORD.*config.*DB_PASSWORD.*", "" -replace "HOST.*config.*DB_HOST.*", "" -replace "PORT.*config.*DB_PORT.*", "" | Set-Content saas_backend\settings.py"

echo Fichier settings.py modifie pour utiliser SQLite.
echo.

echo Activation de l'environnement virtuel...
call backend_env\Scripts\activate

echo Copie du fichier d'environnement...
copy env_file .env

echo Application des migrations...
python manage.py makemigrations
python manage.py migrate

echo.
echo Configuration SQLite terminee!
echo.
echo Pour creer un superutilisateur, tapez:
echo python manage.py createsuperuser
echo.
echo Pour demarrer le serveur, tapez:
echo python manage.py runserver 8000
echo.
echo Pour restaurer PostgreSQL plus tard, executez:
echo copy saas_backend\settings.py.backup saas_backend\settings.py
echo.
pause
