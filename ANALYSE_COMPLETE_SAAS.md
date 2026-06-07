# 📊 ANALYSE COMPLÈTE DU PROJET SAAS - talkBridge

## 🏗️ ARCHITECTURE GÉNÉRALE

### Tech Stack
- **Frontend**: Next.js 14.2, React 18, TypeScript
- **Backend**: Django (Python)
- **Database**: PostgreSQL (Supabase)
- **Authentication**: NextAuth.js (JWT)
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React Hooks + Context API
- **API Communication**: Fetch API with Token Refresh
- **Maps**: Mapbox GL
- **Analytics**: Vercel Analytics

---

## 📁 STRUCTURE DU PROJET

```
saas/
├── app/                    # Next.js App Router (Frontend Pages)
│   ├── page.tsx           # Landing Page (accueil)
│   ├── layout.tsx         # Root Layout
│   ├── login/             # Page de connexion
│   ├── signup/            # Page d'inscription
│   └── dashboard/         # Tableau de bord admin
│
├── backend/               # Django API Backend
│   ├── users/             # Gestion des utilisateurs
│   ├── stores/            # Gestion des magasins
│   ├── products/          # Gestion des produits
│   ├── orders/            # Gestion des commandes
│   ├── reviews/           # Gestion des avis
│   ├── fraud/             # Détection de fraude
│   ├── notifications/     # Système de notifications
│   ├── transactions/      # Gestion des transactions
│   ├── bookings/          # Gestion des réservations
│   ├── banners/           # Gestion des bannières
│   ├── drivers/           # Gestion des chauffeurs
│   ├── promotions/        # Gestion des promotions
│   ├── reels/             # Gestion des reels vidéo
│   ├── support/           # Support client
│   ├── core/              # Configuration Django (settings, urls, wsgi)
│   └── manage.py          # Django CLI
│
├── lib/                   # Utilitaires & Mappers
│   ├── api.ts             # Service API centralisé
│   ├── constants.ts       # Constantes globales
│   ├── helpers.ts         # Fonctions utilitaires
│   ├── utils.ts           # Utilitaires supplémentaires
│   ├── translations.ts    # Fichiers de traduction
│   ├── *-mapper.ts        # Mappers pour transformer les données
│   ├── supabase.ts        # Client Supabase
│   ├── mock-data.ts       # Données de test
│   └── supabase/          # Configuration Supabase
│
├── components/            # Composants React réutilisables
├── contexts/              # Context API (État global)
├── hooks/                 # Custom React Hooks
├── types/                 # Définitions de types TypeScript
├── styles/                # Feuilles de style globales
├── public/                # Actifs statiques
├── scripts/               # Scripts utilitaires
│
├── package.json           # Dépendances npm
├── tsconfig.json          # Configuration TypeScript
├── next.config.mjs        # Configuration Next.js
├── tailwind.config.js     # Configuration Tailwind CSS
├── Dockerfile             # Configuration Docker
├── docker-compose.yml     # Orchestration Docker
└── README.md              # Documentation
```

---

## 🔐 AUTHENTIFICATION & AUTORISATION

### Frontend Authentication Flow
```typescript
// lib/api.ts - Gestion centralisée des requêtes

interface RequestOptions extends RequestInit {
    useAuth?: boolean;
    params?: Record<string, any>;
}

async function apiRequest<T>(
    endpoint: string, 
    options: RequestOptions = {}, 
    isRetry = false
): Promise<T>
```

**Processus**:
1. Stockage du token JWT dans `localStorage`
2. Automatisation du refresh token en cas de 401
3. Gestion des erreurs de validation Django
4. Redirection vers login en cas d'expiration

### Backend Authentication
**Django REST Framework + JWT**

```python
# backend/users/authentication.py
- CustomJWTAuthentication: Authentification personnalisée JWT
- Token refresh automatique
- Permissions basées sur le rôle (Role-Based Access Control)
```

---

## 📊 MODÈLES DE DONNÉES

### 1. **Users** (`backend/users/models.py`)

**Rôles**:
- CLIENT: Utilisateur client
- PRO: Professionnel
- ADMIN: Administrateur

**Statuts**:
- ACTIVE: Actif
- SUSPENDED: Suspendu
- BANNED: Banni
- INACTIVE: Inactif

