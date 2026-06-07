# Fraud Detection & Alert System - Implementation Guide

## Overview

The Fraud Detection and Alert System is a comprehensive solution for monitoring and managing fraudulent activities within the platform. It tracks suspicious activities for both **bookings** and **orders** with AI-powered scoring and recommendations.

## Database Schema

### Tables Created

#### 1. `booking_fraud_checks`
Stores fraud analysis results for bookings.

**Columns:**
- `id` (UUID): Primary key
- `booking_id` (BIGINT): Foreign key to bookings table (UNIQUE)
- `score` (INTEGER): Risk score 0-100
- `level` (TEXT): Risk level ('safe', 'suspicious', 'high_risk', 'blocked')
- `signals` (JSONB): Array of detected suspicious signals/flags
- `recommendation` (TEXT): Action recommendation ('approve', 'review', 'reject')
- `ai_reasoning` (TEXT): Explanation of the fraud score (nullable)
- `checked_at` (TIMESTAMP): When the check was performed

**Indexes:**
- `booking_id` (UNIQUE)
- `level` (for filtering by risk level)
- `checked_at` (DESC, for recent alerts)

#### 2. `order_fraud_checks`
Stores fraud analysis results for orders.

**Columns:**
- `id` (UUID): Primary key
- `order_id` (BIGINT): Foreign key to orders table (UNIQUE)
- `score` (INTEGER): Risk score 0-100
- `level` (TEXT): Risk level ('safe', 'suspicious', 'high_risk', 'blocked')
- `signals` (JSONB): Array of detected suspicious signals/flags
- `recommendation` (TEXT): Action recommendation ('approve', 'review', 'reject')
- `ai_reasoning` (TEXT): Explanation of the fraud score (nullable)
- `checked_at` (TIMESTAMP): When the check was performed

**Indexes:**
- `order_id` (UNIQUE)
- `level` (for filtering by risk level)
- `checked_at` (DESC, for recent alerts)

## Backend Implementation

### Django Models

Located in `backend/fraud/models.py`:

```python
class BookingFraudCheck(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    score = models.IntegerField()  # 0-100
    level = models.TextField()  # 'safe', 'suspicious', 'high_risk', 'blocked'
    signals = models.JSONField(default=list)
    recommendation = models.TextField()  # 'approve', 'review', 'reject'
    ai_reasoning = models.TextField(null=True, blank=True)
    checked_at = models.DateTimeField(default=timezone.now)

class OrderFraudCheck(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    score = models.IntegerField()  # 0-100
    level = models.TextField()  # 'safe', 'suspicious', 'high_risk', 'blocked'
    signals = models.JSONField(default=list)
    recommendation = models.TextField()  # 'approve', 'review', 'reject'
    ai_reasoning = models.TextField(null=True, blank=True)
    checked_at = models.DateTimeField(default=timezone.now)
```

### Django Serializer

Located in `backend/fraud/serializers.py`:

The `FraudAlertSerializer` converts fraud check records into a unified alert format for the frontend:

- Maps `score` to `riskScore`
- Maps `signals` to `flags`
- Maps `checked_at` to `createdAt` and `updatedAt`
- Converts `level` to `severity` (safe→low, suspicious→medium, high_risk→high, blocked→critical)
- Converts `recommendation` to `status` (approve→resolved, review→investigating, reject→open)

### API Endpoints

All endpoints are prefixed with `/api/fraud/`

