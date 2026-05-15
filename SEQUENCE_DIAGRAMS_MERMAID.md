# 📊 Diagrammes de Séquence - Exemples Mermaid
## Pour Intégration Directe dans le Rapport PFE

---

## 🔐 Domaine 1: Authentification

### DS-AUTH-001: Flux d'Authentification Utilisateur avec Supabase

```mermaid
sequenceDiagram
    participant User as Utilisateur
    participant Frontend as Frontend Next.js
    participant Supabase as Supabase Auth
    participant Backend as Backend Django
    participant DB as Database

    User->>Frontend: 1. Saisit email/password
    Frontend->>Frontend: 2. Valide format
    Frontend->>Supabase: 3. signInWithPassword(email, pwd)
    
    alt Credentials valides
        Supabase->>Supabase: 4. Hash password + verify
        Supabase->>Frontend: 5. Retourne JWT token
        Frontend->>Frontend: 6. Stocke token (localStorage)
        Frontend->>Backend: 7. GET /api/users/me (avec token)
        Backend->>Backend: 8. Valide JWT
        Backend->>DB: 9. Récupère user profile
        DB->>Backend: 10. User data
        Backend->>Frontend: 11. Retourne profile
        Frontend->>Frontend: 12. Stocke user context
        Frontend->>User: 13. Redirection vers /dashboard
    else Credentials invalides
        Supabase->>Frontend: Erreur: Invalid credentials
        Frontend->>User: Affiche message d'erreur
    end
```

### DS-AUTH-002: Inscription Commerçant Multi-Étapes

```mermaid
sequenceDiagram
    participant User as Nouveau Vendeur
    participant Frontend as Frontend Next.js
    participant Supabase as Supabase Auth
    participant Backend as Backend Django
    participant DB as Database
    participant Email as Email Service

    User->>Frontend: 1. Accède à /signup
    Frontend->>User: 2. Affiche formulaire
    User->>Frontend: 3. Remplit (email, password, name, store)
    Frontend->>Frontend: 4. Validation côté client
    Frontend->>Supabase: 5. signUp(email, password)
    Supabase->>Supabase: 6. Crée auth user
    Supabase->>Frontend: 7. Retourne user_id
    Frontend->>Backend: 8. POST /api/sellers/register (user_id, store_data)
    Backend->>Backend: 9. Valide données
    Backend->>DB: 10. Crée User profile
    Backend->>DB: 11. Crée Store profile
    Backend->>Email: 12. Envoie email de confirmation
    Email->>User: 13. Email confirmation link
    DB->>Backend: 14. Data persisted
    Backend->>Frontend: 15. Retourne success
    Frontend->>User: 16. Affiche: Check your email

    User->>Email: 17. Clique confirmation link
    Email->>Supabase: 18. Confirme email
    Supabase->>User: 19. Email verified
    Frontend->>User: 20. Account ready
```

---

## 🛒 Domaine 2: Commandes E-Commerce

### DS-ORDER-001: Flux Complet d'une Commande (Happy Path)

