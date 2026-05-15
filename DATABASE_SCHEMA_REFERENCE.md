# Complete Database Schema Reference

This document provides a comprehensive reference for all tables in the Ro2ya marketplace database.

---

## 1. Authentication Tables (Auth.js)

### auth.users
- **Purpose**: AuthJS user accounts
- **Columns**:
  - `id` (uuid, Primary Key)
  - `email` (text, unique)
  - `password_hash` (text)
  - `email_verified` (timestamp)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

### auth.sessions
- **Purpose**: AuthJS sessions
- **Columns**:
  - `id` (text, Primary Key)
  - `user_id` (uuid, Foreign Key → auth.users.id)
  - `expires` (timestamp)
  - `created_at` (timestamp)

### auth.verification_tokens
- **Purpose**: Email verification
- **Columns**:
  - `email` (text)
  - `token` (text, Primary Key)
  - `expires` (timestamp)

---

## 2. Django Authentication Tables

### auth_user
- **Purpose**: Django built-in user model (for Django admin)
- **Columns**:
  - `id` (integer, Primary Key)
  - `password` (varchar)
  - `last_login` (timestamp)
  - `is_superuser` (boolean)
  - `username` (varchar, unique)
  - `first_name` (varchar)
  - `last_name` (varchar)
  - `email` (varchar)
  - `is_staff` (boolean)
  - `is_active` (boolean)
  - `date_joined` (timestamp)

### auth_group
- **Purpose**: Django user groups
- **Columns**:
  - `id` (integer, Primary Key)
  - `name` (varchar, unique)

### auth_permission
- **Purpose**: Django permissions
- **Columns**:
  - `id` (integer, Primary Key)
  - `name` (varchar)
  - `content_type_id` (integer, FK)
  - `codename` (varchar)

### auth_user_groups
- **Purpose**: Many-to-Many: users ↔ groups
- **Columns**:
  - `id` (bigint, Primary Key)
  - `user_id` (integer, FK → auth_user.id)
  - `group_id` (integer, FK → auth_group.id)

### auth_group_permissions
- **Purpose**: Many-to-Many: groups ↔ permissions
- **Columns**:
  - `id` (bigint, Primary Key)
  - `group_id` (integer, FK → auth_group.id)
  - `permission_id` (integer, FK → auth_permission.id)

### auth_user_user_permissions
- **Purpose**: Many-to-Many: users ↔ permissions
- **Columns**:
  - `id` (bigint, Primary Key)
  - `user_id` (integer, FK → auth_user.id)
  - `permission_id` (integer, FK → auth_permission.id)

---

## 3. Platform User Tables

### users
- **Purpose**: Extended user profile (linked to auth.users)
- **Columns**:
  - `id` (uuid, Primary Key, FK → auth.users.id)
  - `role` (enum: ADMIN, BUSINESS_OWNER, PRO, CLIENT) - Default: CLIENT
  - `full_name` (text)
  - `phone` (text)
  - `avatar_url` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `city` (text)
  - `address` (text)
  - `email` (text)
  - `status` (varchar: active, suspended, banned, inactive) - Default: active
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

### profiles
- **Purpose**: Supabase auth profiles
- **Columns**:
  - `id` (uuid, Primary Key, FK → auth.users.id)
  - `full_name` (text)
  - `role` (text: admin, business_owner, PRO, client) - Default: client
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

### user_preferences
- **Purpose**: User content preferences
- **Columns**:
  - `id` (bigint, Primary Key)
  - `user_id` (uuid, FK → users.id)
  - `category` (varchar)
  - `score` (double precision)

### user_interactions
- **Purpose**: Track user interactions with content
- **Columns**:
  - `id` (bigint, Primary Key)
  - `user_id` (uuid, FK → users.id)
  - `reel_id` (bigint, FK → reels.id)
  - `type` (text: view, like, click, contact)
  - `created_at` (timestamp)

---

## 4. Store Management Tables