#### 1. **GET /alerts/**
Returns all fraud alerts combined from bookings and orders, sorted by date (newest first).

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "payment_fraud",
    "severity": "critical",
    "status": "open",
    "title": "Order Fraud Check - ORD001",
    "description": "AI detected high activity...",
    "entityType": "order",
    "entityId": "123",
    "entityName": "ORD001",
    "riskScore": 95,
    "flags": ["unusual_amount", "new_user"],
    "createdAt": "2026-05-25T10:00:00Z",
    "updatedAt": "2026-05-25T10:00:00Z",
    "notes": "High risk transaction detected..."
  }
]
```

#### 2. **GET /alerts/metrics/**
Returns aggregated fraud metrics for the dashboard.

**Response:**
```json
{
  "totalAlerts": 150,
  "openAlerts": 25,
  "criticalAlerts": 12,
  "avgResolutionTime": 4.5,
  "resolvedAlerts": 110,
  "falsePositiveRate": 0.05
}
```

#### 3. **GET /alerts/{id}/**
Retrieve a single fraud check by ID.

#### 4. **POST /alerts/{id}/approve/**
Mark a fraud check as approved.

#### 5. **POST /alerts/{id}/reject/**
Mark a fraud check as rejected.

#### 6. **POST /alerts/{id}/review/**
Mark a fraud check as requiring review.

**Request Body:**
```json
{
  "reasoning": "Additional notes about the review"
}
```

#### 7. **GET /alerts/by_level/**
Get fraud checks grouped by risk level.

**Response:**
```json
{
  "safe": [...],
  "suspicious": [...],
  "high_risk": [...],
  "blocked": [...]
}
```

#### 8. **GET /alerts/by_entity_type/**
Get fraud checks grouped by entity type (booking vs order).

## Frontend Implementation

### Types

Located in `types/fraud.ts`:

```typescript
type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
type AlertStatus = 'open' | 'investigating' | 'resolved' | 'false_positive';
type AlertType = 'suspicious_activity' | 'fake_review' | 'unusual_spike' | 'suspicious_seller' | 'payment_fraud' | 'bot_activity';

interface FraudAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  entityType: 'user' | 'order' | 'business' | 'product' | 'review';
  entityId: string;
  entityName: string;
  riskScore: number;
  flags: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  assignedTo?: string;
  notes: string;
}

interface FraudMetrics {
  totalAlerts: number;
  openAlerts: number;
  criticalAlerts: number;
  avgResolutionTime: number;
  resolvedAlerts: number;
  falsePositiveRate: number;
}
```

### Custom Hook

Located in `hooks/useFraudAlerts.ts`:

```typescript
export function useFraudAlerts(filters?: FraudFilter) {
  const { alerts, metrics, isLoading, error } = useFraudAlerts();
  
  // Auto-filters by severity, status, entityType
  // Returns { alerts, allAlerts, metrics, isLoading, error }
}
```

### Components

#### 1. **FraudDashboard** (`components/admin/fraud-dashboard.tsx`)
Comprehensive dashboard with KPI cards, severity distribution, performance metrics.

```typescript
<FraudDashboard showChart={true} timeRange="30d" />
```

#### 2. **FraudFilters** (`components/admin/fraud-filters.tsx`)
Advanced filtering UI with:
- Search by title/entity name
- Filter by severity, status, alert type, entity type
- Active filter badges with clear button

```typescript
<FraudFilters
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  selectedSeverity={selectedSeverity}
  onSeverityChange={setSelectedSeverity}
  // ... other filters
/>
```

#### 3. **FraudAlertsList** (`components/admin/fraud-alerts-list.tsx`)
Renders a list of fraud alerts with:
- Color-coded severity indicators
- Status badges
- Risk score display
- Detected flags
- Action buttons

```typescript
<FraudAlertsList
  alerts={alerts}
  isLoading={isLoading}
  onSelectAlert={handleSelectAlert}
  onInvestigate={handleInvestigate}
  maxItems={10}
  showViewAll={true}
/>
```

#### 4. **FraudAlertDetail** (`components/admin/fraud-alert-detail.tsx`)
Detailed card view of a single alert with:
- Full alert information
- AI reasoning
- Entity details
- Timeline
- Action buttons

#### 5. **FraudAlertModal** (`components/admin/fraud-alert-modal.tsx`)
Modal dialog for detailed alert investigation with:
- Full alert information
- Action buttons (Approve, Reject, Investigate)
- Scrollable content for long descriptions

```typescript
<FraudAlertModal
  isOpen={showModal}
  alert={selectedAlert}
  onClose={() => setShowModal(false)}
  onApprove={handleApprove}
  onReject={handleReject}
  onInvestigate={handleInvestigate}