```mermaid
sequenceDiagram
    participant Customer as Client
    participant Frontend as Frontend
    participant Cart as Cart (Local)
    participant Backend as Backend Django
    participant Payment as Payment Gateway
    participant Inventory as Inventory Service
    participant DB as Database
    participant Notify as Notification Service

    Customer->>Frontend: 1. Browse products
    Customer->>Frontend: 2. Add item to cart
    Frontend->>Cart: 3. Update cart (localStorage)
    Customer->>Frontend: 4. Continue shopping / Checkout
    Frontend->>Backend: 5. POST /api/orders (items)
    Backend->>Backend: 6. Validate items exist
    Backend->>Inventory: 7. Lock stock (optimistic)
    Inventory->>Backend: 8. Stock available
    Backend->>DB: 9. Create order (status: pending)
    DB->>Backend: 10. order_id returned
    Backend->>Frontend: 11. Redirection URL vers payment
    Frontend->>Payment: 12. Redirect pour payment
    Customer->>Payment: 13. Saisit infos carte
    Payment->>Payment: 14. Process payment
    
    alt Payment réussi
        Payment->>Backend: 15. Webhook: payment.succeeded
        Backend->>DB: 16. Update order status: confirmed
        Backend->>Inventory: 17. Decrement stock
        Backend->>DB: 18. Create transaction record
        Backend->>Notify: 19. Notify customer + seller
        Notify->>Customer: 20. Order confirmation email
        Notify->>Seller: 21. New order notification
        Backend->>Frontend: 22. Order success page
        Frontend->>Customer: 23. Display confirmation + tracking
    else Payment échoué
        Payment->>Backend: Webhook: payment.failed
        Backend->>DB: Update order status: failed
        Backend->>Inventory: Release stock lock
        Backend->>Frontend: Payment error page
        Frontend->>Customer: Retry option
    end
```

### DS-ORDER-002: Gestion des Erreurs de Paiement

```mermaid
sequenceDiagram
    participant Customer as Client
    participant Payment as Payment Gateway
    participant Backend as Backend
    participant DB as Database
    participant Retry as Retry Manager
    participant Support as Support Team

    Customer->>Payment: 1. Effectue paiement
    Payment->>Payment: 2. Traite requête
    
    alt Paiement Échoué
        Payment->>Backend: 3. Webhook: failed (reason)
        Backend->>DB: 4. Update order: status=failed
        Backend->>DB: 5. Log failure reason
        Backend->>Retry: 6. Schedule retry
        Backend->>Customer: 7. Notification: Payment failed
        Customer->>Payment: 8. Retry avec nouvelle carte
        
        alt Retry Réussi
            Payment->>Backend: Success webhook
            Backend->>DB: Update status: confirmed
        else Retry Échoué (x3)
            Backend->>DB: Auto-cancel order
            Backend->>Support: Escalate to team
            Support->>Customer: Assistance
        end
    end
```

### DS-ORDER-003: Suivi en Temps Réel avec Websockets

```mermaid
sequenceDiagram
    participant Customer as Client
    participant Frontend as Frontend
    participant Realtime as Supabase Realtime
    participant Backend as Backend
    participant Seller as Vendeur
    participant Driver as Driver
    participant DB as Database

    Customer->>Frontend: 1. Accès tracking page
    Frontend->>Realtime: 2. Subscribe: order:123 channel
    Realtime->>Backend: 3. Listen to updates

    Seller->>Seller: 4. Prépare commande
    Seller->>Backend: 5. PATCH /orders/123 (status: shipped)
    Backend->>DB: 6. Update status
    Backend->>Realtime: 7. Publish: order_updated event
    Realtime->>Frontend: 8. Broadcast update
    Frontend->>Customer: 9. Display: "Order shipped"

    Driver->>Backend: 10. Accept delivery
    Backend->>DB: 11. Update: assigned_driver_id
    Backend->>Realtime: 12. Publish update
    Realtime->>Frontend: 13. Notify
    Frontend->>Customer: 14. Display: "Driver assigned"

    Driver->>Driver: 15. En route
    Driver->>Backend: 16. Location update (every 30s)
    Backend->>Realtime: 17. Broadcast location
    Realtime->>Frontend: 18. Update map
    Frontend->>Customer: 19. Show real-time map

    Driver->>Backend: 20. Mark as delivered
    Backend->>DB: 21. Update status: delivered
    Backend->>Realtime: 22. Publish final update
    Realtime->>Frontend: 23. Update
    Frontend->>Customer: 24. Display: "Delivered ✓"
```

---

## 💳 Domaine 3: Paiement et Finances

### DS-PAYMENT-001: Paiement Sécurisé avec Tokenization