### stores
- **Purpose**: Business establishments
- **Columns**:
  - `id` (bigint, Primary Key)
  - `owner_id` (uuid, FK → users.id)
  - `name` (text)
  - `slug` (text, unique)
  - `description` (text)
  - `category` (enum: RESTAURANT, SHOP, SERVICE, OTHER) - Default: OTHER
  - `phone` (text)
  - `email` (text)
  - `website` (text)
  - `address` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `city` (text)
  - `logo_url` (text)
  - `banner_url` (text)
  - `status` (enum: PENDING, VERIFIED, REJECTED, SUSPENDED)
  - `business_license_url` (text)
  - `id_card_url` (text)
  - `verification_notes` (text)
  - `rating_average` (numeric, default 0.0)
  - `total_reviews` (integer, default 0)
  - `total_orders` (integer, default 0)
  - `view_count` (integer, default 0)
  - `sentiment_positive_percent` (numeric, default 0.0)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - `verified_at` (timestamp)
  - `business_directory_id` (bigint, FK → business_directory_tunisia.id)
  - `business_registration` (text)
  - `rne` (text, unique)
  - `id_business` (bigint, unique, FK → business_directory_tunisia.id)
  - `opening_hours` (jsonb)
  - `gallery` (jsonb)
  - `service_id` (bigint, unique, FK → service_directory.service_id)

### business_directory_tunisia
- **Purpose**: Business directory/listing data
- **Columns**:
  - `id` (bigint, Primary Key)
  - `title` (text)
  - `totalScore` (numeric)
  - `reviewsCount` (integer)
  - `street` (text)
  - `city` (text)
  - `state` (text)
  - `countryCode` (text) - Default: TN
  - `website` (text)
  - `phone` (text)
  - `categories` (array)
  - `url` (text)
  - `categoryName` (text)
  - `place_id` (text, unique)
  - `vitrine_category` (text)
  - `full_address` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `is_claimed` (boolean) - Default: false
  - `claimed_at` (timestamp)
  - `claimed_by` (uuid, FK → users.id)
  - `store_id` (bigint, FK → stores.id)
  - `scraped_at` (timestamp)
  - `last_updated` (timestamp)
  - `data_source` (text) - Default: Google Maps
  - `verified` (boolean) - Default: false
  - `business_status` (text) - Default: OPERATIONAL
  - `description` (text)
  - `opening_hours` (jsonb)
  - `photos` (array)
  - `tags` (array)

### service_directory
- **Purpose**: Service provider directory
- **Columns**:
  - `service_id` (bigint, Primary Key)
  - `owner_id` (uuid, FK → users.id)
  - `name` (text)
  - `slug` (text, unique)
  - `description` (text)
  - `category` (text)
  - `phone` (text)
  - `address` (text)
  - `city` (text)
  - `latitude` (double precision)
  - `longitude` (double precision)
  - `status` (text) - Default: ACTIVE
  - `rating_average` (double precision) - Default: 0.0
  - `total_reviews` (integer) - Default: 0
  - `opening_hours` (jsonb)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

### saved_places
- **Purpose**: User-saved stores/places
- **Columns**:
  - `id` (bigint, Primary Key)
  - `user_id` (uuid, FK → auth.users.id)
  - `store_id` (bigint, FK → stores.id)
  - `created_at` (timestamp)

---

## 5. Items Tables (Products & Services)

### items
- **Purpose**: Products and Services catalog
- **Columns**:
  - `id` (bigint, Primary Key)
  - `item_type` (enum: PRODUCT, SERVICE) - Default: PRODUCT
  - `name` (text)
  - `slug` (text)
  - `description` (text)
  - `price` (numeric)
  - `price_unit` (varchar: unit, hour, day, session) - Default: unit
  - `stock_quantity` (integer) - For products
  - `duration_minutes` (integer) - For services
  - `is_bookable` (boolean) - Default: false
  - `available_days` (jsonb) - Service availability
  - `status` (enum: AVAILABLE, HIDDEN, FLAGGED, BANNED) - Default: AVAILABLE
  - `main_image` (text)
  - `image_2` (text)
  - `image_3` (text)
  - `view_count` (integer) - Default: 0
  - `order_count` (integer) - Default: 0
  - `booking_count` (integer) - Default: 0
  - `rating_average` (numeric) - Default: 0.0
  - `total_reviews` (integer) - Default: 0
  - `embedding` (embedding type) - Vector for search
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - `store_id` (bigint, FK → stores.id)

