# Banners App - API Documentation

## Overview

The **Banners** app manages promotional banners across the marketplace. It provides complete CRUD operations, analytics tracking (impressions/clicks), and filtering capabilities.

**Database Table**: `banners` (managed=False - existing table)  
**Status**: ✅ Production Ready

---

## Architecture

### Models

#### **Banner Model**
Maps to the PostgreSQL `banners` table with the following features:
- Store association (store_id FK)
- Placement targeting (homepage, category, checkout, popup)
- Status management (draft, scheduled, active, inactive, expired)
- Analytics tracking (impressions, clicks)
- Date-based scheduling (start_date, end_date)
- Priority ordering
- Conversion rate tracking

**Property Methods**:
- `is_active` - Currently active based on status and date range
- `is_upcoming` - Scheduled but not yet active
- `is_expired` - Past end_date
- `days_remaining` - Days until expiration
- `click_rate` - Calculated CTR (clicks / impressions)

**Action Methods**:
- `record_impression()` - Increment impression counter
- `record_click()` - Increment click counter

---

## Serializers

### BannerListSerializer
**Purpose**: Lightweight serializer for banner listings  
**Fields**: 24 fields including computed properties (click_rate, is_active, days_remaining)  
**Read-only**: id, created_at, all computed fields  
**Use Case**: GET /api/banners/ endpoint

### BannerDetailSerializer
**Purpose**: Full details for single banner view  
**Fields**: 29 fields (all model fields + computed properties)  
**Read-only**: id, created_at, updated_at, all computed fields  
**Use Case**: GET /api/banners/{id}/ endpoint

### BannerCreateUpdateSerializer
**Purpose**: Validation for create/update operations  
**Required Fields**: store_id, title, placement, status, start_date, end_date  
**Optional Fields**: description, image_url, target_url, priority, conversion_rate, created_by  
**Validation**:
  - start_date must be ≤ end_date
  - priority must be non-negative
  - conversion_rate must be between 0 and 1
**Use Case**: POST/PUT endpoints

---

## API Endpoints

### 1. List/Create Banners
```
GET  /api/banners/
POST /api/banners/
```

**GET Parameters**:
- `store_id` (integer) - Filter by store
- `status` (string) - Filter by status (draft, scheduled, active, inactive, expired)
- `placement` (string) - Filter by placement (homepage, category, checkout, popup)

**GET Response** (200 OK):
```json
{
  "count": 12,
  "results": [
    {
      "id": 1,
      "store_id": 5,
      "title": "Summer Sale",
      "placement": "homepage",
      "placement_display": "Home Page",
      "status": "active",
      "status_display": "Active",
      "priority": 1,
      "start_date": "2026-04-01",
      "end_date": "2026-06-30",
      "impressions": 15000,
      "clicks": 450,
      "click_rate": 0.03,
      "conversion_rate": 0.015,
      "is_active": true,
      "is_upcoming": false,
      "is_expired": false,
      "days_remaining": 84,
      "created_at": "2026-04-07T10:30:00Z"
    }
  ]
}
```

**POST Request Body** (201 Created):
```json
{
  "store_id": 5,
  "title": "New Promotion",
  "description": "Limited time offer",
  "image_url": "https://example.com/banner.jpg",
  "target_url": "/promotions/new-offer",
  "placement": "homepage",
  "status": "scheduled",
  "priority": 2,
  "start_date": "2026-04-15",
  "end_date": "2026-05-15",
  "conversion_rate": 0.02,
  "created_by": "admin"
}
```

### 2. Retrieve/Update/Delete Banner
```
GET    /api/banners/{id}/
PUT    /api/banners/{id}/
DELETE /api/banners/{id}/
```

**GET Response** (200 OK):
```json
{
  "id": 1,
  "store_id": 5,
  "title": "Summer Sale",
  "description": "Get 30% off on all products",
  "image_url": "https://example.com/summer.jpg",
  "target_url": "/summer-sale",
  "placement": "homepage",
  "placement_display": "Home Page",
  "status": "active",
  "status_display": "Active",
  "priority": 1,
  "start_date": "2026-04-01",
  "end_date": "2026-06-30",
  "impressions": 15000,
  "clicks": 450,
  "click_rate": 0.03,
  "conversion_rate": 0.015,
  "is_active": true,
  "is_upcoming": false,
  "is_expired": false,
  "days_remaining": 84,
  "created_at": "2026-04-07T10:30:00Z",
  "updated_at": "2026-04-07T10:30:00Z",
  "created_by": "admin"
}
```