```mermaid
sequenceDiagram
    participant Customer as Client
    participant Frontend as Frontend
    participant Stripe as Stripe.js (Client)
    participant Backend as Backend Django
    participant StripeAPI as Stripe API
    participant PSP as PSP (Processor)
    participant Bank as Banque
    participant DB as Database

    Customer->>Frontend: 1. Saisit infos carte
    Frontend->>Stripe: 2. tokenize(card details)
    
    alt Tokenization réussie
        Stripe->>Frontend: 3. Retourne card token
        Frontend->>Frontend: 4. Ne stocke PAS card details
        Frontend->>Backend: 5. POST /api/payments (token, amount)
        Backend->>Backend: 6. Valide amount > 0
        Backend->>StripeAPI: 7. Create charge(token, amount)
        StripeAPI->>PSP: 8. Envoie requête
        PSP->>Bank: 9. Autorise transaction
        Bank->>PSP: 10. Autorisation confirmée
        PSP->>StripeAPI: 11. Success response
        StripeAPI->>Backend: 12. Charge confirmed
        Backend->>DB: 13. Log transaction (encrypted)
        Backend->>Frontend: 14. Success response
        Frontend->>Customer: 15. Payment successful ✓
    else Tokenization échouée
        Stripe->>Frontend: Error
        Frontend->>Customer: Card error message
    end
```

### DS-PAYMENT-003: Payout aux Vendeurs (Async Job)

```mermaid
sequenceDiagram
    participant Scheduler as Daily Scheduler
    participant Backend as Backend Django
    participant DB as Database
    participant PaymentAPI as Stripe Connect
    participant Bank as Seller Bank
    participant Seller as Vendeur
    participant Email as Email Service

    Scheduler->>Backend: 1. 00:00 UTC - Déclenche payout job
    Backend->>DB: 2. SELECT orders WHERE status=delivered AND payout_pending
    DB->>Backend: 3. Retourne orders
    Backend->>Backend: 4. Calcul par seller:
    Note over Backend: revenue = sum(order_total)<br/>fees = revenue * 0.15<br/>commission = revenue * 0.05<br/>net = revenue - fees - commission
    Backend->>Backend: 5. Filter: net >= minimum_payout (50€)
    Backend->>DB: 6. CREATE payout records (status: pending)
    Backend->>PaymentAPI: 7. Batch create transfers
    
    loop Pour chaque seller avec payout
        PaymentAPI->>Bank: 8. Transfer au seller account
        Bank->>Bank: 9. Procède transfer
        Bank->>Seller: 10. Crédite account
        PaymentAPI->>Backend: 11. Webhook: transfer.paid
        Backend->>DB: 12. Update payout status: completed
        Backend->>Email: 13. Send payout confirmation
        Email->>Seller: 14. Email: Funds transferred
    end
    
    Backend->>Scheduler: 15. Job completed
```

---

## 📅 Domaine 4: Booking de Services

### DS-BOOKING-001: Réservation Service avec Calendly

```mermaid
sequenceDiagram
    participant Customer as Client
    participant Frontend as Frontend
    participant Calendar as Calendly Widget
    participant Calendly as Calendly API
    participant Backend as Backend Django
    participant DB as Database
    participant Notify as Notification

    Customer->>Frontend: 1. Consulte service details
    Customer->>Frontend: 2. Clique "Book service"
    Frontend->>Calendar: 3. Initialise Calendly widget
    Calendar->>Calendly: 4. Fetch available slots
    Calendly->>Calendar: 5. Retourne calendar view
    Calendar->>Customer: 6. Display disponibilités
    Customer->>Calendar: 7. Sélectionne slot (ex: 2024-05-20 14:00)
    Calendar->>Calendly: 8. Book event
    Calendly->>Calendly: 9. Crée event + sends confirmations
    Calendly->>Calendar: 10. Retourne event_id
    Calendar->>Frontend: 11. onSuccess callback (event_id)
    Frontend->>Backend: 12. POST /api/bookings (event_id, service_id)
    Backend->>Backend: 13. Valide event
    Backend->>DB: 14. Crée booking record
    Backend->>DB: 15. Stores calendly_event_id
    Backend->>Notify: 16. Notify seller + customer
    Notify->>Customer: 17. Booking confirmation email
    Notify->>Seller: 18. New booking notification
    DB->>Backend: 19. Booking confirmed
    Backend->>Frontend: 20. Retourne confirmation
    Frontend->>Customer: 21. Display: Booking confirmed ✓
```