**Champs**:
```python
id: UUID (Primary Key)
role: TextChoices (CLIENT, PRO, ADMIN)
status: TextChoices
full_name: TextField
phone: TextField
avatar_url: TextField
latitude/longitude: Decimal (Localisation)
city: TextField
address: TextField
email: EmailField (Unique)
used_web: Boolean
used_mobile: Boolean
created_at/updated_at: DateTime
```

### 2. **Stores** (Magasins)

Représente les boutiques/commerces sur la plateforme.

### 3. **Products** (Produits)

Articles vendus par les stores.

**Statuts des produits**:
- VISIBLE: Visible
- HIDDEN: Caché
- FLAGGED: Signalé
- BANNED: Banni

### 4. **Orders** (Commandes)

Gère les commandes des clients.

### 5. **Reviews** (Avis)

Système d'évaluation et d'avis sur les produits/stores.

### 6. **Reports** (Signalements)

**Statuts**:
- PENDING: En attente
- INVESTIGATING: En investigation
- WAITING_RESPONSE: En attente de réponse
- RESOLVED: Résolu
- ESCALATED: Escaladé

**Priorités**:
- LOW, MEDIUM, HIGH, CRITICAL

### 7. **Fraud Detection** (Détection de fraude)

Module spécialisé pour détecter les activités frauduleuses.

### 8. **Transactions**

Gestion des paiements et des transactions financières.

### 9. **Bookings** (Réservations)

Système de réservation pour services.

### 10. **Banners** (Bannières)

Gestion des bannières promotionnelles.

### 11. **Drivers** (Chauffeurs)

Gestion des chauffeurs/livreurs.

### 12. **Promotions** (Promotions)

Codes de réduction et offres spéciales.

### 13. **Reels** (Vidéos)

Contenu vidéo court (similaire TikTok).

### 14. **Support** (Support Client)

Tickets de support client.

### 15. **Notifications**

Système de notifications utilisateur.

---

## 🔧 FICHIERS LIB (UTILITAIRES)

### 1. **lib/api.ts** - Service API Centralisé

```typescript
// Gère toutes les requêtes HTTP vers le backend

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// Fonctions principales:
- apiRequest<T>(endpoint, options, isRetry): Generic fetch wrapper
- tryRefreshToken(): Refresh JWT token automatiquement
- clearAuthAndRedirect(): Déconnexion et redirection
- get<T>(endpoint): GET request
- post<T>(endpoint, data): POST request
- put<T>(endpoint, data): PUT request
- delete(endpoint): DELETE request
- patch<T>(endpoint, data): PATCH request
```

**Gestion des erreurs**:
- Extraction des messages d'erreur Django
- Validation des champs (format Django)
- Retry automatique en cas de 401

### 2. **lib/constants.ts** - Constantes Globales

```typescript
// Navigation
DASHBOARD_NAVIGATION: Array<NavItem>

// Statuts des utilisateurs
USER_STATUSES = ['active', 'inactive', 'suspended', 'banned']

// Statuts des entreprises
BUSINESS_STATUSES = ['pending', 'approved', 'rejected', 'suspended']

// Statuts des produits
PRODUCT_STATUSES = ['visible', 'hidden', 'flagged', 'banned']

// Statuts des signalements
REPORT_STATUSES = ['pending', 'investigating', 'waiting_response', 'resolved', 'escalated']

// Priorités des signalements
REPORT_PRIORITIES = ['low', 'medium', 'high', 'critical']
```

### 3. **lib/helpers.ts** - Fonctions Utilitaires

```typescript
// Fonctions usuelles:
- formatDate(date): Formatage des dates
- formatCurrency(amount): Formatage monétaire
- validateEmail(email): Validation email
- truncateText(text, length): Tronquer du texte
- capitalizeFirstLetter(text): Capitaliser
- formatPhoneNumber(phone): Formatage téléphone
- debounce(fn, delay): Debounce une fonction
- throttle(fn, delay): Throttle une fonction
```

### 4. **lib/utils.ts** - Utilitaires Supplémentaires

