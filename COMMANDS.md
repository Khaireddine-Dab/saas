# Commandes utiles pour le backend Django

## Démarrage rapide

### 1. Configuration initiale
```bash
# Activer l'environnement virtuel
backend_env\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer la base de données PostgreSQL
setup_database.bat

# Copier le fichier d'environnement
copy env_file .env

# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur (optionnel)
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver 8000
```

### 2. Démarrage automatique
```bash
start_backend.bat
```

## Commandes Django utiles

### Gestion des migrations
```bash
# Créer de nouvelles migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Voir le statut des migrations
python manage.py showmigrations

# Annuler une migration
python manage.py migrate app_name migration_number
```

### Gestion des utilisateurs
```bash
# Créer un superutilisateur
python manage.py createsuperuser

# Changer le mot de passe d'un utilisateur
python manage.py changepassword username
```

### Base de données
```bash
# Accéder au shell Django
python manage.py shell

# Charger des données de test
python manage.py loaddata fixtures.json

# Exporter des données
python manage.py dumpdata > data.json
```

### Serveur de développement
```bash
# Démarrer le serveur
python manage.py runserver

# Démarrer sur un port spécifique
python manage.py runserver 8080

# Démarrer sur toutes les interfaces
python manage.py runserver 0.0.0.0:8000
```

## URLs importantes

- **API Base** : http://localhost:8000/api/
- **Admin Django** : http://localhost:8000/admin/
- **API Auth** : http://localhost:8000/api/auth/
- **API Organizations** : http://localhost:8000/api/organizations/
- **API Subscriptions** : http://localhost:8000/api/subscriptions/

## Test des endpoints API

### Inscription
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "password": "password123",
    "password_confirm": "password123"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Liste des plans (sans authentification)
```bash
curl http://localhost:8000/api/subscriptions/plans/
```

### Accès authentifié (avec token)
```bash
curl -H "Authorization: Token YOUR_TOKEN_HERE" \
  http://localhost:8000/api/auth/profile/
```

## Dépannage

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez les paramètres dans le fichier `.env`
- Assurez-vous que la base de données `saas_db` existe

### Erreurs de migration
```bash
# Supprimer les migrations (ATTENTION: perte de données)
python manage.py migrate --fake app_name zero

# Recréer les migrations
python manage.py makemigrations app_name
python manage.py migrate
```

### Problèmes de permissions
```bash
# Vérifier les permissions de la base de données
psql -U postgres -d saas_db -c "\dp"
```

## Production

### Variables d'environnement pour la production
```env
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_HOST=your-production-db-host
DB_PASSWORD=your-production-password
```

### Collecte des fichiers statiques
```bash
python manage.py collectstatic
```

### Tests
```bash
# Lancer tous les tests
python manage.py test

# Lancer les tests d'une app spécifique
python manage.py test accounts
```