---

## 🚚 Domaine 5: Livraison et Géolocalisation

### DS-DELIVERY-001: Assignment Automatique d'un Driver

```mermaid
sequenceDiagram
    participant Order as Order Service
    participant Matcher as Matching Engine
    participant Maps as Maps API
    participant Drivers as Available Drivers
    participant Driver1 as Driver 1 (Mobile)
    participant Backend as Backend
    participant DB as Database
    participant Admin as Admin

    Order->>Backend: 1. Order ready_for_delivery
    Backend->>Matcher: 2. Find best driver (order_location)
    Matcher->>Maps: 3. Distance matrix (order → drivers)
    Maps->>Matcher: 4. Return distances + durations
    Matcher->>DB: 5. Query drivers (active, available)
    DB->>Matcher: 6. Return drivers list
    Matcher->>Matcher: 7. Score: distance + rating + capacity
    Matcher->>Backend: 8. Best match: Driver_1
    Backend->>Driver1: 9. Send delivery request (push + SMS)
    Driver1->>Driver1: 10. Reçoit notification
    Driver1->>Driver1: 11. Peut accept/refuse
    
    alt Driver accepte (< 5min)
        Driver1->>Backend: 12. Accept delivery
        Backend->>DB: 13. Update order: assigned_to=Driver1
        Backend->>Order: 14. Status = assigned
        Backend->>Driver1: 15. Confirmation + pickup details
    else Driver refuse or timeout
        Backend->>Matcher: 16. Retry with next driver
        Matcher->>Drivers: 17. Send to Driver 2, 3...
    else Aucun driver
        Backend->>Admin: 18. Alert: escalate to admin
        Admin->>Backend: 19. Manual assign or reschedule
    end
```

### DS-DELIVERY-002: Suivi en Temps Réel avec Géolocalisation

```mermaid
sequenceDiagram
    participant Driver as Driver (Mobile App)
    participant Backend as Backend Django
    participant Location as Location Service
    participant Realtime as Supabase Realtime
    participant Customer as Customer (Frontend)
    participant Maps as Maps API
    participant DB as Database

    Driver->>Backend: 1. Start delivery
    Backend->>DB: 2. Update status: in_transit
    
    loop Toutes les 30 secondes
        Driver->>Location: 3. Get GPS coordinates
        Location->>Driver: 4. Return lat/lng
        Driver->>Backend: 5. POST /api/deliveries/123/location
        Backend->>Backend: 6. Validate coordinates
        Backend->>Maps: 7. Reverse geocode + calc ETA
        Maps->>Backend: 8. Address + ETA (5 min)
        Backend->>DB: 9. Update location + ETA
        Backend->>Realtime: 10. Publish: delivery:123 updated
    end

    Customer->>Frontend: 11. Consulte tracking
    Frontend->>Realtime: 12. Subscribe delivery:123
    Realtime->>Frontend: 13. Real-time location updates
    Frontend->>Frontend: 14. Render map + marker
    Customer->>Frontend: 15. Voit driver en temps réel
    Frontend->>Customer: 16. Display ETA countdown

    Driver->>Backend: 17. Arrive at destination
    Backend->>DB: 18. Arrival timestamp
    Backend->>Realtime: 19. Publish: arrived event
    Realtime->>Frontend: 20. Update
    Frontend->>Customer: 21. Display: Driver arrived

    Driver->>Backend: 22. Confirm delivery (scan/photo)
    Backend->>DB: 23. status: delivered
    Backend->>Realtime: 24. Publish final update
    Realtime->>Frontend: 25. Final update
    Frontend->>Customer: 26. Display: ✓ Delivered
```

