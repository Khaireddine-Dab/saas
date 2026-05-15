# SaaS Project - Comprehensive System Overview

**Project Name**: Ro2ya Marketplace Platform  
**Architecture**: Next.js Frontend + Django Backend  
**Database**: PostgreSQL/SQLite  
**Deployment**: Docker-based  
**Date**: May 2026

---

## 📋 Executive Summary

This is a **multi-vendor marketplace platform** (SaaS) that enables:
- **Businesses** to create stores, list products/services, manage orders, and accept payments
- **Customers** to browse, purchase products, book services, and review businesses
- **Admins** to manage platform content, monitor fraud, verify businesses, and track system health
- **Drivers** to manage deliveries and logistics
- **Analytics** on user behavior, transactions, and business performance

---

## 1. ARCHITECTURE OVERVIEW

### Technology Stack

**Frontend:**
- **Framework**: Next.js 14.2.16 (React 18)
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS with dark mode support
- **Forms**: React Hook Form + Zod validation
- **State Management**: React hooks, Context API
- **Charts**: Recharts for analytics
- **Auth**: NextAuth with JWT tokens
- **API Client**: Fetch with automatic token refresh

**Backend:**
- **Framework**: Django REST Framework
- **Database**: PostgreSQL (primary) / SQLite (dev)
- **Auth**: Token-based (JWT with refresh tokens)
- **API**: RESTful with pagination, filtering, and search
- **Deployment**: Docker with docker-compose

**Third-party Integrations:**
- **Supabase**: User authentication, database, real-time capabilities
- **Calendly**: Service booking and scheduling widget
- **Mapbox**: Location mapping and geolocation
- **Vercel Analytics**: Application monitoring

---

## 2. BACKEND DJANGO APPS ARCHITECTURE

### Core Apps & Their Purposes

```
backend/
├── users/              # User management, profiles, authentication
├── stores/             # Business store management and profiles
├── items/              # Products and services catalog
├── orders/             # Order processing and management
├── bookings/           # Service booking system
├── transactions/       # Payment and financial tracking
├── banners/            # Promotional banners and campaigns
├── promotions/         # Discounts and promotional rules
├── drivers/            # Delivery personnel management
├── reviews/            # Customer reviews and ratings
├── fraud/              # Fraud detection and alerts
├── support/            # Customer support and tickets
├── core/               # Shared utilities and configurations
```

### App-by-App Breakdown

#### **Users App** (`/backend/users/`)
**Purpose**: User account management, authentication, profiles

**Models**:
- Extended user profiles (role-based: ADMIN, BUSINESS_OWNER, PRO, CLIENT)
- User preferences and interaction history
- Status management (active, suspended, banned, inactive)
- Location tracking (latitude, longitude, city, address)

**Endpoints**:
- `POST /api/auth/register/` - User signup
- `POST /api/auth/login/` - Login with JWT tokens
- `GET /api/auth/profile/` - Fetch current user profile
- `GET /api/users/` - List users (admin)
- `PUT /api/users/{id}/` - Update user profile

**Key Features**:
- Multi-role system (CLIENT, BUSINESS_OWNER, PRO, ADMIN)
- JWT token management with refresh capability
- User preferences for content filtering
- User interaction tracking for analytics

---

#### **Stores App** (`/backend/stores/`)
**Purpose**: Business store management, store profiles, verification

**Models**:
- Store information (name, description, category)
- Contact details and address
- Verification status and documentation
- Analytics (rating, reviews count, orders count, views)
- Business licensing and registration info
- Gallery and opening hours (JSON fields)

**Endpoints**:
- `GET /api/stores/` - List all stores with filters
- `POST /api/stores/` - Create new store (BUSINESS_OWNER)
- `GET /api/stores/{id}/` - Store details
- `PUT /api/stores/{id}/` - Update store
- `DELETE /api/stores/{id}/` - Delete store

**Key Features**:
- Multi-category support (RESTAURANT, SHOP, SERVICE, OTHER)
- Store verification workflow
- Geolocation-based store discovery
- Store analytics (ratings, reviews, orders)
- Business document verification (license, ID, registration)

---

#### **Items App** (`/backend/items/`)
**Purpose**: Products and services catalog management

**Models**:
- Item metadata (name, description, price)
- Type system (PRODUCT or SERVICE)
- Stock/availability management
- Pricing units (unit, hour, day, session)
- Bookable items with availability calendars
- Image management (multiple images)
- Status tracking (AVAILABLE, HIDDEN, FLAGGED, BANNED)
- Analytics (views, orders, bookings, ratings)
- Embeddings for search/recommendations

**Endpoints**:
- `GET /api/items/` - List items with search/filters
- `POST /api/items/` - Create item
- `GET /api/items/{id}/` - Item details
- `PUT /api/items/{id}/` - Update item
- `DELETE /api/items/{id}/` - Delete item
- `GET /api/items/store/{store_id}/` - Items by store

**Key Features**:
- Dual-mode: Products (stock-based) and Services (bookable)
- Dynamic pricing with unit flexibility
- Availability calendar for services
- Search with vector embeddings
- Image gallery support
- Status workflow for content moderation

---

#### **Orders App** (`/backend/orders/`)
**Purpose**: Purchase orders and transactions