```typescript
// Utilitaires:
- cn(...classes): Class merging (avec clsx)
- formatPrice(price): Formatage prix
- getInitials(name): Initiales du nom
- slugify(text): Conversion en slug
- getErrorMessage(error): Extraction message d'erreur
- isValidURL(url): Validation URL
```

### 5. **lib/translations.ts** - Traductions Multilingues

```typescript
// Gère les traductions en plusieurs langues:
- FR (Français)
- EN (English)
- AR (العربية)
- ES (Español)

Structure:
{
  "fr": { ... },
  "en": { ... },
  "ar": { ... },
  "es": { ... }
}
```

### 6. **lib/*-mapper.ts** - Transformateurs de Données

```typescript
// Convertissent les données backend en format frontend

- banner-mapper.ts: Transforme les bannières
- driver-mapper.ts: Transforme les chauffeurs
- item-mapper.ts: Transforme les articles
- order-mapper.ts: Transforme les commandes
- product-mapper.ts: Transforme les produits
- review-mapper.ts: Transforme les avis
- transaction-mapper.ts: Transforme les transactions

Exemple:
export function mapBannerFromAPI(apiData: any): Banner {
  return {
    id: apiData.id,
    title: apiData.title,
    image_url: apiData.image_url,
    active: apiData.is_active,
    // ... autres champs
  }
}
```

### 7. **lib/supabase.ts** - Client Supabase

```typescript
// Configuration et initialisation Supabase

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
)

// Exports:
- supabase: Client instance
- utilisé pour: Real-time, File Storage, Queries directes
```

### 8. **lib/mock-data.ts** - Données de Test

```typescript
// Données fictives pour le développement et les tests

- mockUsers: Utilisateurs de test
- mockProducts: Produits de test
- mockOrders: Commandes de test
- mockReviews: Avis de test
- mockStores: Magasins de test
```

### 9. **lib/mock-moderation-data.ts** - Données Modération Test

```typescript
// Données pour tester le système de modération

- mockReports: Signalements de test
- mockSuspiciousActivities: Activités suspectes
- mockFraudCases: Cas de fraude
```

### 10. **lib/dashboard-data.ts** - Données Tableau de Bord

```typescript
// Données pour le dashboard administrateur

- getDashboardStats(): Statistiques globales
- getUserStats(): Stats utilisateurs
- getRevenueData(): Données revenu
- getActivityChart(): Graphiques activité
```

---

## 🎨 COMPOSANTS REACT (`components/`)

### Composants UI Radix
- `ui/button.tsx`: Bouton réutilisable
- `ui/accordion.tsx`: Accordéon
- `ui/alert-dialog.tsx`: Boîte de dialogue d'alerte
- `ui/avatar.tsx`: Avatar utilisateur
- `ui/badge.tsx`: Badge
- `ui/card.tsx`: Carte
- `ui/checkbox.tsx`: Checkbox
- `ui/dialog.tsx`: Dialogue modal
- `ui/dropdown-menu.tsx`: Menu déroulant
- `ui/input.tsx`: Champ input
- `ui/label.tsx`: Label
- `ui/select.tsx`: Select/Dropdown
- `ui/tabs.tsx`: Onglets
- `ui/toast.tsx`: Notifications toast

### Composants Métier
- `animated-logo.tsx`: Logo animé
- `backend-status.tsx`: Statut du backend
- `calendly-modal.tsx`: Modal Calendly
- `language-selector.tsx`: Sélecteur de langue
- `theme-provider.tsx`: Provider du thème

---

## 🗂️ CONTEXTS (État Global)

### **LanguageContext** (`contexts/language-context.tsx`)

```typescript
interface LanguageContextType {
  language: 'en' | 'fr' | 'ar' | 'es'
  t(key: string): string
  setLanguage(lang: 'en' | 'fr' | 'ar' | 'es'): void
}

// Exports:
- LanguageProvider: Provider pour l'application
- useLanguage(): Hook pour accéder au contexte
```

**Utilisation**:
```typescript
const { language, t, setLanguage } = useLanguage()

// Accès aux traductions
const greeting = t('greeting') // Récupère la traduction
```

---

## 🎣 CUSTOM HOOKS (`hooks/`)