### service_schedules
- **Purpose**: Service availability schedules
- **Columns**:
  - `id` (bigint, Primary Key)
  - `item_id` (bigint, FK → items.id)
  - `day_of_week` (integer: 0-6)
  - `start_time` (time)
  - `end_time` (time)
  - `max_bookings` (integer) - Default: 1
  - `is_active` (boolean) - Default: true
  - `created_at` (timestamp)

---

## 6. Order & Transaction Tables

### orders
- **Purpose**: Customer orders for products
- **Columns**:
  - `id` (bigint, Primary Key)
  - `order_number` (text, unique)
  - `customer_id` (uuid, FK → users.id)
  - `store_id` (bigint, FK → stores.id)
  - `item_id` (bigint, FK → items.id)
  - `quantity` (integer) - Default: 1
  - `unit_price` (numeric)
  - `total_price` (numeric)
  - `customer_name` (text)
  - `customer_phone` (text)
  - `customer_email` (text)
  - `delivery_address` (text)
  - `customer_notes` (text)
  - `vendor_notes` (text)
  - `status` (enum: PENDING, VALIDATED, COMPLETED, CANCELLED)
  - `tracking_code` (text)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - `validated_at` (timestamp)
  - `completed_at` (timestamp)

### bookings
- **Purpose**: Service bookings/reservations
- **Columns**:
  - `id` (bigint, Primary Key)
  - `booking_number` (text, unique)
  - `item_id` (bigint, FK → items.id)
  - `customer_id` (uuid, FK → users.id)
  - `store_id` (bigint, FK → stores.id)
  - `booking_date` (date)
  - `start_time` (time)
  - `end_time` (time)
  - `duration_minutes` (integer)
  - `customer_name` (text)
  - `customer_phone` (text)
  - `customer_email` (text)
  - `notes` (text)
  - `price` (numeric)
  - `status` (enum: PENDING, CONFIRMED, COMPLETED, CANCELLED) - Default: PENDING
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - `confirmed_at` (timestamp)
  - `completed_at` (timestamp)

### transactions
- **Purpose**: Payment and financial transactions
- **Columns**:
  - `id` (uuid, Primary Key)
  - `transaction_code` (varchar, unique)
  - `order_number` (varchar)
  - `booking_id` (bigint, FK → bookings.id)
  - `customer_id` (uuid, FK → auth.users.id)
  - `customer_name` (varchar)
  - `merchant_id` (bigint, FK → stores.id)
  - `merchant_number` (varchar)
  - `merchant_name` (varchar)
  - `driver_name` (varchar)
  - `drop_location` (varchar)
  - `amount` (numeric)
  - `fee` (numeric)
  - `status` (enum: pending, completed, failed, refunded)
  - `type` (enum: payment, refund, payout)
  - `date` (timestamp)
  - `time_created` (timestamp)
  - `time_accepted` (timestamp)
  - `collection_time` (timestamp)
  - `pickup_time` (timestamp)
  - `time_delivered` (timestamp)
  - `wait_duration_minutes` (integer)
  - `delivery_duration_minutes` (integer)
  - `km` (numeric)
  - `qr_code_token` (varchar, unique)

---

## 7. Promotion Tables

### promotions
- **Purpose**: Store promotions and discounts
- **Columns**:
  - `id` (bigint, Primary Key)
  - `store_id` (bigint, FK → stores.id)
  - `title` (text)
  - `description` (text)
  - `discount_percent` (numeric) - 0-100
  - `discount_text` (text) - Custom discount text
  - `valid_from` (date)
  - `valid_until` (date)
  - `active` (boolean) - Default: true
  - `created_at` (timestamp)
  - `item_id` (bigint, FK → items.id) - Optional: specific item
  - `apply_to_all` (boolean) - Default: false

### promotion_items
- **Purpose**: Many-to-Many: promotions ↔ items
- **Columns**:
  - `promotion_id` (bigint, FK → promotions.id)
  - `item_id` (bigint, FK → items.id)
  - Primary Key: (promotion_id, item_id)

---

## 8. Review and Rating Tables