**PUT Request Body** (200 OK):
```json
{
  "title": "Updated Summer Sale",
  "priority": 3,
  "status": "active"
}
```

**DELETE Response** (204 No Content): Empty

### 3. List Banners by Store
```
GET /api/banners/store/{store_id}/
```

**Query Parameters**:
- `status` (optional) - Filter by status
- `placement` (optional) - Filter by placement

**Response** (200 OK):
```json
{
  "store_id": 5,
  "count": 3,
  "results": [...]
}
```

### 4. List Active Banners
```
GET /api/banners/active/
```

**Query Parameters**:
- `store_id` (optional) - Filter by store
- `placement` (optional) - Filter by placement

**Response** (200 OK):
```json
{
  "count": 2,
  "results": [...]
}
```

**Note**: Returns only banners where:
- status = 'active'
- start_date ≤ today
- end_date ≥ today

### 5. Banner Statistics
```
GET /api/banners/stats/
```

**Query Parameters**:
- `store_id` (optional) - Filter by store

**Response** (200 OK):
```json
{
  "total_banners": 12,
  "active_banners": 3,
  "scheduled_banners": 2,
  "expired_banners": 1,
  "total_impressions": 125000,
  "total_clicks": 3750,
  "avg_click_rate": 0.03
}
```

### 6. Record Banner Impression
```
POST /api/banners/{id}/impression/
```

**Response** (200 OK):
```json
{
  "message": "Impression recorded",
  "impressions": 15001
}
```

### 7. Record Banner Click
```
POST /api/banners/{id}/click/
```

**Response** (200 OK):
```json
{
  "message": "Click recorded",
  "clicks": 451
}
```

---

## Status Values

| Status | Description | Active? |
|--------|-------------|---------|
| draft | Not yet published | No |
| scheduled | Scheduled for future | No (unless dates match) |
| active | Currently active | Yes (if date range valid) |
| inactive | Temporarily inactive | No |
| expired | Past end date | No |

---

## Placement Values

| Placement | Display Location |
|-----------|------------------|
| homepage | Home page header/hero |
| category | Category page |
| checkout | Checkout page |
| popup | Modal/popup overlay |

---

## Authentication

All endpoints require JWT authentication via:
```
Authorization: Bearer <token>
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Start date must be before end date."
}
```

### 404 Not Found
```json
{
  "detail": "Banner not found."
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Django Admin Interface

**URL**: `/admin/banners/banner/`

**Features**:
- Full CRUD operations
- Filters by status, placement, priority, dates
- Search by title or description
- Read-only analytics display (impressions, clicks, CTR)
- Display of computed properties (is_active, is_expired, days_remaining)

---

## Example Usage

### Get All Banners for Store
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/banners/store/5/"
```

### Create New Banner
```bash
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "store_id": 5,
    "title": "Flash Sale",
    "placement": "homepage",
    "status": "active",
    "start_date": "2026-04-10",
    "end_date": "2026-04-20"
  }' \
  "http://localhost:8000/api/banners/"
```

### Record Impression/Click
```bash
# Record impression
curl -X POST -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/banners/1/impression/"

# Record click
curl -X POST -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/banners/1/click/"
```

### Get Active Banners
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/banners/active/?store_id=5&placement=homepage"
```

### Get Statistics
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/banners/stats/?store_id=5"
```

---

## Database Schema Reference

```sql
CREATE TABLE banners (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES stores(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    target_url TEXT,
    placement VARCHAR(50),
    status VARCHAR(50) DEFAULT 'draft',
    priority INTEGER DEFAULT 1,
    start_date DATE,
    end_date DATE,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversion_rate NUMERIC(5,4) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);
```

---

## Integration Notes

- **Managed Database**: The Banner model uses `managed=False` to map to existing PostgreSQL table
- **No Migrations**: Uses existing table schema, no migrations needed
- **Analytics Tracking**: Impressions and clicks tracked in real-time
- **Time-based Status**: Status calculated from dates, not stored as fixed value
- **Store Isolation**: All banners filtered by store_id for multi-tenant support

---

## Last Updated
April 7, 2026
