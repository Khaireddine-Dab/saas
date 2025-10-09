# Backend Django SaaS

Ce backend Django fournit une API REST complète pour une application SaaS avec authentification, gestion d'organisations et abonnements.

## Fonctionnalités

- **Authentification** : Inscription, connexion, gestion des profils utilisateur
- **Organisations** : Création, gestion des membres, invitations
- **Abonnements** : Plans, abonnements, facturation, utilisation des ressources
- **API REST** : Endpoints complets avec Django REST Framework
- **Base de données** : PostgreSQL avec modèles optimisés

## Installation

### Prérequis
- Python 3.8+
- PostgreSQL
- pip ou pnpm

### Étapes d'installation

1. **Activer l'environnement virtuel** :
```bash
backend_env\Scripts\activate
```

2. **Installer les dépendances** :
```bash
pip install -r requirements.txt
```

3. **Configurer la base de données PostgreSQL** :
   - Créer une base de données nommée `saas_db`
   - Modifier les paramètres dans `env_file` si nécessaire

4. **Copier le fichier d'environnement** :
```bash
copy env_file .env
```

5. **Appliquer les migrations** :
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Créer un superutilisateur** (optionnel) :
```bash
python manage.py createsuperuser
```

7. **Démarrer le serveur** :
```bash
python manage.py runserver 8000
```

## Utilisation rapide

Utilisez le script de démarrage automatique :
```bash
start_backend.bat
```

## Structure de l'API

### Authentification (`/api/auth/`)
- `POST /register/` - Inscription
- `POST /login/` - Connexion
- `POST /logout/` - Déconnexion
- `GET /profile/` - Profil utilisateur
- `GET /dashboard/` - Tableau de bord

### Organisations (`/api/organizations/`)
- `GET /` - Liste des organisations
- `POST /` - Créer une organisation
- `GET /{id}/` - Détails d'une organisation
- `PUT /{id}/` - Modifier une organisation
- `DELETE /{id}/` - Supprimer une organisation
- `GET /{id}/members/` - Membres de l'organisation
- `POST /{id}/invite/` - Inviter un membre
- `POST /invitations/{token}/accept/` - Accepter une invitation

### Abonnements (`/api/subscriptions/`)
- `GET /plans/` - Liste des plans
- `GET /subscriptions/` - Abonnements de l'utilisateur
- `POST /subscriptions/create/{plan_id}/` - Créer un abonnement
- `PUT /subscriptions/{id}/` - Modifier un abonnement
- `DELETE /subscriptions/{id}/cancel/` - Annuler un abonnement
- `GET /subscriptions/{id}/usage/` - Utilisation des ressources
- `GET /invoices/` - Factures de l'utilisateur

## Configuration

### Variables d'environnement (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
```

### CORS
Le backend est configuré pour accepter les requêtes depuis le frontend Next.js sur `localhost:3000`.

## Administration

Accédez à l'interface d'administration Django sur :
http://localhost:8000/admin/

## Intégration avec le frontend

Le backend est prêt à être intégré avec le frontend Next.js. Les endpoints sont configurés pour accepter les requêtes CORS depuis `localhost:3000`.

### Exemple d'utilisation depuis le frontend

```javascript
// Connexion
const response = await fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});

const data = await response.json();
// Stocker le token pour les requêtes authentifiées
localStorage.setItem('token', data.token);
```

## Modèles de données

- **User** : Utilisateurs avec profil étendu
- **Organization** : Organisations avec membres et rôles
- **Subscription** : Abonnements avec plans et facturation
- **Usage** : Suivi de l'utilisation des ressources

## Sécurité

- Authentification par token
- Permissions par rôle dans les organisations
- Validation des données avec Django REST Framework
- Protection CORS configurée