### reviews
- **Purpose**: Customer reviews for items
- **Columns**:
  - `id` (bigint, Primary Key)
  - `author_id` (uuid, FK → users.id)
  - `item_id` (bigint, FK → items.id)
  - `store_id` (bigint, FK → stores.id)
  - `order_id` (bigint, FK → orders.id)
  - `booking_id` (bigint, FK → bookings.id)
  - `rating` (integer: 1-5)
  - `title` (text)
  - `comment` (text)
  - `image_1` (text)
  - `image_2` (text)
  - `is_verified` (boolean) - Default: false
  - `qr_token` (text, unique)
  - `qr_scanned_at` (timestamp)
  - `sentiment_score` (numeric)
  - `sentiment_label` (enum: positive, negative, neutral)
  - `vendor_response` (text)
  - `vendor_response_ai_suggestion` (text)
  - `responded_at` (timestamp)
  - `is_approved` (boolean) - Default: true
  - `is_spam` (boolean) - Default: false
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

---

## 9. Content Tables (Reels & Stories)

### reels
- **Purpose**: Short video/image content (TikTok-like)
- **Columns**:
  - `id` (bigint, Primary Key)
  - `store_id` (bigint, FK → stores.id)
  - `media_url` (text)
  - `media_type` (text: image, video)
  - `title` (varchar)
  - `subtitle` (varchar)
  - `price` (numeric)
  - `currency` (varchar) - Default: TND
  - `cta_type` (text: call, whatsapp, view)
  - `cta_value` (text)
  - `category` (varchar)
  - `is_sponsored` (boolean) - Default: false
  - `status` (text) - Default: active
  - `created_at` (timestamp)

### reel_stats
- **Purpose**: Reel performance metrics
- **Columns**:
  - `reel_id` (bigint, Primary Key, FK → reels.id)
  - `views_count` (integer) - Default: 0
  - `likes_count` (integer) - Default: 0
  - `clicks_count` (integer) - Default: 0
  - `contact_count` (integer) - Default: 0
  - `updated_at` (timestamp)

### stories
- **Purpose**: Temporary content (24-hour stories)
- **Columns**:
  - `id` (bigint, Primary Key)
  - `store_id` (bigint, FK → stores.id)
  - `author_id` (uuid, FK → auth.users.id)
  - `media_url` (text)
  - `media_type` (text: image, video) - Default: image
  - `caption` (text)
  - `views_count` (integer) - Default: 0
  - `is_approved` (boolean) - Default: true
  - `expires_at` (timestamp) - Default: now + 24h
  - `created_at` (timestamp)

### story_views
- **Purpose**: Track who viewed stories
- **Columns**:
  - `id` (bigint, Primary Key)
  - `story_id` (bigint, FK → stories.id)
  - `viewer_id` (uuid, FK → auth.users.id)
  - `viewed_at` (timestamp)

---

## 10. Driver & Logistics Tables

### drivers
- **Purpose**: Delivery driver profiles
- **Columns**:
  - `id` (uuid, Primary Key)
  - `name` (text)
  - `email` (text, unique)
  - `phone` (text)
  - `status` (text: active, inactive, suspended, on-break, offline)
  - `address` (text)
  - `city` (text)
  - `postal_code` (text)
  - `country` (text)
  - Vehicle Info:
    - `vehicle_type` (text: motorcycle, car, van, truck)
    - `vehicle_license_plate` (text, unique)
    - `vehicle_make` (text)
    - `vehicle_model` (text)
    - `vehicle_year` (integer)
    - `vehicle_capacity_kg` (integer) - Default: 50
    - `vehicle_status` (text: active, inactive, maintenance)
    - `vehicle_last_inspection` (timestamp)
  - Documents:
    - `license_status` (text: pending, verified, rejected, expired)
    - `license_expiry_date` (date)
    - `license_verified_at` (timestamp)
    - `id_status` (text: pending, verified, rejected, expired)
    - `id_expiry_date` (date)
    - `id_verified_at` (timestamp)
    - `insurance_status` (text)
    - `insurance_expiry_date` (date)
    - `insurance_verified_at` (timestamp)
    - `registration_status` (text)
    - `registration_expiry_date` (date)
    - `registration_verified_at` (timestamp)
    - `background_check_status` (text)
    - `background_check_expiry_date` (date)
    - `background_check_verified_at` (timestamp)
  - Performance:
    - `total_deliveries` (integer) - Default: 0
    - `rating` (numeric: 0-5) - Default: 5.0
    - `completion_rate` (numeric: 0-100) - Default: 100.0
    - `avg_delivery_time_minutes` (integer) - Default: 0
    - `acceptance_rate` (numeric: 0-100) - Default: 100.0
  - Location:
    - `current_lat` (numeric)
    - `current_lng` (numeric)
    - `current_address` (text)
    - `location_updated_at` (timestamp)
  - Finance:
    - `bank_name` (text)
    - `account_number` (text)
    - `account_holder` (text)
    - `total_earnings` (numeric) - Default: 0
    - `earnings_this_month` (numeric) - Default: 0
    - `earnings_this_week` (numeric) - Default: 0
    - `last_payout_date` (timestamp)
  - Timestamps:
    - `join_date` (timestamp)
    - `last_active` (timestamp)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