**Models**:
- Order metadata (items, quantities, pricing)
- Order status workflow (pending → approved → processing → shipped → delivered)
- Payment tracking (status, method)
- Address information (shipping, billing)
- Timeline events for order progression
- Approval workflows

**Endpoints**:
- `GET /api/orders/` - List orders with filters
- `POST /api/orders/` - Create order
- `GET /api/orders/{id}/` - Order details
- `PUT /api/orders/{id}/` - Update order
- `DELETE /api/orders/{id}/` - Cancel order
- `GET /api/orders/store/{store_id}/` - Store's orders

**Key Features**:
- Multi-item order support
- Order status tracking with timeline
- Separate payment status management
- Manual approval workflows for high-value orders
- Order notes for merchant-customer communication

---

#### **Bookings App** (`/backend/bookings/`)
**Purpose**: Service booking and appointment scheduling

**Models**:
- Booking requests with date/time slots
- Service duration tracking
- Booking status (pending, confirmed, completed, cancelled)
- Location information for on-site services
- Customer and service provider details

**Endpoints**:
- `GET /api/bookings/` - List bookings
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/{id}/` - Booking details
- `PUT /api/bookings/{id}/` - Update booking status
- Integration with **Calendly widget** for availability

**Key Features**:
- Calendar-based availability management
- Integration with Calendly for scheduling
- Booking status workflow
- Service provider availability tracking

---

#### **Transactions App** (`/backend/transactions/`)
**Purpose**: Financial transaction tracking and reporting

**Models**:
- Transaction types (payment, refund, payout)
- Transaction status workflow (pending → completed, failed, refunded)
- Amount tracking with fees
- Party tracking (customer, merchant/store, driver)
- Delivery tracking metadata (distance, duration, wait time)
- Multi-timestamp support (creation, acceptance, collection, pickup, delivery)

**Database Fields**:
```
- id (UUID)
- type: payment | refund | payout
- status: pending | completed | failed | refunded
- amount: decimal
- fee: decimal
- customer_id, merchant_id, booking_id
- driver_name, km, wait_duration_minutes, delivery_duration_minutes
- time_created, time_accepted, collection_time, pickup_time, time_delivered
```

**Endpoints**:
- `GET /api/transactions/` - List transactions (with filters: status, type, merchant_id, customer_id)
- `POST /api/transactions/` - Create transaction
- `GET /api/transactions/{id}/` - Transaction details
- `PUT /api/transactions/{id}/` - Update transaction status
- `GET /api/transactions/merchant/{merchant_id}/` - Merchant's transactions

**Key Features**:
- Complete transaction lifecycle tracking
- Fee management
- Delivery metrics (distance, duration)
- Payment status monitoring
- Merchant payout tracking

---

#### **Banners App** (`/backend/banners/`)
**Purpose**: Promotional banner campaigns with analytics

**Models**:
- Banner content (title, description, image, target URL)
- Placement targeting (homepage, category, checkout, popup)
- Scheduling (start_date, end_date)
- Status management (draft, scheduled, active, inactive, expired)
- Analytics (impressions, clicks)
- Conversion tracking

**Computed Properties**:
- `is_active` - Current active status
- `is_upcoming` - Future scheduled
- `is_expired` - Past end date
- `click_rate` - CTR calculation
- `days_remaining` - Countdown

**Endpoints**:
- `GET /api/banners/` - List banners with filters (store, status, placement)
- `POST /api/banners/` - Create banner
- `GET /api/banners/{id}/` - Banner details
- `PUT /api/banners/{id}/` - Update banner
- `DELETE /api/banners/{id}/` - Delete banner

**Key Features**:
- Multi-placement support
- Date-based scheduling
- Priority ordering
- Impression/click tracking
- Conversion rate analytics
- Store-specific banners

---

#### **Promotions App** (`/backend/promotions/`)
**Purpose**: Promotional rules, discounts, and special offers

**Models**:
- Promotion metadata (title, description)
- Discount types (percentage-based or custom text)
- Validity period (valid_from, valid_until)
- Target scope (all items in store OR specific items)
- Junction table for many-to-many promotion-items

**Endpoints**:
- `GET /api/promotions/` - List promotions (filters: store_id, active)
- `POST /api/promotions/` - Create promotion
- `GET /api/promotions/{id}/` - Promotion details
- `PUT /api/promotions/{id}/` - Update promotion
- `DELETE /api/promotions/{id}/` - Delete promotion
- `GET /api/promotions/store/{store_id}/` - Store's active promotions
- `GET /api/promotions/active/` - Currently active promotions
- `GET /api/promotions/stats/` - Promotion statistics

**Key Features**:
- Multiple discount formats (percentage or custom text)
- Flexible targeting (all items or specific items)
- Date-based activation
- Bulk application support via junction table

---

#### **Drivers App** (`/backend/drivers/`)
**Purpose**: Delivery personnel and logistics management

**Models**:
- Driver profile (name, email, phone)
- Status tracking (active, inactive, suspended, on-break, offline)
- Vehicle information (type, license plate, specs)
- Document management (license, ID, insurance, registration, background check)
- Location tracking (current coordinates, address)
- Performance metrics (deliveries, ratings, completion rate, delivery time)
- Earnings tracking (total, monthly, weekly)
- Bank account information

**Endpoints**:
- `GET /api/drivers/` - List drivers with filters
- `POST /api/drivers/` - Register driver
- `GET /api/drivers/{id}/` - Driver profile
- `PUT /api/drivers/{id}/` - Update driver
- `POST /api/drivers/{id}/documents/` - Upload document
- `GET /api/drivers/{id}/earnings/` - Driver earnings

**Key Features**:
- Document verification workflow
- Multi-vehicle support
- Real-time location tracking
- Performance and earnings analytics
- Bank account management for payouts
- Status management

---

#### **Reviews App** (`/backend/reviews/`)
**Purpose**: Customer reviews, ratings, and sentiment analysis

**Models**:
- Review content (text, rating/score)
- Relationships (reviewer, reviewed entity: product/store)
- Moderation (status: visible, hidden, flagged)
- Sentiment analysis
- Helpful feedback tracking

**Endpoints**:
- `GET /api/reviews/` - List reviews with filters
- `POST /api/reviews/` - Create review
- `GET /api/reviews/{id}/` - Review details
- `PUT /api/reviews/{id}/` - Update review (by author)
- `DELETE /api/reviews/{id}/` - Delete review
- `GET /api/reviews/product/{product_id}/` - Product reviews
- `GET /api/reviews/store/{store_id}/` - Store reviews

**Key Features**:
- Star rating system (1-5)
- Text review content
- Reviewer anonymity options
- Moderation workflow
- Sentiment analysis
- Helpful vote tracking

---

#### **Fraud App** (`/backend/fraud/`)
**Purpose**: Fraud detection, alerts, and investigations

**Models**:
- Fraud alerts with severity levels (critical, high, medium, low)
- Alert types (suspicious activity, fake review, unusual spike, suspicious seller, payment fraud, bot activity)
- Alert status workflow (open → investigating → resolved, false_positive)
- Risk scoring
- Flag tracking
- Assignment to investigators

**Endpoints**:
- `GET /api/fraud/alerts/` - List alerts with filters
- `POST /api/fraud/alerts/` - Create alert
- `GET /api/fraud/alerts/{id}/` - Alert details
- `PUT /api/fraud/alerts/{id}/` - Update alert status
- `GET /api/fraud/stats/` - Fraud statistics
- `POST /api/fraud/analyze/` - Analyze entity for fraud

**Key Features**:
- Multi-severity alert system
- Risk scoring algorithm
- Entity-agnostic alerts (user, order, business, product, review)
- Investigation workflow
- False positive tracking
- Alert assignment to moderators

---

#### **Support App** (`/backend/support/`)
**Purpose**: Customer support ticketing and communication

**Models**:
- Support tickets (subject, description, priority)
- Ticket status (open, in-progress, resolved, closed)
- Priority levels (low, medium, high, urgent)
- Attachments
- Chat/conversation threads
- Assignment to support team

**Endpoints**:
- `GET /api/support/tickets/` - List tickets
- `POST /api/support/tickets/` - Create ticket
- `GET /api/support/tickets/{id}/` - Ticket details
- `POST /api/support/tickets/{id}/messages/` - Add message
- `PUT /api/support/tickets/{id}/` - Update ticket status

---

#### **Core App** (`/backend/core/`)
**Purpose**: Shared utilities, base classes, and configuration

**Components**:
- Custom authentication classes
- Pagination helpers
- Exception handlers
- Serializer base classes
- Middleware
- Settings management
- Database connection utilities

---

## 3. FRONTEND NEXT.JS ARCHITECTURE

### Page Structure (`/app`)

```
app/
├── page.tsx                    # Homepage
├── login/                      # Authentication pages
├── signup/
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
│
├── dashboard/                  # Main dashboard
│   ├── page.tsx               # Dashboard overview
│   ├── admin/                 # Admin-only pages
│   │   ├── users/
│   │   ├── businesses/
│   │   ├── moderation/
│   │   ├── reports/
│   │   └── ...
│   ├── orders/                # Order management
│   ├── transactions/          # Financial management
│   ├── banners/               # Campaign management
│   ├── promotions/            # Promotion management
│   ├── products/              # Product catalog
│   ├── items/                 # Items (products + services)
│   ├── merchants/             # Merchant management
│   ├── drivers/               # Driver management
│   ├── fraud/                 # Fraud monitoring
│   ├── reviews/               # Review moderation
│   ├── coupons/               # Coupon management
│   ├── analytics/             # Analytics & reporting
│   ├── payments/              # Payment management
│   ├── notifications/         # Notification center
│   ├── map/                   # Geolocation/mapping
│   ├── cms-pages/             # Content management
│   ├── marketing/             # Marketing tools
│   ├── support/               # Support management
│   └── settings/              # Configuration
```

### Component Structure (`/components`)

**Layout Components**:
- `dashboard-header.tsx` - Top navigation bar
- `dashboard-sidebar.tsx` - Left navigation sidebar
- `theme-provider.tsx` - Dark/light theme support
- `theme-toggle.tsx` - Theme switcher
- `language-selector.tsx` - Multi-language support

**Integration Components**:
- `calendly-widget.tsx` - Calendly scheduling widget
- `calendly-button.tsx` - Calendly button trigger
- `calendly-modal.tsx` - Modal wrapper for Calendly
- `calendly-fallback.tsx` - Fallback UI

**Utility Components**:
- `auth-guard.tsx` - Protected route wrapper
- `backend-status.tsx` - Backend health indicator
- `animated-logo.tsx` - Animated branding
- `error-boundary.tsx` - Error handling

**UI Components** (`/components/ui/`):
- Radix UI + shadcn/ui components (dialogs, dropdowns, tables, forms, etc.)

**Dashboard-Specific** (`/components/dashboard/`):
- Page-specific components (charts, tables, cards)

**Admin-Specific** (`/components/admin/`):
- Admin-only interface components

### Hooks (`/hooks`)

**Data Fetching Hooks**:
- `useOrders.ts` - Order data and mutations
- `useTransactions.ts` - Transaction tracking
- `useBanners.ts` - Banner management
- `useBannerMutations.ts` - Banner CRUD operations
- `usePromotions.ts` - Promotion data
- `useItems.ts` - Product/service items
- `useProducts.ts` - Product-specific logic
- `useDrivers.ts` - Driver management
- `useReviews.ts` - Review data
- `useCoupons.ts` - Coupon logic
- `useUsers.ts` - User data
- `useFraudAlerts.ts` - Fraud alert tracking

**Utility Hooks**:
- `useAnalytics.ts` - Analytics tracking
- `useBackendStatus.ts` - Backend health check
- `useSystemHealth.ts` - System monitoring
- `useOrderFilters.ts` - Order filtering logic
- `use-calendly-analytics.ts` - Calendly event tracking
- `use-mobile.tsx` - Mobile device detection
- `use-toast.ts` - Toast notifications

**Pattern**: Each hook follows React 18 best practices with:
- `useState` for local state
- `useCallback` for memoized functions
- `useMemo` for computed values
- Error handling
- Loading states
- Automatic data mapping (backend → frontend types)

### Type System (`/types`)

**User & Auth**:
- `user.ts` - User roles, profiles, metrics
- `analytics.ts` - User behavior analytics

**Commerce**:
- `order.ts` - Order status, items, timeline
- `product.ts` - Product catalog
- `item.ts` - Items (products + services)
- `coupon.ts` - Discount codes
- `promotion.ts` - Promotional campaigns
- `transaction.ts` - Payment transactions
- `banner.ts` - Banner campaigns

**Business**:
- `business.ts` - Store/business profiles
- `driver.ts` - Driver data, documents, vehicles
- `review.ts` - Review data
- `review-extended.ts` - Extended review analytics

**Moderation & Safety**:
- `fraud.ts` - Fraud alerts, severity, risk scoring
- `moderation.ts` - Content moderation workflow
- `report.ts` - User/content reports
- `admin.ts` - Admin-specific types

**Supporting**:
- `common.ts` - Shared enums, colors, pagination
- `search.ts` - Search filters and results
- `system.ts` - Platform system information

### Data Mapping Layer (`/lib`)

**Purpose**: Transform backend API responses to frontend types

**Mappers**:
- `banner-mapper.ts` - Backend banner → frontend Banner
- `order-mapper.ts` - Backend order → frontend Order
- `transaction-mapper.ts` - Backend transaction → frontend Transaction
- `driver-mapper.ts` - Backend driver → frontend Driver
- `item-mapper.ts` - Backend item → frontend Item
- `product-mapper.ts` - Backend product → frontend Product
- `promotion-mapper.ts` - Backend promotion → frontend Promotion
- `review-mapper.ts` - Backend review → frontend Review

**API Client** (`api.ts`):
- Centralized fetch wrapper
- Automatic JWT token management
- Token refresh on 401 errors
- Error handling and message extraction
- Query parameter building

**Utilities**:
- `helpers.ts` - Common utility functions
- `constants.ts` - Application constants
- `utils.ts` - General utilities
- `translations.ts` - i18n strings
- `dashboard-data.ts` - Mock data for development

### Context & State Management (`/contexts`)

- `language-context.tsx` - Multi-language (i18n) support

**Pattern**: Context API for global state
- Language/locale switching
- Theme switching
- Authentication state
- User preferences

---

## 4. USER FLOWS & BUSINESS PROCESSES

### A. Authentication & Onboarding Flow

```
User Landing Page
    ↓