### Hooks Principaux
- `useAuth()`: Gestion authentification
- `useFetch<T>(url)`: Fetch avec gestion erreur
- `useLocalStorage(key)`: Stockage local
- `useDebounce(value, delay)`: Debounce
- `useTheme()`: Thème (dark/light)
- `useMediaQuery(query)`: Media query responsive
- `usePrevious<T>(value)`: Valeur précédente
- `useAsync<T>(fn, deps)`: Gestion async/await

---

## 📝 TYPES TYPESCRIPT (`types/`)

```typescript
// Exemples de types

export interface User {
  id: string
  email: string
  full_name: string
  role: 'CLIENT' | 'PRO' | 'ADMIN'
  status: 'active' | 'suspended' | 'banned' | 'inactive'
  avatar_url?: string
  phone?: string
  city?: string
  address?: string
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  store_id: string
  name: string
  description: string
  price: number
  status: 'visible' | 'hidden' | 'flagged' | 'banned'
  image_url?: string
  category?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  user_id: string
  product_id?: string
  store_id?: string
  rating: number
  comment: string
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  reporter_id: string
  reported_user_id?: string
  reported_product_id?: string
  reason: string
  status: 'pending' | 'investigating' | 'waiting_response' | 'resolved' | 'escalated'
  priority: 'low' | 'medium' | 'high' | 'critical'
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  order_id?: string
  amount: number
  type: 'payment' | 'refund' | 'adjustment'
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface Store {
  id: string
  owner_id: string
  name: string
  description: string
  logo_url?: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  latitude?: number
  longitude?: number
  city?: string
  address?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Banner {
  id: string
  title: string
  description?: string
  image_url: string
  link_url?: string
  is_active: boolean
  position: number
  created_at: string
  updated_at: string
}

export interface Driver {
  id: string
  user_id: string
  phone: string
  vehicle_info: string
  license_number: string
  status: 'available' | 'busy' | 'offline' | 'suspended'
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

export interface Promotion {
  id: string
  code: string
  discount_percentage: number
  min_amount?: number
  max_uses?: number
  expiry_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  service_id: string
  service_provider_id: string
  date_time: string
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Reel {
  id: string
  creator_id: string
  title: string
  description?: string
  video_url: string
  thumbnail_url?: string
  duration: number
  views_count: number
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'waiting_user' | 'closed'
  assigned_to?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  is_read: boolean
  action_url?: string
  created_at: string
  updated_at: string
}
```

---

## 🖥️ PAGES APP (`app/`)

### 1. **app/page.tsx** - Landing Page

**Imports**:
```typescript
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check, Menu, X, Moon, Sun, Star, Zap, Shield, Users, Layers, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { CalendlyModal } from "@/components/calendly-modal"
import { useLanguage } from "@/contexts/language-context"
import { AnimatedLogo } from "@/components/animated-logo"
import { BackendStatus } from "@/components/backend-status"
import { LanguageSelector } from "@/components/language-selector"
```

**Fonctionnalités**:
- Affichage de la page d'accueil
- Gestion du thème (dark/light)
- Changement de langue
- Menu mobile responsive
- Scroll animations avec Framer Motion
- Modal Calendly pour réservations
- Sections: Features, Pricing, FAQs, CTA

### 2. **app/layout.tsx** - Root Layout

**Providers Configurés**:
- ThemeProvider (Next-themes)
- LanguageProvider (Context personnalisé)
- Toaster (Sonner)

**Métadonnées**:
```typescript
title: "talkBridge - AI Agents That Work Like Humans"
description: "AI-powered agents that handle calls, book appointments..."
```

### 3. **app/login/page.tsx** - Page de Connexion

**Fonctionnalités**:
- Formulaire de connexion
- Validation des champs
- Appel API vers `/api/auth/login/`
- Stockage du token JWT
- Redirection vers dashboard

### 4. **app/signup/page.tsx** - Page d'Inscription

**Fonctionnalités**:
- Formulaire d'inscription
- Validation email/password
- Création de compte
- Redirection vers login

### 5. **app/dashboard/...** - Tableau de Bord Admin