---

## 🛡️ Domaine 6: Détection de Fraude

### DS-FRAUD-001: Détection en Temps Réel

```mermaid
sequenceDiagram
    participant Customer as Client
    participant Frontend as Frontend
    participant Backend as Backend
    participant Rules as Fraud Rules Engine
    participant ML as ML Model
    participant DB as Database
    participant Admin as Admin Panel

    Customer->>Frontend: 1. Crée order (amount: $500)
    Frontend->>Backend: 2. POST /api/orders
    Backend->>Backend: 3. Enrichir context:
    Note over Backend: - Order amount<br/>- Customer history<br/>- Geo location<br/>- Device info<br/>- IP address
    Backend->>Rules: 4. Évaluer risque
    Rules->>Rules: 5. Appliquer règles:
    Note over Rules: IF amount > 1000 AND new_customer<br/>   THEN risk += 20<br/>IF geo_mismatch > 1000km<br/>   THEN risk += 15<br/>IF velocity > 5_orders/hour<br/>   THEN risk += 30
    Rules->>Backend: 6. risk_score = 45
    Backend->>ML: 7. Score avec ML model
    ML->>ML: 8. Predict fraud probability
    ML->>Backend: 9. Probability = 12%
    Backend->>Backend: 10. Décider action:
    
    alt Score > 80 (Definite fraud)
        Backend->>DB: Block order
        Backend->>Admin: Alert fraud analyst
    else Score 50-80 (Suspicious)
        Backend->>Frontend: Require 2FA
        Frontend->>Customer: Verify with SMS code
    else Score < 50 (Low risk)
        Backend->>Frontend: Allow order
    end
    
    Backend->>DB: 11. Log decision + score
    DB->>Backend: 12. Persisted
```

---

## ⭐ Domaine 7: Avis et Évaluations

### DS-REVIEW-001: Publication et Modération d'Avis

```mermaid
sequenceDiagram
    participant Customer as Client
    participant Frontend as Frontend
    participant Backend as Backend
    participant Moderation as Moderation Engine
    participant Reviewer as Human Reviewer
    participant DB as Database
    participant Seller as Vendeur

    Customer->>Backend: 1. Order completed (5 days ago)
    Frontend->>Customer: 2. Invite: Leave review
    Customer->>Frontend: 3. Clique "Write review"
    Frontend->>Customer: 4. Affiche review form
    Customer->>Frontend: 5. Écrit: "Great product! 5 stars"
    Frontend->>Backend: 6. POST /api/reviews (text, rating)
    Backend->>Backend: 7. Valide:
    Note over Backend: - User eligible (order complete)<br/>- Not already reviewed<br/>- Text not empty
    Backend->>DB: 8. Create review (status: pending)
    Backend->>Moderation: 9. Analyse pour moderation
    Moderation->>Moderation: 10. Check:
    Note over Moderation: - Spam detection<br/>- Offensive language<br/>- Relevance score<br/>- Duplicate review
    Moderation->>Backend: 11. Pass (score: 0.92)
    Backend->>DB: 12. Update status: approved
    Backend->>DB: 13. Publish review
    Backend->>Seller: 14. Notification: New review
    Seller->>Seller: 15. Reçoit notification
    Backend->>Frontend: 16. Retourne: Published
    Frontend->>Customer: 17. Affiche: Review published ✓

    alt Moderation flag (spam/offensive)
        Backend->>Reviewer: Review flagged for manual review
        Reviewer->>Reviewer: Examine review
        Reviewer->>Backend: Approve or reject
    end
```

---

## 📊 Domaine 8: Analytics et Reporting

### DS-ANALYTICS-001: Dashboard Vendeur (Cached)