Sign Up / Login
    ├── Email + Password
    ├── JWT token generation
    └── Refresh token storage
    ↓
Profile Setup (based on role)
    ├── CLIENT: Basic profile info
    ├── BUSINESS_OWNER: Store setup
    └── ADMIN: Skip
    ↓
Authenticated Dashboard
```

### B. Business Seller Workflow

```
1. Store Creation & Management
   ├── Register as BUSINESS_OWNER
   ├── Create store profile
   ├── Upload documents (license, ID, registration)
   ├── Business verification workflow
   └── Store activation

2. Product/Service Management
   ├── Create items (products or services)
   ├── Set pricing and availability
   ├── Upload images and descriptions
   ├── Configure booking calendar (if service)
   └── Set inventory

3. Order Management
   ├── Receive orders from customers
   ├── Review order details
   ├── Update order status (pending → processing → shipped → delivered)
   ├── Communicate with customers
   └── Track fulfillment

4. Campaign Management
   ├── Create promotional banners
   ├── Set scheduling and targeting
   ├── Create discount promotions
   ├── Track performance metrics
   └── Monitor analytics

5. Financial Management
   ├── View transaction history
   ├── Track earnings and payouts
   ├── Manage refunds
   └── Download reports
```

### C. Customer Purchase Workflow

```
1. Browse & Search
   ├── Search by keyword or category
   ├── Filter by location, price, rating
   ├── View product/service details
   └── Read reviews

