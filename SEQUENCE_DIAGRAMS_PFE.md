# 📋 Diagrammes de Séquence - Rapport PFE
## Plateforme SaaS Multi-Services (E-Commerce & Booking)

---

## 📌 Introduction
Les diagrammes de séquence suivants illustrent les **flux métier principaux** de la plateforme. Chaque diagramme montre l'interaction entre les acteurs, le frontend Next.js, et le backend Django pour un processus spécifique.

---

## 🎯 Diagrammes de Séquence Recommandés

### **Domaine 1: Authentification et Gestion d'Accès**

#### 1️⃣ **DS-AUTH-001: Flux d'Authentification Utilisateur avec Supabase**
- **Acteurs**: Utilisateur, Frontend, Supabase Auth, Backend Django
- **Processus**:
  1. Utilisateur saisit email/password
  2. Frontend envoie credentials à Supabase
  3. Supabase valide et retourne JWT token
  4. Frontend stocke token et appelle Backend
  5. Backend valide token et retourne user profile
  6. Frontend redirection vers dashboard
- **Objectif pédagogique**: Montrer l'intégration externe d'authentification

#### 2️⃣ **DS-AUTH-002: Flux d'Inscription et Création de Profil Commerçant**
- **Acteurs**: Nouveau Commerçant, Frontend, Supabase, Backend, Database
- **Processus**:
  1. Commerçant remplit formulaire d'inscription
  2. Frontend validation côté client
  3. Envoie à Supabase pour création du compte
  4. Supabase crée l'auth user
  5. Backend crée user_profile et store_profile
  6. Database persiste les données
  7. Email de confirmation envoyé
- **Objectif pédagogique**: Montrer la création multi-entités

#### 3️⃣ **DS-AUTH-003: Flux de Vérification d'Identité Commerçant (KYC)**
- **Acteurs**: Commerçant, Frontend, Backend, Service de Vérification (externe), Database
- **Processus**:
  1. Commerçant soumet documents (photo, ID)
  2. Backend stocke temporairement
  3. Backend appelle service de vérification
  4. Vérification retourne statut (approved/rejected/pending)
  5. Database met à jour verification_status
  6. Frontend affiche résultat
  7. Si approuvé, débloquer fonctionnalités de vente
- **Objectif pédagogique**: Processus de validation multi-étapes

---

### **Domaine 2: Gestion de Produits et Catalogue**

#### 4️⃣ **DS-CATALOG-001: Flux de Création et Publication d'un Produit**
- **Acteurs**: Commerçant, Frontend, Backend, Media Service, Database, Search Index
- **Processus**:
  1. Commerçant remplit formulaire produit (nom, desc, prix, images)
  2. Frontend valide données
  3. Backend reçoit et valide
  4. Images uploadées au service media
  5. Backend crée product record
  6. Backend crée item records (variantes)
  7. Search index (Elasticsearch/Algolia) mis à jour
  8. Database persiste
  9. Frontend affiche confirmation
- **Objectif pédagogique**: Flux de création multi-services

