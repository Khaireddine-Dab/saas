# Promotions API - Django App

## Overview

La table `promotions` gère les promotions et les réductions pour les boutiques et leurs items (produits et services).

## Architecture

### Models

#### Promotion Model
- Lié à la table PostgreSQL `promotions` (managed=False)
- **Fields:**
  - `id` (BigAutoField, Primary Key)
  - `store_id` (Foreign Key → stores.id) - Boutique propriétaire
  - `title` (TextField) - Nom de la promotion
  - `description` (TextField) - Description détaillée
  - `discount_percent` (DecimalField, 0-100) - Pourcentage de remise
  - `discount_text` (TextField) - Texte personnalisé (ex: "Buy 2 Get 1 Free")
  - `valid_from` (DateField) - Date de début
  - `valid_until` (DateField) - Date de fin
  - `active` (BooleanField) - Activation/désactivation
  - `apply_to_all` (BooleanField) - S'applique à tous les items du store
  - `item_id` (Foreign Key → items.id, nullable) - Item spécifique (si apply_to_all=False)
  - `created_at` (DateTimeField) - Date de création

- **Methods:**
  - `is_active` - Vérifie si la promotion est active aujourd'hui
  - `is_upcoming` - Vérifie si elle commence dans le futur
  - `is_expired` - Vérifie si elle a expiré
  - `days_remaining` - Nombre de jours restants
  - `get_discount_display()` - Retourne le texte de remise formaté
  - `target_items` - Retourne les items concernés par la promotion

#### PromotionItem Model (Many-to-Many Junction)
- Lié à la table PostgreSQL `promotion_items` (managed=False)
- **Fields:**
  - `promotion_id` (Foreign Key → promotions.id)
  - `item_id` (Foreign Key → items.id)
  - Clé primaire composite: (promotion_id, item_id)

### Serializers

1. **PromotionListSerializer** - Vue en liste (légère)
   - Inclut: statuts calculés, affichage de remise
   - Sans détails complets

2. **PromotionDetailSerializer** - Vue détaillée
   - Inclut: détails du store, items ciblés, tous les statuts
   - Avec items liés complètement sérialisés

3. **PromotionCreateUpdateSerializer** - Pour créer/modifier
   - Validation: discount_percent OU discount_text obligatoire
   - Validation: valid_from < valid_until

### Views/Endpoints

#### Listing & CRUD
- **GET** `/api/promotions/` - Liste toutes les promotions
  - Filtres optionnels:
    - `?store_id=123` - Filter by store
    - `?active=true` - Uniquement les promotions actives aujourd'hui
  - Réponse: Array de promotions (PromotionListSerializer)

- **POST** `/api/promotions/` - Créer une promotion
  - Body: titre, description, remise, dates, boutique
  - Response: Nouvelle promotion (PromotionDetailSerializer)

- **GET** `/api/promotions/{id}/` - Détails d'une promotion
  - Response: PromotionDetailSerializer

- **PUT** `/api/promotions/{id}/` - Modifier une promotion
  - Body: Champs à modifier
  - Response: Promotion modifiée

- **DELETE** `/api/promotions/{id}/` - Supprimer une promotion
  - Response: 204 No Content

#### Store-Specific
- **GET** `/api/promotions/store/{store_id}/` - Promotions d'une boutique
  - Response: Array de promotions de ce store

#### Status-Specific
- **GET** `/api/promotions/active/` - Uniquement les promotions actives
  - Filtrage automatique par date et flag `active`
  - Response: Array de promotions actives

#### Statistics
- **GET** `/api/promotions/stats/` - Statistiques
  - Response:
    ```json
    {
      "total_promotions": 42,
      "active_promotions": 15,
      "upcoming_promotions": 8,
      "expired_promotions": 19
    }
    ```

## Authentication

Tous les endpoints requièrent JWT authentication via `JWTAuthentication`.
Header requis: `Authorization: Bearer <token>`

## Files Structure

```
backend/promotions/
├── __init__.py
├── apps.py              # Configuration de l'app
├── models.py            # Promotion, PromotionItem
├── serializers.py       # 3 serializers
├── views.py             # 5 APIView classes
├── urls.py              # Routing
├── admin.py             # Django admin interface
├── tests.py             # Unit tests (à compléter)
└── migrations/
    └── __init__.py
```

## Registration

L'app est enregistrée dans `core/settings.py`:
```python
INSTALLED_APPS = [
    ...
    'promotions',
]
```

Les URLs sont incluses dans `core/urls.py`:
```python
path('api/promotions/', include('promotions.urls')),
```

## Database Schema Notes

- `managed = False` - Django n'essaiera pas de migrer cette table
- Timestamps créés et gérés par PostgreSQL (DEFAULT now())
- Relation Many-to-Many explicite avec table `promotion_items`
- idx_promotions sur store_id et valid_from recommandé pour performance

## Usage Examples

### Créer une promotion
```bash
POST /api/promotions/
{
  "store": 1,
  "title": "Soldes d'été",
  "description": "Promotion spéciale tous les articles",
  "discount_percent": 20,
  "valid_from": "2026-04-07",
  "valid_until": "2026-04-30",
  "active": true,
  "apply_to_all": true
}
```

### Obtenir les promotions actives d'un store
```bash
GET /api/promotions/?store_id=1&active=true
```

### Modifier une promotion
```bash
PUT /api/promotions/42/
{
  "title": "Nouvelle Solde",
  "active": false
}
```

## Next Steps

1. Ajouter tests unitaires dans `tests.py`
2. Ajouter pagination aux list views
3. Ajouter permissions (admin seul peut créer/modifier)
4. Ajouter filters (django-filter) pour recherche avancée
5. Ajouter cache (Redis) pour statistiques
6. Créer une page frontend pour gérer les promotions

## Admin Interface

- Accès via Django admin: `/admin/promotions/promotion/`
- Filtrage par store, dates, statut
- Recherche par titre et description
- Actions en masse possibles