/>
```

### Page

Located in `app/dashboard/fraud/page.tsx`:

The main fraud alerts dashboard page that:
- Displays FraudDashboard with KPI cards
- Provides filtering interface
- Shows list of filtered alerts
- Opens FraudAlertModal when alert is selected
- Handles approve/reject/investigate actions

## Data Flow

### Creating a Fraud Check

```
1. Booking/Order is created
   ↓
2. Fraud detection service analyzes the booking/order
   ↓
3. Creates BookingFraudCheck or OrderFraudCheck record
   ↓
4. Frontend fetches alerts via API
   ↓
5. Alerts are displayed in dashboard
```

### Alert Flow States

```
open → investigating → resolved
    ↘                    ↗
     → false_positive ←─┘
```

## Color Scheme

**Severity Levels:**
- Critical (Red): `#ef4444` / `bg-red-500`
- High (Orange): `#f97316` / `bg-orange-500`
- Medium (Yellow): `#eab308` / `bg-yellow-500`
- Low (Green): `#22c55e` / `bg-green-500`

**Status Levels:**
- Open (Red): Active alert needing action
- Investigating (Yellow): Alert being reviewed
- Resolved (Green): Alert processed and closed
- False Positive (Gray): Mistaken alert

## Usage Examples

### Display Fraud Dashboard
```typescript
import { FraudDashboard } from '@/components/admin/fraud-dashboard';

<FraudDashboard showChart={true} timeRange="30d" />
```

### Display Fraud Alerts List with Filters
```typescript
import { FraudAlertsList } from '@/components/admin/fraud-alerts-list';
import { FraudFilters } from '@/components/admin/fraud-filters';

<FraudFilters {...filterProps} />
<FraudAlertsList alerts={filteredAlerts} {...listProps} />
```

### Integrate into Dashboard
```typescript
import { FraudAlertPanel } from '@/components/admin/fraud-alert-panel';

<FraudAlertPanel limit={5} />
```

## Database Setup

To create the fraud tables in Supabase:

```sql
-- Execute the SQL from backend/fraud_schema.sql
```

## Django Admin

Access fraud checks via Django admin:
- `/admin/fraud/bookingfraudcheck/`
- `/admin/fraud/orderfraudcheck/`

Features:
- View all fraud checks
- Filter by level, recommendation, date
- Search by booking/order ID
- Readonly to prevent accidental modifications

## Integration with Other Apps

### Order App Integration
The fraud check is automatically created when an order is analyzed. The `OrderFraudCheck` record links to the `Order` model via foreign key.

### Booking App Integration
The fraud check is automatically created when a booking is analyzed. The `BookingFraudCheck` record links to the `Booking` model via foreign key.

## Performance Considerations

1. **Indexes**: All tables have proper indexes on:
   - Foreign keys (booking_id, order_id)
   - Risk level (for filtering)
   - Timestamp (for sorting)

2. **Pagination**: Use maxItems prop in FraudAlertsList for pagination

3. **Caching**: Metrics endpoint can be cached for dashboard performance

## Error Handling

The system handles:
- Missing fraud checks (404 responses)
- Invalid recommendation values
- Database constraints (unique booking_id/order_id)
- Unauthorized access (authentication required)

## Future Enhancements

1. Add dispute resolution workflow
2. Implement bulk actions (approve/reject multiple)
3. Add alert assignment to team members
4. Create fraud pattern analysis
5. Add export/reporting functionality
6. Integrate with external fraud detection services
7. Add machine learning model improvements
8. Create historical trend analysis