**Routes**:
- `/dashboard` - Vue générale
- `/dashboard/users` - Gestion utilisateurs
- `/dashboard/businesses` - Gestion entreprises
- `/dashboard/products` - Gestion produits
- `/dashboard/reviews` - Gestion avis
- `/dashboard/reports` - Gestion signalements
- `/dashboard/map` - Carte interactive
- `/dashboard/analytics` - Analytiques

---

## 🔌 BACKEND DJANGO (`backend/`)

### Architecture Django

```
backend/
├── core/              # Configuration principale
│   ├── settings.py   # Configuration Django
│   ├── urls.py       # Routes principales
│   ├── wsgi.py       # WSGI pour serveur
│   └── asgi.py       # ASGI pour WebSocket
│
├── users/            # App Utilisateurs
│   ├── models.py     # Modèle User
│   ├── views.py      # API Endpoints
│   ├── serializers.py # Sérialisation JSON
│   ├── urls.py       # Routes utilisateurs
│   ├── permissions.py # Permissions
│   └── authentication.py # JWT Auth
│
├── stores/           # App Magasins
├── products/         # App Produits
├── orders/           # App Commandes
├── reviews/          # App Avis
├── fraud/            # App Détection Fraude
├── notifications/    # App Notifications
├── transactions/     # App Transactions
├── bookings/         # App Réservations
├── banners/          # App Bannières
├── drivers/          # App Chauffeurs
├── promotions/       # App Promotions
├── reels/            # App Reels
├── support/          # App Support
│
├── manage.py         # CLI Django
├── Dockerfile        # Config Docker
└── requirements.txt  # Dépendances Python
```

### Modèles Django Principaux

#### **User Model** (`users/models.py`)

```python
class User(models.Model):
    class Role(models.TextChoices):
        CLIENT = 'CLIENT'
        PRO = 'PRO'
        ADMIN = 'ADMIN'

    class Status(models.TextChoices):
        ACTIVE = 'active'
        SUSPENDED = 'suspended'
        BANNED = 'banned'
        INACTIVE = 'inactive'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    role = models.TextField(default=Role.ADMIN)
    status = models.TextField(default=Status.ACTIVE)
    full_name = models.TextField(null=True, blank=True)
    phone = models.TextField(null=True, blank=True)
    avatar_url = models.TextField(null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    city = models.TextField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    email = models.EmailField(unique=True)
    used_web = models.BooleanField(default=False)
    used_mobile = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        managed = False

    @property
    def is_active(self):
        return self.status not in [self.Status.BANNED, self.Status.INACTIVE]

    @property
    def is_staff(self):
        return self.role == self.Role.ADMIN

    @property
    def is_superuser(self):
        return self.role == self.Role.ADMIN
```

### API Endpoints Principaux

#### Authentication
```
POST /api/auth/register/        # Inscription
POST /api/auth/login/           # Connexion
POST /api/auth/logout/          # Déconnexion
POST /api/token/refresh/        # Refresh token
GET  /api/auth/me/              # Infos utilisateur connecté
```

#### Users Management
```
GET    /api/users/              # Lister les utilisateurs
POST   /api/users/              # Créer utilisateur
GET    /api/users/{id}/         # Détails utilisateur
PUT    /api/users/{id}/         # Mettre à jour utilisateur
DELETE /api/users/{id}/         # Supprimer utilisateur
PATCH  /api/users/{id}/suspend/ # Suspendre utilisateur
PATCH  /api/users/{id}/ban/     # Bannir utilisateur
```

#### Stores
```
GET    /api/stores/             # Lister les magasins
POST   /api/stores/             # Créer magasin
GET    /api/stores/{id}/        # Détails magasin
PUT    /api/stores/{id}/        # Mettre à jour magasin
DELETE /api/stores/{id}/        # Supprimer magasin
```

#### Products
```
GET    /api/products/           # Lister les produits
POST   /api/products/           # Créer produit
GET    /api/products/{id}/      # Détails produit
PUT    /api/products/{id}/      # Mettre à jour produit
DELETE /api/products/{id}/      # Supprimer produit
PATCH  /api/products/{id}/flag/ # Signaler produit
```

#### Orders
```
GET    /api/orders/             # Lister les commandes
POST   /api/orders/             # Créer commande
GET    /api/orders/{id}/        # Détails commande
PUT    /api/orders/{id}/        # Mettre à jour commande
PATCH  /api/orders/{id}/cancel/ # Annuler commande
```

