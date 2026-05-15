# Database Schema Reference
# This file documents the database structure for reference and development

## Promotions Table Structure

```sql
CREATE TABLE public.promotions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  store_id bigint NOT NULL,
  title text NOT NULL,
  description text,
  discount_percent numeric,
  discount_text text,
  valid_from date NOT NULL,
  valid_until date NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  item_id bigint,
  apply_to_all boolean DEFAULT false,
  CONSTRAINT promotions_pkey PRIMARY KEY (id),
  CONSTRAINT promotions_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id),
  CONSTRAINT promotions_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id)
);
```

## Promotion Items (Many-to-Many) Table Structure

```sql
CREATE TABLE public.promotion_items (
  promotion_id bigint NOT NULL,
  item_id bigint NOT NULL,
  CONSTRAINT promotion_items_pkey PRIMARY KEY (promotion_id, item_id),
  CONSTRAINT promotion_items_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotions(id),
  CONSTRAINT promotion_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id)
);
```

## Related Tables (for reference)

### Stores Table
- id: bigint (Primary Key)
- owner_id: uuid (Foreign Key → users.id)
- name: text
- slug: text (Unique)
- description: text
- category: store_category enum
- phone: text
- email: text
- website: text
- address: text
- latitude: numeric
- longitude: numeric
- city: text
- logo_url: text
- banner_url: text
- status: store_status enum
- business_license_url: text
- id_card_url: text
- verification_notes: text
- rating_average: numeric
- total_reviews: integer
- total_orders: integer
- view_count: integer
- sentiment_positive_percent: numeric
- created_at: timestamp with timezone
- updated_at: timestamp with timezone
- verified_at: timestamp with timezone
- business_directory_id: bigint
- business_registration: text
- rne: text (Unique)
- id_business: bigint (Unique)
- opening_hours: jsonb
- gallery: jsonb
- service_id: bigint (Unique)

### Items Table
- id: bigint (Primary Key)
- item_type: item_type enum (PRODUCT or SERVICE)
- name: text
- slug: text
- description: text
- price: numeric
- price_unit: character varying (unit, hour, day, session)
- stock_quantity: integer (For products)
- duration_minutes: integer (For services)
- is_bookable: boolean
- available_days: jsonb
- status: item_status enum (AVAILABLE, HIDDEN, FLAGGED, BANNED)
- main_image: text
- image_2: text
- image_3: text
- view_count: integer
- order_count: integer
- booking_count: integer
- rating_average: numeric
- total_reviews: integer
- embedding: embedding type
- created_at: timestamp with timezone
- updated_at: timestamp with timezone
- store_id: bigint (Foreign Key → stores.id)

### Users Table
- id: uuid (Primary Key, Foreign Key → auth.users.id)
- role: user_role enum (ADMIN, BUSINESS_OWNER, PRO, CLIENT)
- full_name: text
- phone: text
- avatar_url: text
- latitude: numeric
- longitude: numeric
- city: text
- address: text
- email: text
- status: character varying (active, suspended, banned, inactive)
- created_at: timestamp with timezone
- updated_at: timestamp with timezone

## Key Relationships

1. **Promotion → Store**: Many promotions per store
2. **Promotion → Item**: 
   - Optional: Single item (if apply_to_all = false)
   - Or multiple items via promotion_items junction table
3. **Promotion Items Junction**:
   - Links promotions to multiple items (Many-to-Many)
   - Allows bulk promotions on multiple products/services

## Promotion Fields Explanation

- `id`: Auto-generated primary key
- `store_id`: Owner of the promotion (Required)
- `title`: Promotion name (Required)
- `description`: Promotion details
- `discount_percent`: Discount percentage (e.g., 20 for 20%)
- `discount_text`: Custom discount text (e.g., "Buy 2 Get 1 Free")
- `valid_from`: Start date (Required)
- `valid_until`: End date (Required)
- `active`: Whether promotion is currently active (Default: true)
- `created_at`: Creation timestamp
- `item_id`: Optional - specific item for the promotion
- `apply_to_all`: Boolean to indicate if promotion applies to all items in store

## Notes for Django Development

- `managed = False` - We're mapping to an existing database table
- Use `db_column` for exact field name mapping if model field names differ
- Implement property methods for calculated fields
- Use Django serializers for API responses
- Pagination recommended for list views (large number of promotions)
- JWT authentication required for all endpoints
- Timestamp fields are timezone-aware (auto_now_add, auto_now)