2. Add to Cart & Checkout
   ├── Add items to cart
   ├── Apply coupons/promotions
   ├── Review total with fees
   └── Proceed to payment

3. Payment & Order
   ├── Select payment method
   ├── Process payment transaction
   ├── Receive order confirmation
   └── Order moves to pending status

4. Order Tracking
   ├── Monitor order status
   ├── Receive delivery updates
   ├── Get driver tracking (if applicable)
   └── Confirm delivery

5. Review & Feedback
   ├── Leave product/service review
   ├── Rate business
   ├── Upload photos (optional)
   └── See review visibility/moderation
```

### D. Service Booking Workflow

```
1. Service Discovery
   ├── Browse available services
   ├── Check service provider profile
   ├── View availability calendar
   └── Read reviews

2. Booking Request
   ├── Select date & time slot
   ├── Provide service location
   ├── Add special requirements
   └── Confirm booking

3. Calendly Integration
   ├── Optional: Use Calendly widget for scheduling
   ├── Sync with service provider calendar
   ├── Send confirmation emails
   └── Reminder notifications

4. Service Fulfillment
   ├── Service provider confirms/rejects
   ├── Communication through platform
   ├── Service date execution
   └── Completion marking

5. Post-Service
   ├── Payment processing
   ├── Customer review
   ├── Provider rating
   └── Earnings settlement
