@echo off
echo Activation de l'environnement virtuel...
call backend_env\Scripts\activate

echo Copie du fichier d'environnement...
copy env_file .env

echo Application des migrations...
python manage.py makemigrations
python manage.py migrate

echo Creation d'un superutilisateur (optionnel)...
echo Si vous voulez creer un superutilisateur, tapez 'yes' sinon 'no'
set /p create_superuser=Creer un superutilisateur? (yes/no): 
if "%create_superuser%"=="yes" (
    python manage.py createsuperuser
)

echo Demarrage du serveur Django...
python manage.py runserver 8000