#### Reviews
```
GET    /api/reviews/            # Lister les avis
POST   /api/reviews/            # Créer avis
GET    /api/reviews/{id}/       # Détails avis
PUT    /api/reviews/{id}/       # Mettre à jour avis
DELETE /api/reviews/{id}/       # Supprimer avis
```

#### Reports (Signalements)
```
GET    /api/reports/            # Lister les signalements
POST   /api/reports/            # Créer signalement
GET    /api/reports/{id}/       # Détails signalement
PUT    /api/reports/{id}/       # Mettre à jour signalement
PATCH  /api/reports/{id}/investigate/ # Enquêter
PATCH  /api/reports/{id}/resolve/     # Résoudre
```

#### Fraud Detection
```
GET    /api/fraud/checks/       # Lister les vérifications
POST   /api/fraud/analyze/      # Analyser transaction
GET    /api/fraud/suspicious/   # Activités suspectes
PATCH  /api/fraud/{id}/confirm/ # Confirmer fraude
```

#### Transactions
```
GET    /api/transactions/       # Lister transactions
POST   /api/transactions/       # Créer transaction
GET    /api/transactions/{id}/  # Détails transaction
PATCH  /api/transactions/{id}/refund/ # Remboursement
```

#### Bookings
```
GET    /api/bookings/           # Lister réservations
POST   /api/bookings/           # Créer réservation
GET    /api/bookings/{id}/      # Détails réservation
PUT    /api/bookings/{id}/      # Mettre à jour réservation
PATCH  /api/bookings/{id}/cancel/ # Annuler réservation
PATCH  /api/bookings/{id}/confirm/ # Confirmer réservation
```

#### Banners
```
GET    /api/banners/            # Lister bannières
POST   /api/banners/            # Créer bannière
GET    /api/banners/{id}/       # Détails bannière
PUT    /api/banners/{id}/       # Mettre à jour bannière
DELETE /api/banners/{id}/       # Supprimer bannière
```

#### Drivers
```
GET    /api/drivers/            # Lister chauffeurs
POST   /api/drivers/            # Créer chauffeur
GET    /api/drivers/{id}/       # Détails chauffeur
PUT    /api/drivers/{id}/       # Mettre à jour chauffeur
PATCH  /api/drivers/{id}/status/ # Changer statut
```

#### Promotions
```
GET    /api/promotions/         # Lister promotions
POST   /api/promotions/         # Créer promotion
GET    /api/promotions/{id}/    # Détails promotion
PUT    /api/promotions/{id}/    # Mettre à jour promotion
DELETE /api/promotions/{id}/    # Supprimer promotion
GET    /api/promotions/validate/{code}/ # Valider code
```

#### Reels
```
GET    /api/reels/              # Lister reels
POST   /api/reels/              # Créer reel
GET    /api/reels/{id}/         # Détails reel
PUT    /api/reels/{id}/         # Mettre à jour reel
DELETE /api/reels/{id}/         # Supprimer reel
POST   /api/reels/{id}/like/    # Liker reel
POST   /api/reels/{id}/comment/ # Commenter reel
```

#### Support
```
GET    /api/support/tickets/    # Lister tickets
POST   /api/support/tickets/    # Créer ticket
GET    /api/support/tickets/{id}/ # Détails ticket
PUT    /api/support/tickets/{id}/ # Mettre à jour ticket
POST   /api/support/tickets/{id}/comment/ # Ajouter commentaire
```

#### Notifications
```
GET    /api/notifications/      # Lister notifications
POST   /api/notifications/      # Créer notification
PATCH  /api/notifications/{id}/read/ # Marquer comme lu
DELETE /api/notifications/{id}/ # Supprimer notification
```

---

## 🔒 SÉCURITÉ

### Authentification
- JWT (JSON Web Tokens)
- Token refresh automatique
- Stockage localStorage (considérer httpOnly cookies)
- CORS configuré pour API

### Permissions (Django)
- Role-Based Access Control (RBAC)
- Rôles: CLIENT, PRO, ADMIN
- Custom permission classes
- IsAuthenticated, IsAdmin, etc.