```

### E. Driver & Delivery Workflow

```
1. Driver Registration
   ├── Create driver account
   ├── Upload documents (license, insurance, background check)
   ├── Vehicle registration
   ├── Background verification
   └── Account activation

2. Order Acceptance
   ├── Driver receives available deliveries
   ├── Accept delivery jobs
   ├── Route optimization
   └── Pickup coordination

3. Delivery Execution
   ├── Pickup from merchant
   ├── Real-time location tracking
   ├── Deliver to customer
   ├── Signature/confirmation
   └── Update transaction with delivery metrics

4. Earnings & Payouts
   ├── Track completed deliveries
   ├── Earn commission per delivery
   ├── View earnings dashboard
   └── Receive payouts to bank account

5. Performance Tracking
   ├── Monitor rating
   ├── Track completion rate
   ├── Measure average delivery time
   └── Maintain performance metrics
```

### F. Admin & Moderation Workflow

```
1. User Management
   ├── View all users
   ├── Manage user roles
   ├── Suspend/ban users
   └── View user activity

2. Business Verification
   ├── Review business documents
   ├── Verify business registration
   ├── Approve/reject stores
   └── Monitor store compliance

3. Content Moderation
   ├── Review flagged reviews
   ├── Hide inappropriate content
   ├── Monitor product listings
   └── Enforce content policies

4. Fraud Monitoring
   ├── Monitor fraud alerts
   ├── Investigate suspicious activity
   ├── Mark false positives
   ├── Take action (ban, suspend, refund)
   └── Track fraud metrics

5. Support & Escalation
   ├── Monitor support tickets
   ├── Assign to support team
   ├── Escalate complex issues
   └── Track resolution SLAs

6. System Health
   ├── Monitor backend health
   ├── Check API status
   ├── View system logs
   └── Handle outages
```

### G. Analytics & Reporting Workflow

```
1. Dashboard Metrics
   ├── Real-time KPIs (users, orders, revenue)
   ├── Conversion funnel tracking
   ├── User behavior heatmaps
   └── Search analytics

2. Order Analytics
   ├── Order volume trends
   ├── Average order value
   ├── Payment success rates
   └── Delivery time metrics

3. Business Analytics
   ├── Top performing stores
   ├── Product performance
   ├── Category demand analysis
   └── Seller KPIs

4. Fraud Analytics
   ├── Alert distribution by severity
   ├── False positive rate
   ├── Resolution time tracking
   └── Risk score distribution

5. Driver Analytics
   ├── Delivery completion rates
   ├── Average delivery time
   ├── Driver earnings breakdown
   └── Vehicle utilization
