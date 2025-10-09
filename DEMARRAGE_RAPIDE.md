# 🚀 Démarrage Rapide - Backend Django SaaS

## ✅ Configuration Terminée !

Le backend Django avec PostgreSQL/SQLite est maintenant **entièrement configuré** et prêt à l'emploi.

## 🎯 Accès aux Services

### 🌐 **API Backend** (en cours d'exécution)
- **URL** : http://localhost:8000/api/
- **Admin Django** : http://localhost:8000/admin/
- **Credentials Admin** :
  - Email: `admin@saas.com`
  - Mot de passe: `admin123`

### 📊 **Endpoints API Disponibles**

#### Authentification
- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion  
- `GET /api/auth/profile/` - Profil utilisateur
- `GET /api/auth/dashboard/` - Tableau de bord

#### Organisations
- `GET /api/organizations/` - Liste des organisations
- `POST /api/organizations/` - Créer une organisation
- `GET /api/organizations/{id}/` - Détails organisation

#### Abonnements
- `GET /api/subscriptions/plans/` - Plans disponibles
- `GET /api/subscriptions/subscriptions/` - Abonnements utilisateur

## 🛠️ Commandes Utiles

### Démarrer le backend
```bash
# Activer l'environnement
backend_env\Scripts\activate

# Démarrer le serveur
python manage.py runserver 8000
```

### Scripts automatiques
```bash
# Configuration avec SQLite (recommandé)
setup_sqlite.bat

# Configuration avec PostgreSQL
setup_postgresql.bat

# Démarrage complet
start_backend.bat
```

## 🧪 Test de l'API

### Test d'inscription
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

### Test de connexion
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📁 Structure du Projet

```
saas-main/
├── backend_env/          # Environnement Python virtuel
├── saas_backend/         # Projet Django principal
├── accounts/             # App utilisateurs
├── organizations/        # App organisations
├── subscriptions/        # App abonnements
├── requirements.txt      # Dépendances Python
├── db.sqlite3           # Base de données SQLite
├── .env                 # Variables d'environnement
└── README files         # Documentation
```

## 🔧 Configuration Actuelle

- **Base de données** : SQLite (db.sqlite3)
- **Authentification** : Token-based avec Django REST Framework
- **CORS** : Configuré pour localhost:3000 (frontend Next.js)
- **Admin** : Interface Django disponible

## 🚀 Prochaines Étapes

1. **Tester l'API** avec les endpoints ci-dessus
2. **Intégrer avec le frontend** Next.js
3. **Configurer PostgreSQL** si nécessaire (optionnel)
4. **Déployer en production**

## 📞 Support

- **Documentation complète** : `BACKEND_README.md`
- **Commandes détaillées** : `COMMANDS.md`
- **Admin Django** : http://localhost:8000/admin/

---

🎉 **Le backend est maintenant opérationnel !** Vous pouvez commencer à développer votre frontend Next.js en utilisant cette API.