---

## 11. Support Tables

### support_tickets
- **Purpose**: Customer support tickets
- **Columns**:
  - `id` (uuid, Primary Key)
  - `ticket_number` (integer, unique, auto-sequence)
  - `store_id` (bigint, FK → stores.id)
  - `customer_id` (uuid, FK → auth.users.id)
  - `customer_name` (text)
  - `subject` (text)
  - `priority` (enum: low, medium, high, urgent) - Default: medium
  - `status` (enum: open, in_progress, waiting, resolved, closed) - Default: open
  - `channel` (enum: chat, email, phone) - Default: chat
  - `assigned_to` (uuid, FK → auth.users.id)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - `last_reply_at` (timestamp)

### support_messages
- **Purpose**: Messages in support tickets
- **Columns**:
  - `id` (uuid, Primary Key)
  - `ticket_id` (uuid, FK → support_tickets.id)
  - `sender_id` (uuid, FK → auth.users.id)
  - `sender_type` (text: customer, support)
  - `content` (text)
  - `is_read` (boolean) - Default: false
  - `created_at` (timestamp)

---

## 12. Sponsorship & Advertising

### sponsored_campaigns
- **Purpose**: Ad campaigns
- **Columns**:
  - `id` (bigint, Primary Key)
  - `store_id` (bigint, FK → stores.id)
  - `budget` (numeric)
  - `start_date` (timestamp)
  - `end_date` (timestamp)
  - `status` (text) - Default: active
  - `created_at` (timestamp)

### reel_sponsorships
- **Purpose**: Many-to-Many: reels ↔ campaigns
- **Columns**:
  - `id` (bigint, Primary Key)
  - `reel_id` (bigint, FK → reels.id)
  - `campaign_id` (bigint, FK → sponsored_campaigns.id)
  - `priority_score` (integer) - Default: 1

---

## 13. Subscription & Billing

### subscriptions
- **Purpose**: User subscriptions/memberships
- **Columns**:
  - `id` (bigint, Primary Key)
  - `user_id` (uuid, FK → users.id)
  - `plan_name` (text)
  - `price` (numeric) - Default: 0
  - `current_period_start` (timestamp)
  - `current_period_end` (timestamp)
  - `status` (text) - Default: ACTIVE
  - `auto_renew` (boolean) - Default: true
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

---

## 14. Django System Tables

### django_content_type
- **Purpose**: Content type registry
- **Columns**:
  - `id` (integer, Primary Key)
  - `app_label` (varchar)
  - `model` (varchar)

### django_migrations
- **Purpose**: Migration history
- **Columns**:
  - `id` (bigint, Primary Key)
  - `app` (varchar)
  - `name` (varchar)
  - `applied` (timestamp)

### django_session
- **Purpose**: Django sessions
- **Columns**:
  - `session_key` (varchar, Primary Key)
  - `session_data` (text)
  - `expire_date` (timestamp)

### django_admin_log
- **Purpose**: Admin activity log
- **Columns**:
  - `id` (integer, Primary Key)
  - `action_time` (timestamp)
  - `object_id` (text)
  - `object_repr` (varchar)
  - `action_flag` (smallint)
  - `change_message` (text)
  - `content_type_id` (integer)
  - `user_id` (integer)

---

## 15. Spatial Reference

### spatial_ref_sys
- **Purpose**: PostGIS spatial reference system
- **Columns**:
  - `srid` (integer, Primary Key)
  - `auth_name` (varchar)
  - `auth_srid` (integer)
  - `srtext` (varchar)
  - `proj4text` (varchar)

---

## Query Examples

### Get all items for a store
```sql
SELECT * FROM items WHERE store_id = 1 ORDER BY created_at DESC;
```