```mermaid
sequenceDiagram
    participant Seller as Vendeur
    participant Frontend as Frontend
    participant Backend as Backend
    participant Cache as Redis Cache
    participant Analytics as Analytics Engine
    participant DB as Database

    Seller->>Frontend: 1. Accès dashboard
    Frontend->>Backend: 2. GET /api/analytics/dashboard
    Backend->>Cache: 3. Get key: analytics:seller:123
    
    alt Cache HIT
        Cache->>Backend: 4. Return cached data (5 min old)
        Backend->>Frontend: 5. Metrics (from cache)
    else Cache MISS
        Backend->>DB: 6. Query orders (this month)
        DB->>Backend: 7. Raw data
        Backend->>Analytics: 8. Aggregate:
        Note over Analytics: - Total revenue<br/>- Order count<br/>- Avg order value<br/>- Top products<br/>- Conversion rate
        Analytics->>Backend: 9. KPIs calculated
        Backend->>Cache: 10. Set key + expire 5min
        Backend->>Frontend: 11. Metrics
    end
    
    Frontend->>Frontend: 12. Render charts (Chart.js)
    Frontend->>Seller: 13. Display dashboard

    Seller->>Frontend: 14. Filter: last 7 days
    Frontend->>Backend: 15. GET /api/analytics?period=7d
    Backend->>Cache: 16. Invalidate + recalculate
    Backend->>Frontend: 17. New metrics
    Frontend->>Seller: 18. Updated view
```

---

## 🔗 Domaine 9: Intégrations Externes

### DS-INTEGRATION-001: Supabase Realtime Pub/Sub

```mermaid
sequenceDiagram
    participant Client1 as Client 1 (Frontend)
    participant Client2 as Client 2 (Frontend)
    participant Supabase as Supabase Realtime
    participant Seller as Vendor (Backend)
    participant DB as Database
    participant Trigger as DB Trigger

    Client1->>Supabase: 1. Subscribe: store:456 inventory
    Client2->>Supabase: 2. Subscribe: store:456 inventory
    Supabase->>Supabase: 3. Create channel listeners

    Seller->>Backend: 4. Update product stock
    Backend->>DB: 5. UPDATE items SET qty=15 WHERE id=789
    Trigger->>Trigger: 6. DB trigger fired
    Trigger->>Supabase: 7. Publish: item:789 updated
    Supabase->>Client1: 8. Broadcast new stock (qty: 15)
    Supabase->>Client2: 9. Broadcast new stock (qty: 15)
    Client1->>Client1: 10. Update UI instantly
    Client2->>Client2: 11. Update UI instantly
    
    Client1->>Frontend: 12. Both see updated stock = 15
    Client2->>Frontend: 13. Real-time sync sans refresh
    
    Note over Supabase: Latency: < 100ms typically
```

---

## 📝 Notes pour le Rapport

### Conseils de Présentation

1. **Couleurs et Styling**:
   - Utiliser couleurs cohérentes pour acteurs (Bleu: Frontend, Vert: Backend, Rouge: External)
   - Gras pour actions critiques

2. **Niveau de Détail**:
   - Pour PFE: 8-15 étapes par diagramme
   - Inclure cas d'erreur pour complexité
   - Montrer où la base de données est utilisée

3. **Descriptions**:
   - Ajouter objectif pédagogique avant chaque diagramme
   - Lister acteurs participants
   - Énumérer technos utilisées

4. **Organisation**:
   - Regrouper par domaine fonctionnel
   - Progresser de simple à complexe
   - Core flows en premier (Auth, Order, Payment)

5. **Validation**:
   - Tester chaque diagramme Mermaid (syntax correct)
   - Vérifier pas d'acteurs oubliés
   - Confirmer flux logique

---

**Generated**: 15 Mai 2026  
**Format**: Mermaid Sequence Diagrams  
**Target**: PFE Report