```

---

## 5. API ENDPOINTS SUMMARY

### Authentication Endpoints
```
POST   /api/auth/register/          - Register user
POST   /api/auth/login/             - Login with credentials
GET    /api/auth/profile/           - Get current user
POST   /api/auth/refresh/           - Refresh access token
GET    /api/auth/dashboard/         - User dashboard data
```

### Users
```
GET    /api/users/                  - List users (admin)
POST   /api/users/                  - Create user (admin)
GET    /api/users/{id}/             - Get user details
PUT    /api/users/{id}/             - Update user
DELETE /api/users/{id}/             - Delete user
```

### Stores
```
GET    /api/stores/                 - List stores
POST   /api/stores/                 - Create store
GET    /api/stores/{id}/            - Store details
PUT    /api/stores/{id}/            - Update store
DELETE /api/stores/{id}/            - Delete store
```

### Items (Products/Services)
```
GET    /api/items/                  - List items (search/filter)
POST   /api/items/                  - Create item
GET    /api/items/{id}/             - Item details
PUT    /api/items/{id}/             - Update item
DELETE /api/items/{id}/             - Delete item
GET    /api/items/store/{store_id}/ - Store items
```

### Orders
```
GET    /api/orders/                 - List orders (with filters)
POST   /api/orders/                 - Create order
GET    /api/orders/{id}/            - Order details
PUT    /api/orders/{id}/            - Update order status
DELETE /api/orders/{id}/            - Cancel order
GET    /api/orders/store/{id}/      - Store orders
```

### Bookings
```
GET    /api/bookings/               - List bookings
POST   /api/bookings/               - Create booking
GET    /api/bookings/{id}/          - Booking details
PUT    /api/bookings/{id}/          - Update booking
DELETE /api/bookings/{id}/          - Cancel booking
```

### Transactions
```
GET    /api/transactions/           - List transactions (filters)
POST   /api/transactions/           - Create transaction
GET    /api/transactions/{id}/      - Transaction details
PUT    /api/transactions/{id}/      - Update transaction
GET    /api/transactions/merchant/{id}/ - Merchant transactions
```

### Banners
```
GET    /api/banners/                - List banners (filters)
POST   /api/banners/                - Create banner
GET    /api/banners/{id}/           - Banner details
PUT    /api/banners/{id}/           - Update banner
DELETE /api/banners/{id}/           - Delete banner
```

### Promotions
```
GET    /api/promotions/             - List promotions (filters)
POST   /api/promotions/             - Create promotion
GET    /api/promotions/{id}/        - Promotion details
PUT    /api/promotions/{id}/        - Update promotion
DELETE /api/promotions/{id}/        - Delete promotion
GET    /api/promotions/store/{id}/  - Store promotions
GET    /api/promotions/active/      - Active promotions
GET    /api/promotions/stats/       - Promotion statistics
```

### Drivers
```
GET    /api/drivers/                - List drivers
POST   /api/drivers/                - Register driver
GET    /api/drivers/{id}/           - Driver profile
PUT    /api/drivers/{id}/           - Update driver
POST   /api/drivers/{id}/documents/ - Upload document
GET    /api/drivers/{id}/earnings/  - Driver earnings
```

### Reviews
```
GET    /api/reviews/                - List reviews (filters)
POST   /api/reviews/                - Create review
GET    /api/reviews/{id}/           - Review details
PUT    /api/reviews/{id}/           - Update review
DELETE /api/reviews/{id}/           - Delete review
GET    /api/reviews/product/{id}/   - Product reviews
GET    /api/reviews/store/{id}/     - Store reviews
```

### Fraud
```
GET    /api/fraud/alerts/           - List fraud alerts (filters)
POST   /api/fraud/alerts/           - Create alert
GET    /api/fraud/alerts/{id}/      - Alert details
PUT    /api/fraud/alerts/{id}/      - Update alert status
GET    /api/fraud/stats/            - Fraud statistics
POST   /api/fraud/analyze/          - Analyze for fraud
```

### Support
```
GET    /api/support/tickets/        - List tickets
POST   /api/support/tickets/        - Create ticket
GET    /api/support/tickets/{id}/   - Ticket details
POST   /api/support/tickets/{id}/messages/ - Add message
PUT    /api/support/tickets/{id}/   - Update ticket
```

### Analytics
```
GET    /api/analytics/dashboard/    - Dashboard metrics
GET    /api/analytics/orders/       - Order analytics
GET    /api/analytics/businesses/   - Business analytics
GET    /api/analytics/fraud/        - Fraud metrics
GET    /api/analytics/drivers/      - Driver metrics
```

---

## 6. DATABASE SCHEMA & ENTITY RELATIONSHIPS

### Core Entity Diagram

```
users (auth)
    ├── profiles (user profiles)
    ├── user_preferences (content preferences)
    └── user_interactions (activity tracking)
    
stores (businesses)
    ├── store_id → users.id (owner)
    ├── items (products/services)
    ├── orders
    ├── banners
    ├── promotions
    └── reviews
    
items (products/services)
    ├── store_id → stores.id
    ├── orders → order_items
    ├── bookings
    ├── promotions → promotion_items
    └── reviews
    
orders (purchases)
    ├── user_id → users.id
    ├── store_id → stores.id
    ├── order_items (line items)
    ├── transactions (payment)
    ├── bookings (if service)
    └── reviews
    
bookings (service appointments)
    ├── item_id → items.id
    ├── user_id → users.id
    ├── transactions (payment)
    └── reviews
    
transactions (payments)
    ├── customer_id → users.id
    ├── merchant_id → stores.id
    ├── booking_id → bookings.id (optional)
    ├── driver_id → drivers.id (optional)
    └── type: payment|refund|payout
    
banners (promotional)
    ├── store_id → stores.id
    └── analytics (impressions, clicks)
    
promotions (discounts)
    ├── store_id → stores.id
    ├── item_id → items.id (optional)
    └── promotion_items (many-to-many)
    
drivers (delivery)
    ├── documents (license, insurance, etc)
    ├── vehicles
    ├── transactions (earnings)
    └── deliveries (order tracking)
    
reviews (ratings)
    ├── reviewer_id → users.id
    ├── store_id → stores.id (optional)
    ├── product_id → items.id (optional)
    └── moderation_status
    
fraud_alerts
    ├── target_entity (user|order|business|product|review)
    ├── target_id
    ├── severity (critical|high|medium|low)
    └── status (open|investigating|resolved|false_positive)
    
support_tickets
    ├── user_id → users.id
    ├── assigned_to → users.id (support staff)
    ├── messages (chat thread)
    └── status