### Validation
- Validation frontend Zod
- Validation backend Django
- Extraction d'erreurs structurées

### Protection Fraude
- Module dedicated fraud detection
- Monitoring transactions
- Flagging suspicious activities
- Reports & escalation

---

## 🚀 DÉPLOIEMENT

### Docker
```dockerfile
# Frontend (Next.js)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```dockerfile
# Backend (Django)
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "core.wsgi"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://...
      - DJANGO_SETTINGS_MODULE=core.settings
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=saas_db

volumes:
  postgres_data:
```

---

## 📊 BASE DE DONNÉES

### Tables Principales
- `users` - Utilisateurs
- `stores` - Magasins
- `products` - Produits
- `orders` - Commandes
- `order_items` - Articles commandes
- `reviews` - Avis
- `reports` - Signalements
- `transactions` - Transactions
- `bookings` - Réservations
- `banners` - Bannières
- `drivers` - Chauffeurs
- `promotions` - Promotions
- `reels` - Vidéos
- `support_tickets` - Tickets support
- `notifications` - Notifications
- `fraud_checks` - Vérifications fraude

### Relations
- User → Orders (1:N)
- User → Reviews (1:N)
- User → Stores (1:N)
- Store → Products (1:N)
- Product → Reviews (1:N)
- Product → OrderItems (1:N)
- Order → OrderItems (1:N)
- Order → Transactions (1:N)

---

## 🔄 FLUX DE DONNÉES

### Exemple: Achat d'un Produit

```
1. Frontend: Utilisateur clique "Ajouter au panier"
   ↓
2. Frontend: Appel API POST /api/orders/
   { items: [{ product_id, quantity }] }
   ↓
3. Backend: Validation & création Order
   - Vérifier stock produit
   - Vérifier utilisateur
   - Créer Order + OrderItems
   ↓
4. Backend: Retourner Order créée
   ↓
5. Frontend: Afficher confirmation
   ↓
6. Frontend: Redirection vers paiement
   ↓
7. Frontend: Appel API POST /api/transactions/
   { order_id, amount, payment_method }
   ↓
8. Backend: Créer Transaction
   - Effectuer paiement
   - Mettre à jour Order status
   - Envoyer notifications
   ↓
9. Backend: Retourner Transaction
   ↓
10. Frontend: Afficher reçu
```

---

## 📝 RÉSUMÉ FICHIERS CLÉ

| Fichier | Type | Rôle |
|---------|------|------|
| `lib/api.ts` | TS | Service API centralisé |
| `lib/constants.ts` | TS | Constantes globales |
| `lib/helpers.ts` | TS | Fonctions utilitaires |
| `lib/translations.ts` | TS | Traductions multilingues |
| `app/page.tsx` | TSX | Landing page |
| `app/layout.tsx` | TSX | Root layout |
| `contexts/language-context.tsx` | TSX | État langue |
| `backend/users/models.py` | PY | Modèle User Django |
| `backend/users/views.py` | PY | API endpoints users |
| `backend/users/serializers.py` | PY | Sérialisation JSON |
| `package.json` | JSON | Dépendances npm |
| `tsconfig.json` | JSON | Config TypeScript |
| `Dockerfile` | - | Image Docker frontend |
| `docker-compose.yml` | YAML | Orchestration services |

---

## 🎯 POINTS IMPORTANTS

1. **Architecture**: Next.js 14 + Django REST + PostgreSQL
2. **Auth**: JWT avec refresh automatique
3. **Multilingues**: Support 4 langues (FR, EN, AR, ES)
4. **Responsive**: Design mobile-first avec Tailwind
5. **UI**: Composants Radix avec animations Framer Motion
6. **Sécurité**: RBAC, validation, protection fraude
7. **Scalabilité**: Docker, microservices ready
8. **DX**: TypeScript, Zod validation, error handling

---

## 📚 RESSOURCES UTILES

- **Next.js Docs**: https://nextjs.org/docs
- **Django REST**: https://www.django-rest-framework.org
- **Radix UI**: https://www.radix-ui.com
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript**: https://www.typescriptlang.org
- **Supabase**: https://supabase.com

---

**Document généré**: 2026-06-07
**Version Projet**: 0.1.0
**Auteur**: Analyse Automatique