#### 5️⃣ **DS-CATALOG-002: Flux de Recherche et Filtrage de Produits**
- **Acteurs**: Client, Frontend, Search Service, Backend, Cache, Database
- **Processus**:
  1. Client entre critères de recherche
  2. Frontend envoie requête avec filtres
  3. Backend interroge Search Service (cache d'abord)
  4. Search Service retourne résultats classés
  5. Backend enrichit avec données additionnelles
  6. Frontend pagine et affiche résultats
  7. Client clique sur un produit → détail produit
  8. Backend charge critères spécifiques
- **Objectif pédagogique**: Optimisation de recherche et cache

#### 6️⃣ **DS-CATALOG-003: Flux de Gestion d'Inventaire et Stock**
- **Acteurs**: Commerçant, Frontend, Backend, Database, Notification Service
- **Processus**:
  1. Commerçant consulte dashboard inventory
  2. Frontend récupère stock current
  3. Backend requête database pour stock
  4. Affichage items avec quantités
  5. Commerçant met à jour stock
  6. Backend valide et met à jour DB
  7. Si stock < seuil minimum → notification
  8. Si stock = 0 → item devient unavailable
- **Objectif pédagogique**: Gestion d'état et notifications

---

### **Domaine 3: Processus de Commande E-Commerce**

#### 7️⃣ **DS-ORDER-001: Flux Complet d'une Commande Client (Happy Path)**
- **Acteurs**: Client, Frontend, Backend, Payment Gateway, Inventory, Database, Notification
- **Processus**:
  1. Client ajoute items au panier (cart local)
  2. Client finalise panier → checkout
  3. Frontend envoie order request
  4. Backend valide items et stock (lock optimiste)
  5. Backend crée order record (statut: pending)
  6. Redirige vers Payment Gateway
  7. Client effectue paiement
  8. Payment Gateway retourne confirmation
  9. Backend met à jour order statut: confirmed
  10. Backend décrémente inventory
  11. Backend décrémente seller balance
  12. Notifications envoyées (client + seller)
  13. Frontend affiche confirmation
- **Objectif pédagogique**: Processus multi-étapes critique

#### 8️⃣ **DS-ORDER-002: Flux de Gestion des Cas d'Erreur Paiement**
- **Acteurs**: Client, Frontend, Backend, Payment Gateway, Database, Support
- **Processus**:
  1. Client effectue paiement
  2. Paiement échoue (carte refusée/timeout)
  3. Payment Gateway retourne erreur
  4. Backend marque order comme failed
  5. Frontend affiche message d'erreur
  6. Stock released (déverrouillé)
  7. Client peut relancer ou modifier paiement
  8. Si 3 tentatives échouées → auto-cancel
- **Objectif pédagogique**: Gestion d'erreurs et rollback

#### 9️⃣ **DS-ORDER-003: Flux d'Annulation de Commande (Client Initié)**
- **Acteurs**: Client, Frontend, Backend, Seller, Payment Service, Database, Notification
- **Processus**:
  1. Client demande annulation (avant expédition)
  2. Frontend envoie cancel request
  3. Backend vérifie statut (must be: pending/confirmed)
  4. Backend initie remboursement via Payment Service
  5. Remboursement processed
  6. Backend met à jour order status: cancelled
  7. Inventory restauré
  8. Seller balance restituée
  9. Notifications envoyées à client et seller
  10. Frontend confirme annulation
- **Objectif pédagogique**: Transactions et compensation

#### 🔟 **DS-ORDER-004: Flux de Suivi de Commande en Temps Réel**
- **Acteurs**: Client, Frontend, Backend, Supabase Realtime, Database, Seller, Driver
- **Processus**:
  1. Client accède à order tracking
  2. Frontend établit websocket connection avec Supabase Realtime
  3. Backend subscribe à order updates
  4. Seller marque order comme "shipped"
  5. Supabase broadcast l'update
  6. Frontend reçoit et affiche "shipped"
  7. Driver accepte livraison
  8. Frontend update à "in_transit"
  9. Driver confirme livraison
  10. Frontend affiche "delivered"
- **Objectif pédagogique**: Websockets et real-time updates

---

### **Domaine 4: Système de Paiement et Finances**

#### 1️⃣1️⃣ **DS-PAYMENT-001: Flux de Traitement de Paiement Sécurisé**
- **Acteurs**: Client, Frontend, Backend, Stripe/PayPal, PSP, Bank, Database
- **Processus**:
  1. Client saisit infos carte (frontend)
  2. Frontend tokenize via Stripe
  3. Frontend envoie token au Backend
  4. Backend valide token côté serveur
  5. Backend envoie charge à Stripe
  6. Stripe forward à PSP et Bank
  7. Bank retourne autorisation
  8. Stripe confirme au Backend
  9. Backend persiste transaction record
  10. Database enregistre (encrypted)
- **Objectif pédagogique**: Sécurité et PCI-DSS compliance

#### 1️⃣2️⃣ **DS-PAYMENT-002: Flux de Paiement Récurrent (Abonnement)**
- **Acteurs**: Client, Frontend, Backend, Payment Gateway, Subscription Manager, Database
- **Processus**:
  1. Client choisit plan subscription
  2. Frontend crée subscription order
  3. Backend appelle Payment Gateway
  4. Payment Gateway crée customer + subscription
  5. Retourne subscription_id
  6. Backend persiste subscription record
  7. Chaque mois: Payment Gateway auto-charge
  8. Backend webhook reçoit charge confirmation
  9. Backend met à jour subscription status
  10. Si failure: retry avec backoff exponentiel
- **Objectif pédagogique**: Systèmes récurrents et webhooks

#### 1️⃣3️⃣ **DS-PAYMENT-003: Flux de Règlement aux Vendeurs (Seller Payout)**
- **Acteurs**: Admin, Backend Scheduler, Database, Payment Gateway, Seller Bank, Seller
- **Processus**:
  1. Cron job déclenché quotidiennement
  2. Backend requête orders complétés non payés
  3. Calcul earnings par seller (net des frais)
  4. Vérification seuil minimum payout
  5. Crée payout record (status: pending)
  6. Backend appelle Payment Gateway
  7. Initie transfer vers seller bank account
  8. Transfer processed
  9. Backend met à jour payout status: completed
  10. Seller notification envoyée
- **Objectif pédagogique**: Processus batch et async

#### 1️⃣4️⃣ **DS-PAYMENT-004: Flux de Calcul de Commissions et Taxes**
- **Acteurs**: Client, Seller, Backend, Tax Engine, Database
- **Processus**:
  1. Order total calculated (items subtotal)
  2. Backend appelle Tax Engine
  3. Tax Engine retourne tax par jurisdiction
  4. Backend calcule commission plateforme (%)
  5. Backend calcule frais paiement
  6. Total final = subtotal + tax + frais - discount
  7. Seller net = total - commission - refund
  8. Affiche breakdown au client
  9. Persiste dans transaction record
- **Objectif pédagogique**: Calculs complexes et règles métier

---

### **Domaine 5: Booking et Services**

#### 1️⃣5️⃣ **DS-BOOKING-001: Flux de Réservation Service avec Calendly**
- **Acteurs**: Client, Frontend, Backend, Calendly Widget, Calendly API, Seller Calendar
- **Processus**:
  1. Client consulte service details
  2. Client clique "Book service"
  3. Frontend affiche Calendly widget
  4. Calendly affiche disponibilités du seller
  5. Client sélectionne slot horaire
  6. Calendly retourne event_id
  7. Frontend envoie booking request au Backend
  8. Backend crée booking record
  9. Backend appelle Calendly API pour create event
  10. Calendar event créé avec client infos
  11. Notifications envoyées (seller + client)
  12. Frontend affiche confirmation
- **Objectif pédagogique**: Intégration tierce (Calendly)

#### 1️⃣6️⃣ **DS-BOOKING-002: Flux de Modification/Annulation de Réservation**
- **Acteurs**: Client, Frontend, Backend, Calendly API, Database, Notification
- **Processus**:
  1. Client demande modification (date/heure)
  2. Frontend envoie update request
  3. Backend vérifie statut (not completed/not cancelled)
  4. Backend appelle Calendly API pour update event
  5. Calendly met à jour calendar
  6. Backend met à jour booking record
  7. Notifications envoyées
  8. Si annulation: Backend delete Calendly event
- **Objectif pédagogique**: Synchronisation avec service externe

---

### **Domaine 6: Livraison et Logistique**

#### 1️⃣7️⃣ **DS-DELIVERY-001: Flux d'Assignment de Livraison à un Driver**
- **Acteurs**: Admin/System, Backend Matching Engine, Driver, Order, Database, Notification, Maps
- **Processus**:
  1. Order créé avec statut "ready_for_delivery"
  2. Backend déclenche matching algorithm
  3. Maps API fournit distance du driver
  4. Matching engine score drivers (distance, rating, capacity)
  5. Backend sélectionne best driver
  6. Envoie delivery request au driver
  7. Driver accepte/refuse (timeout 5 min)
  8. Si accepté: Update order status à "assigned"
  9. Si refusé: Try next driver
  10. Si no driver: Escalade à admin
- **Objectif pédagogique**: Algorithme matching et optimisation

#### 1️⃣8️⃣ **DS-DELIVERY-002: Flux de Suivi de Livraison avec Géolocalisation**
- **Acteurs**: Driver (Mobile), Backend, Maps Service, Client (Frontend), Database, Realtime
- **Processus**:
  1. Driver commence livraison (app mobile)
  2. Mobile app envoie location toutes les 30s
  3. Backend reçoit et valide coordinates
  4. Backend update delivery record
  5. Supabase Realtime broadcast location
  6. Client Frontend reçoit et affiche sur carte
  7. Client voit ETA updated
  8. Driver arrive à destination
  9. Driver scanne/confirme livraison
  10. Frontend notifie client "arrived"
  11. Client confirme réception
  12. Livraison marquée complete
- **Objectif pédagogique**: Localisation et real-time tracking

#### 1️⃣9️⃣ **DS-DELIVERY-003: Flux de Gestion des Litiges de Livraison**
- **Acteurs**: Client, Driver, Frontend, Backend, Support Team, Database
- **Processus**:
  1. Client signale "item damaged" ou "not received"
  2. Frontend crée support ticket
  3. Backend crée dispute record
  4. Notification envoyée à driver
  5. Support team notifiée
  6. Driver peut répondre avec photos
  7. Client peut fournir preuves
  8. Support team juge et décide
  9. Si favor client: Initie refund
  10. Si favor driver: Clôture dispute
- **Objectif pédagogique**: Gestion de conflits et arbitrage

---

### **Domaine 7: Détection de Fraude et Sécurité**

#### 2️⃣0️⃣ **DS-FRAUD-001: Flux de Détection de Fraude en Temps Réel**
- **Acteurs**: Client, Frontend, Backend, Fraud Detection Engine, Database, Decision Manager
- **Processus**:
  1. Client crée order
  2. Backend reçoit order request
  3. Backend enrichit avec context data (history, IP, device)
  4. Envoie à Fraud Detection Engine
  5. Engine applique règles (velocity, géographie, montant)
  6. Engine retourne risk_score (0-100)
  7. Si score > 80: Flag pour review
  8. Si 50 < score < 80: Require 2FA
  9. Si score < 50: Allow
  10. Database log decision
  11. Frontend affiche action appropriée
- **Objectif pédagogique**: ML/rules-based detection

#### 2️⃣1️⃣ **DS-FRAUD-002: Flux de Gestion d'une Alerte Fraude**
- **Acteurs**: Fraud Analyst, Backend, Database, Client, Payment Gateway
- **Processus**:
  1. Alerte fraude créée (auto ou manual)
  2. Dashboard notifie analyst
  3. Analyst consulte détails et historique
  4. Analyst détermine: legitimate ou fraud
  5. Si fraud: Analyst clôture account
  6. Backend revoke tous les tokens
  7. Backend gèle transactions
  8. Si refund needed: Process refund
  9. Client notification sent
  10. Incident logged pour audit
- **Objectif pédagogique**: Incident response workflow

---

### **Domaine 8: Avis et Évaluations**

#### 2️⃣2️⃣ **DS-REVIEW-001: Flux de Publication et Modération d'un Avis**
- **Acteurs**: Client, Frontend, Backend, Moderation Engine, Database, Seller
- **Processus**:
  1. Client order livré et complété
  2. Client peut laisser review (avis + rating)
  3. Frontend envoie review request
  4. Backend valide eligibility (order completed)
  5. Backend crée review record (status: pending)
  6. Backend envoie à Moderation Engine
  7. Engine analyse: spam, offensive, relevance
  8. Si OK: status changed to approved
  9. Si problème: status changed to flagged
  10. Human reviewer examine si flagged
  11. Modérateur approuve/rejette
  12. Frontend affiche review (si approved)
  13. Seller notification reçue
- **Objectif pédagogique**: Pipeline de modération

#### 2️⃣3️⃣ **DS-REVIEW-002: Flux de Réponse du Vendeur à un Avis**
- **Acteurs**: Client (Reviewer), Seller, Frontend, Backend, Database
- **Processus**:
  1. Seller consulte reviews dashboard
  2. Seller lit review client
  3. Seller soumet réponse
  4. Frontend envoie seller_response au Backend
  5. Backend valide et persiste
  6. Frontend affiche response sous review
  7. Client notification sent
  8. Both can edit pour 7 jours
  9. Après 7 jours: locked pour edit
- **Objectif pédagogique**: Bi-directional messaging

---

### **Domaine 9: Marketing et Promotions**

#### 2️⃣4️⃣ **DS-PROMO-001: Flux de Création et Application d'une Promotion**
- **Acteurs**: Seller/Admin, Frontend, Backend, Database, Cache, Checkout
- **Processus**:
  1. Seller crée promotion (code, discount %, dates)
  2. Frontend valide et envoie au Backend
  3. Backend persiste promotion record
  4. Backend invalide cache de promotions
  5. Client utilise code au checkout
  6. Frontend envoie code à Backend
  7. Backend valide: active + applicable + usage count
  8. Backend calcule discount
  9. Si coupon limité: décrémente usage count
  10. Ordre total recalculé
  11. Frontend affiche discount appliqué
- **Objectif pédagogique**: Règles métier conditionnelles

#### 2️⃣5️⃣ **DS-PROMO-002: Flux de Gestion de Banners Publicitaires**
- **Acteurs**: Admin, Frontend, Backend, Media Service, Cache, Database
- **Processus**:
  1. Admin crée banner (image, text, link, dates)
  2. Frontend envoie au Backend
  3. Image uploadée au Media Service
  4. Backend crée banner record (status: draft)
  5. Admin preview et approuve
  6. Backend change status à: active
  7. Cache invalidée
  8. Frontend requête banners actives (cached)
  9. Banners affichées sur homepage
  10. Click tracking via analytics
- **Objectif pédagogique**: Cycle publication et caching

---

### **Domaine 10: Support Client**

#### 2️⃣6️⃣ **DS-SUPPORT-001: Flux de Création et Traitement d'un Ticket Support**
- **Acteurs**: Client, Frontend, Backend, Support Agent, Database, Email Service
- **Processus**:
  1. Client ouvre contact form
  2. Frontend valide données
  3. Backend crée support ticket
  4. Ticket assigné à queue (level 1)
  5. Support agent notifié
  6. Agent consulte ticket details
  7. Agent saisit réponse
  8. Backend persiste réponse
  9. Email notification envoyée au client
  10. Client peut répondre (bump ticket)
  11. Conversation continues jusqu'à résolution
  12. Agent clôture ticket
- **Objectif pédagogique**: System de ticketing

---

### **Domaine 11: Dashboards et Analytics**

#### 2️⃣7️⃣ **DS-ANALYTICS-001: Flux de Génération du Dashboard Vendeur**
- **Acteurs**: Seller, Frontend, Backend, Analytics Engine, Cache, Database
- **Processus**:
  1. Seller accède au dashboard
  2. Frontend requête dashboard data
  3. Backend récupère from cache (ou compute)
  4. Metrics calculées: revenue, orders, items sold
  5. Analytics Engine agrège raw data
  6. Retourne KPIs (total, today, this week, this month)
  7. Charts data pré-calculée (cached)
  8. Frontend affiche graphs et metrics
  9. Seller peut filter par période
  10. Backend re-calcule si filtre changé
- **Objectif pédagogique**: Aggregation et caching

#### 2️⃣8️⃣ **DS-ANALYTICS-002: Flux de Rapports Générés et Export**
- **Acteurs**: Seller/Admin, Frontend, Backend, Report Engine, Storage Service, Email
- **Processus**:
  1. Seller demande rapport (ex: monthly sales)
  2. Frontend envoie report request
  3. Backend valide permissions
  4. Backend déclenche Report Job (async)
  5. Job requête huge dataset
  6. Report Engine agrège et formate (PDF/CSV)
  7. Storage Service persiste rapport
  8. Notification email avec link
  9. Seller peut download rapport
  10. Report cached pour 24h
- **Objectif pédagogique**: Async jobs et background processing

---

### **Domaine 12: Intégrations Externes**

#### 2️⃣9️⃣ **DS-INTEGRATION-001: Flux d'Intégration avec Supabase Realtime**
- **Acteurs**: Client (Multiple), Frontend, Backend, Supabase Realtime, Database, Channel
- **Processus**:
  1. Multiple clients accèdent même resource (ex: store page)
  2. Frontend subscribe à Supabase channel
  3. Backend subscribe pour DB changes
  4. Seller met à jour inventory
  5. DB trigger notifie Supabase
  6. Supabase broadcast à toutes les connections
  7. Tous les Frontends reçoivent update (real-time)
  8. Frontend re-renders avec nouveau stock
  9. Clients voient updated stock instantly
- **Objectif pédagogique**: Pub/Sub et real-time collaboration

#### 3️⃣0️⃣ **DS-INTEGRATION-002: Flux d'Intégration avec Service de Mapping (Mapbox)**
- **Acteurs**: App (Frontend/Backend), Mapbox API, Location Service, Database
- **Processus**:
  1. App requête nearby drivers/stores
  2. Backend requête Mapbox Distance Matrix
  3. Mapbox retourne distances/durations
  4. Backend calcule ETA
  5. Backend filtre par distance threshold
  6. Résultats retournés au Frontend
  7. Frontend affiche sur carte (Mapbox GL)
  8. User peut interagir avec carte
- **Objectif pédagogique**: Appels à APIs externes

---

## 📊 Tableau de Synthèse des Diagrammes

| # | Code | Nom | Domaine | Acteurs | Complexité | Durée (min) |
|---|------|-----|---------|---------|-----------|------------|
| 1 | DS-AUTH-001 | Authentification Utilisateur | Auth | 4 | ⭐⭐⭐ | 5-10 |
| 2 | DS-AUTH-002 | Inscription Commerçant | Auth | 4 | ⭐⭐⭐⭐ | 8-15 |
| 3 | DS-AUTH-003 | Vérification KYC | Auth | 4 | ⭐⭐⭐⭐⭐ | 10-15 |
| 4 | DS-CATALOG-001 | Création Produit | Catalog | 5 | ⭐⭐⭐⭐ | 8-12 |
| 5 | DS-CATALOG-002 | Recherche Produits | Catalog | 4 | ⭐⭐⭐ | 5-10 |
| 6 | DS-CATALOG-003 | Gestion Stock | Catalog | 4 | ⭐⭐⭐ | 5-10 |
| 7 | DS-ORDER-001 | Commande Complète | Order | 5 | ⭐⭐⭐⭐⭐ | 12-20 |
| 8 | DS-ORDER-002 | Erreur Paiement | Order | 4 | ⭐⭐⭐⭐ | 8-12 |
| 9 | DS-ORDER-003 | Annulation Commande | Order | 5 | ⭐⭐⭐⭐ | 10-15 |
| 10 | DS-ORDER-004 | Suivi Temps Réel | Order | 5 | ⭐⭐⭐⭐ | 8-12 |
| 11 | DS-PAYMENT-001 | Paiement Sécurisé | Payment | 5 | ⭐⭐⭐⭐⭐ | 10-15 |
| 12 | DS-PAYMENT-002 | Paiement Récurrent | Payment | 5 | ⭐⭐⭐⭐ | 8-12 |
| 13 | DS-PAYMENT-003 | Payout Vendeur | Payment | 4 | ⭐⭐⭐⭐ | 8-12 |
| 14 | DS-PAYMENT-004 | Calcul Commissions | Payment | 4 | ⭐⭐⭐⭐ | 8-10 |
| 15 | DS-BOOKING-001 | Réservation Calendly | Booking | 5 | ⭐⭐⭐⭐ | 8-12 |
| 16 | DS-BOOKING-002 | Modification Réservation | Booking | 4 | ⭐⭐⭐ | 6-10 |
| 17 | DS-DELIVERY-001 | Assignment Driver | Delivery | 5 | ⭐⭐⭐⭐ | 8-12 |
| 18 | DS-DELIVERY-002 | Suivi Géolocalisation | Delivery | 5 | ⭐⭐⭐⭐⭐ | 10-15 |
| 19 | DS-DELIVERY-003 | Gestion Litiges | Delivery | 4 | ⭐⭐⭐⭐ | 8-12 |
| 20 | DS-FRAUD-001 | Détection Fraude | Fraud | 4 | ⭐⭐⭐⭐⭐ | 10-15 |
| 21 | DS-FRAUD-002 | Gestion Alerte | Fraud | 4 | ⭐⭐⭐⭐ | 8-12 |
| 22 | DS-REVIEW-001 | Publication Avis | Review | 4 | ⭐⭐⭐ | 6-10 |
| 23 | DS-REVIEW-002 | Réponse Vendeur | Review | 3 | ⭐⭐⭐ | 5-8 |
| 24 | DS-PROMO-001 | Création Promotion | Marketing | 4 | ⭐⭐⭐ | 6-10 |
| 25 | DS-PROMO-002 | Gestion Banners | Marketing | 4 | ⭐⭐⭐⭐ | 8-12 |
| 26 | DS-SUPPORT-001 | Ticket Support | Support | 4 | ⭐⭐⭐ | 6-10 |
| 27 | DS-ANALYTICS-001 | Dashboard Vendeur | Analytics | 4 | ⭐⭐⭐⭐ | 8-12 |
| 28 | DS-ANALYTICS-002 | Rapports Export | Analytics | 4 | ⭐⭐⭐⭐⭐ | 10-15 |
| 29 | DS-INTEGRATION-001 | Realtime Supabase | Integration | 4 | ⭐⭐⭐⭐ | 8-12 |
| 30 | DS-INTEGRATION-002 | Mapping Mapbox | Integration | 3 | ⭐⭐⭐ | 5-10 |

---

## 🎓 Recommandations pour le Rapport PFE

### **Diagrammes à Inclure Obligatoirement (Core Workflows)**
1. **DS-AUTH-001** ✅ - Fondation du système
2. **DS-ORDER-001** ✅ - Processus métier principal
3. **DS-PAYMENT-001** ✅ - Opération critique
4. **DS-DELIVERY-002** ✅ - Fonctionnalité clé
5. **DS-FRAUD-001** ✅ - Sécurité

### **Diagrammes à Inclure pour Profondeur (Advanced Features)**
- DS-BOOKING-001 (Intégration externe)
- DS-ANALYTICS-001 (Complexité du système)
- DS-INTEGRATION-001 (Real-time)

### **Structure Recommandée du Rapport**

```
4. ARCHITECTURE DU SYSTÈME
   4.1 Diagramme d'Architecture Générale
   4.2 Flux de Données Globaux

5. FONCTIONNALITÉS PRINCIPALES
   5.1 Authentification et Sécurité (DS-AUTH-001)
   5.2 Gestion de Commandes (DS-ORDER-001, DS-ORDER-002)
   5.3 Système de Paiement (DS-PAYMENT-001, DS-PAYMENT-003)
   5.4 Livraison et Tracking (DS-DELIVERY-001, DS-DELIVERY-002)
   5.5 Détection de Fraude (DS-FRAUD-001)

6. FONCTIONNALITÉS AVANCÉES
   6.1 Booking de Services (DS-BOOKING-001)
   6.2 Système d'Avis (DS-REVIEW-001)
   6.3 Real-time Updates (DS-INTEGRATION-001)

7. ANALYTICS ET REPORTING
   7.1 Dashboards (DS-ANALYTICS-001)
   7.2 Génération de Rapports (DS-ANALYTICS-002)
```

---

## 📝 Format de Présentation des Diagrammes

Pour chaque diagramme inclus, utiliser le format:

```markdown
### Diagramme: [CODE] - [NOM]

**Objectif Pédagogique**: [Description courte du concept]

**Acteurs Impliqués**:
- [Acteur 1]
- [Acteur 2]
- ...

**Flux Principal**:
1. [Action 1]
2. [Action 2]
...

**Cas d'Erreur Gérés**: (si applicable)
- [Cas 1]
- [Cas 2]

**Technologies Utilisées**:
- [Tech 1]
- [Tech 2]

[INSÉRER DIAGRAMME MERMAID]
```

---

## 🔗 Ressources Complémentaires

- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Architecture détaillée
- [SCHEMA_REFERENCE.md](SCHEMA_REFERENCE.md) - Modèle de données
- [DATABASE_SCHEMA_REFERENCE.md](DATABASE_SCHEMA_REFERENCE.md) - Détails DB

---

**Créé le**: 15 Mai 2026  
**Pour**: Rapport PFE - Plateforme SaaS Multi-Services  
**Version**: 1.0