```

### Key Tables Summary

| Table | Purpose | Owner | Key Fields |
|-------|---------|-------|-----------|
| `users` | User accounts | Supabase + Django | id, role, email, status |
| `stores` | Business profiles | users (owner_id) | id, name, category, status, rating |
| `items` | Products/Services | stores | id, type, price, stock, status |
| `orders` | Purchases | users + stores | id, status, total_amount, timeline |
| `bookings` | Service appointments | users + items | id, date, time, status |
| `transactions` | Payments | users + stores + drivers | id, type, amount, fee, status |
| `banners` | Campaigns | stores | id, placement, status, impressions, clicks |
| `promotions` | Discounts | stores + items | id, discount_percent, valid_from/until |
| `drivers` | Delivery personnel | system | id, status, rating, earnings |
| `reviews` | Ratings & feedback | users | id, rating, text, sentiment |
| `fraud_alerts` | Risk detection | system | id, severity, status, risk_score |
| `support_tickets` | Customer support | users | id, subject, status, priority |

---

## 7. THIRD-PARTY INTEGRATIONS

### A. Supabase
**Purpose**: Authentication, real-time database, storage

**Components**:
- `lib/supabase.ts` - Supabase client initialization
- User authentication (email/password, SSO)
- Realtime database updates
- File storage for uploads

**Integration Points**:
- User registration and login
- Profile data storage
- Document storage
- Real-time notifications

---

### B. Calendly
**Purpose**: Service booking and appointment scheduling

**Components**:
- `components/calendly-widget.tsx` - Embedded widget
- `components/calendly-button.tsx` - Button to trigger
- `components/calendly-modal.tsx` - Modal container
- `hooks/use-calendly-analytics.ts` - Event tracking

**Use Cases**:
- Service provider availability management
- Appointment scheduling for bookable items
- Integration with booking workflow
- Analytics on scheduling behavior

**Frontend Integration**:
```typescript
<CalendlyWidget 
  url="https://calendly.com/provider"
  onEventScheduled={(event) => {
    // Create booking in system
  }}
/>
```

---

### C. Mapbox
**Purpose**: Location services, mapping, geolocation

**Components**:
- `components/map/` - Map display components
- Geolocation features

**Use Cases**:
- Store location visualization
- Delivery driver tracking
- Location-based search
- Distance calculation for deliveries

**Features**:
- Map rendering for store locations
- Driver real-time location tracking
- Geo-distance calculations
- Location-based store discovery

---

### D. Vercel Analytics
**Purpose**: Application performance monitoring

**Components**:
- `@vercel/analytics` package integration

**Tracking**:
- Page performance metrics
- User interactions
- Error tracking
- Conversion tracking

---

## 8. AUTHENTICATION & SECURITY

### JWT Token Flow

```
1. User Login
   POST /api/auth/login/
   ├── Body: { email, password }
   └── Response: { access, refresh, user }

2. Token Storage
   localStorage.setItem('access_token', token)
   localStorage.setItem('refresh_token', refresh)

3. API Requests
   Authorization: Bearer {access_token}

4. Token Refresh (Auto on 401)
   POST /api/auth/refresh/
   ├── Body: { refresh_token }
   └── Response: { access }

5. Logout
   Remove tokens from localStorage
   Redirect to login
```

### Role-Based Access Control

**Roles**:
- `ADMIN` - Platform administration
- `BUSINESS_OWNER` - Store management
- `PRO` - Advanced features
- `CLIENT` - Customer

**Route Protection**:
```typescript
<AuthGuard requiredRoles={['ADMIN', 'BUSINESS_OWNER']}>
  <ProtectedPage />