### Get active promotions today
```sql
SELECT * FROM promotions 
WHERE active = true 
AND valid_from <= CURRENT_DATE 
AND valid_until >= CURRENT_DATE 
ORDER BY discount_percent DESC;
```

### Get store with highest reviews
```sql
SELECT * FROM stores 
ORDER BY total_reviews DESC, rating_average DESC 
LIMIT 1;
```

### Get driver performance
```sql
SELECT id, name, rating, total_deliveries, completion_rate 
FROM drivers 
WHERE status = 'active' 
ORDER BY rating DESC;
```

### Get pending support tickets
```sql
SELECT * FROM support_tickets 
WHERE status IN ('open', 'in_progress') 
ORDER BY priority DESC, created_at ASC;
```

---

## JSON Field Examples

### Store opening_hours
```json
{
  "monday": {"open": "09:00", "close": "18:00"},
  "tuesday": {"open": "09:00", "close": "18:00"},
  "wednesday": {"open": "09:00", "close": "20:00"},
  "thursday": {"open": "09:00", "close": "18:00"},
  "friday": {"open": "09:00", "close": "21:00"},
  "saturday": {"open": "10:00", "close": "19:00"},
  "sunday": {"open": "closed"}
}
```

### Item available_days (service)
```json
{
  "monday": true,
  "tuesday": true,
  "wednesday": true,
  "thursday": true,
  "friday": true,
  "saturday": false,
  "sunday": false
}
```

---

## Enum Types

### USER ROLES
- ADMIN
- BUSINESS_OWNER
- PRO
- CLIENT

### STORE STATUS
- PENDING
- VERIFIED
- REJECTED
- SUSPENDED

### STORE CATEGORY
- RESTAURANT
- SHOP
- SERVICE
- OTHER

### ITEM STATUS
- AVAILABLE
- HIDDEN
- FLAGGED
- BANNED

### ITEM TYPE
- PRODUCT
- SERVICE

### ORDER STATUS
- PENDING
- VALIDATED
- COMPLETED
- CANCELLED

### BOOKING STATUS
- PENDING
- CONFIRMED
- COMPLETED
- CANCELLED

### TRANSACTION STATUS
- pending
- completed
- failed
- refunded

### SENTIMENT LABEL
- positive
- negative
- neutral

### SUPPORT PRIORITY
- low
- medium
- high
- urgent

### SUPPORT STATUS
- open
- in_progress
- waiting
- resolved
- closed

### DRIVER STATUS
- active
- inactive
- suspended
- on-break
- offline

---

## Relationships Summary

**User Ecosystem**
- auth.users ← users (1:1)
- users ← stores (1:N) - owner_id
- users ← drivers (1:1)
- users ← reviews (1:N) - author_id
- users ← orders (1:N) - customer_id
- users ← bookings (1:N) - customer_id
- users ← subscriptions (1:N)

**Store Ecosystem**
- stores ← items (1:N)
- stores ← orders (1:N)
- stores ← bookings (1:N)
- stores ← reviews (1:N)
- stores ← promotions (1:N)
- stores ← reels (1:N)
- stores ← stories (1:N)
- stores ← support_tickets (1:N)

**Item Ecosystem**
- items ← reviews (1:N)
- items ← orders (1:N)
- items ← bookings (1:N)
- items ← service_schedules (1:N)
- items ← promotions (M:N via promotion_items)

**Financial**
- orders ← transactions (1:1)
- bookings ← transactions (1:N)
- stores ← subscriptions (N:1)

**Content**
- reels ← reel_stats (1:1)
- reels ← reel_sponsorships (1:N)
- sponsored_campaigns ← reel_sponsorships (1:N)
- stories ← story_views (1:N)

---

## Indexes Recommendations

```sql
-- Performance indexes
CREATE INDEX idx_items_store_id ON items(store_id);
CREATE INDEX idx_items_item_type ON items(item_type);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_bookings_store_id ON bookings(store_id);
CREATE INDEX idx_reviews_item_id ON reviews(item_id);
CREATE INDEX idx_reviews_store_id ON reviews(store_id);
CREATE INDEX idx_promotions_store_id ON promotions(store_id);
CREATE INDEX idx_promotions_valid_dates ON promotions(valid_from, valid_until);
```

---

## Last Updated
April 7, 2026