</AuthGuard>
```

### Endpoint Authorization

**Dashboard Admin Routes**:
- `/dashboard/admin/*` - Admin only
- User verification/banning
- Content moderation
- Fraud investigation

**Business Routes**:
- `/dashboard/orders` - Own orders
- `/dashboard/transactions` - Own payments
- `/dashboard/banners` - Own banners
- `/dashboard/analytics` - Own analytics

---

## 9. DATA FLOW PATTERNS

### A. Simple CRUD Flow

```
Component
    ↓
Hook (e.g., useOrders)
    ↓
API Client (lib/api.ts)
    ↓
Backend Django API
    ↓
Database
    ↓
[Response Path]
    ↓
Mapper (e.g., order-mapper.ts)
    ↓
Component State Update
    ↓
UI Re-render
```

### B. Authentication Flow

```
Login Form
    ↓
POST /api/auth/login/
    ↓
Backend validates credentials
    ↓
Return JWT access + refresh tokens
    ↓
Store in localStorage
    ↓
Redirect to dashboard
    ↓
All future requests use access_token
    ↓
On 401 → Refresh token
```

### C. Order Creation Flow

```
Customer Add to Cart
    ↓
Checkout Form
    ↓
POST /api/orders/
    ├── Items array
    ├── Address info
    ├── Payment method
    └── Coupon (optional)
    ↓
Backend validates inventory
    ↓
Create order record
    ↓
Process payment transaction
    ↓
Return Order with ID
    ↓
Frontend maps to Order type
    ↓
Update UI with order confirmation
    ↓
Emit order notification to store owner
```

### D. Real-time Updates (with Supabase)

```
Event Occurs (order status changed)
    ↓
Backend updates database
    ↓
Supabase detects change
    ↓
Broadcast via websocket
    ↓
Frontend subscribes to updates
    ↓
Trigger hook callback
    ↓
Update component state
    ↓
Re-render UI
```

---

## 10. KEY FEATURES BY MODULE

### Transactions Module
- Multi-type transactions (payment, refund, payout)
- Fee calculation
- Delivery metrics (distance, duration, wait time)
- Transaction timeline (creation → acceptance → delivery)
- Merchant payout tracking

### Banners Module
- Multiple placement options
- Date-based scheduling
- Priority ordering
- Analytics (impressions, clicks, CTR)
- Conversion rate tracking
- Status lifecycle management

### Promotions Module
- Percentage-based or custom text discounts
- Flexible targeting (all items or specific)
- Date validation
- Many-to-many item associations
- Active promotion filtering
- Statistics aggregation

### Fraud Detection
- Multi-type alerts (suspicious activity, fake reviews, payment fraud, etc.)
- Severity levels (critical to low)
- Risk scoring
- Investigation workflow
- False positive tracking
- Entity-agnostic (works with users, orders, businesses, products, reviews)

### Driver Management
- Document verification (license, insurance, background check)
- Vehicle tracking
- Real-time location services
- Performance metrics (rating, completion rate, avg delivery time)
- Earnings tracking and payouts
- Status management

### Reviews & Ratings
- Star ratings (1-5)
- Sentiment analysis
- Moderation workflow
- Helpful vote tracking
- Review visibility controls

---

## 11. DEVELOPMENT SETUP

### Environment Variables

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_CALENDLY_URL=...
NEXT_PUBLIC_MAPBOX_TOKEN=...
```

**Backend** (`.env`):
```
DEBUG=True
SECRET_KEY=...
DATABASE_URL=postgresql://...
JWT_SECRET=...
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Docker Setup

```bash
docker-compose up -d

# Runs:
# - PostgreSQL database
# - Django backend (port 8000)
# - Frontend dev server (port 3000)
```

### Quick Start

```bash
# Backend
cd backend
python manage.py migrate
python manage.py runserver

# Frontend
npm install
npm run dev
```

---

## 12. DEPLOYMENT & MONITORING

### Health Check
- `components/backend-status.tsx` - Backend status indicator
- `hooks/useBackendStatus.ts` - Health monitoring

### Monitoring
- System health dashboard
- API response times
- Database performance
- Error rate tracking
- Transaction success rates

### Analytics
- User behavior heatmaps
- Conversion funnel tracking
- Search analytics
- Business performance metrics
- Fraud detection metrics

---

## 13. FILE ORGANIZATION SUMMARY

```
saas/
├── app/                    # Next.js pages
├── components/             # React components
├── hooks/                  # Custom React hooks
├── contexts/               # React contexts (i18n, theme)
├── types/                  # TypeScript types
├── lib/                    # Utilities & mappers
├── styles/                 # Global styles
├── public/                 # Static assets
│
├── backend/                # Django project
│   ├── users/              # User app
│   ├── stores/             # Store app
│   ├── items/              # Items app
│   ├── orders/             # Orders app
│   ├── bookings/           # Bookings app
│   ├── transactions/       # Transactions app
│   ├── banners/            # Banners app
│   ├── promotions/         # Promotions app
│   ├── drivers/            # Drivers app
│   ├── reviews/            # Reviews app
│   ├── fraud/              # Fraud app
│   ├── support/            # Support app
│   ├── core/               # Core utilities
│   └── manage.py           # Django CLI
│
├── docker-compose.yml      # Container orchestration
├── package.json            # Frontend deps
├── requirements.txt        # Backend deps
└── README files            # Documentation
```

---

## 14. MAIN BUSINESS PROCESSES SUMMARY

### Revenue Streams
1. **Transaction Fees** - Commission on orders/bookings
2. **Seller Subscriptions** - Premium seller features
3. **Featured Listings** - Promoted store placement
4. **Advertising** - Banner placements

### Marketplace Operations
1. **Seller Onboarding** - Store verification, document checks
2. **Order Processing** - From creation to delivery
3. **Payment Management** - Secure transactions, payouts
4. **Quality Assurance** - Reviews, ratings, moderation
5. **Fraud Prevention** - Risk detection, alerts, investigation
6. **Delivery Logistics** - Driver management, tracking
7. **Marketing** - Banners, promotions, coupons

### Platform Control
1. **User Management** - Role-based access, account status
2. **Content Moderation** - Review/product flagging, hiding
3. **Business Compliance** - Verification, suspension, banning
4. **Support Operations** - Ticketing, escalation, resolution
5. **Analytics & Reporting** - Performance tracking, insights

---

## 15. NEXT STEPS & RECOMMENDATIONS

### For Feature Development
1. Identify the app where the feature belongs
2. Create backend model (if needed)
3. Create serializers and views
4. Add API endpoints
5. Create React hook for data fetching
6. Build frontend components
7. Add type definitions
8. Create data mappers if needed

### For Bug Fixes
1. Check backend app for business logic issues
2. Review API responses and error handling
3. Check frontend hooks for data mapping issues
4. Verify types match backend responses
5. Check component rendering logic

### For Performance Optimization
1. Implement pagination on large lists
2. Add caching in hooks (useMemo)
3. Optimize database queries (select_related, prefetch_related)
4. Implement lazy loading for images
5. Monitor with Vercel Analytics

---

**Document Last Updated**: May 15, 2026  
**Next Review**: August 2026
