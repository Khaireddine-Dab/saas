# Fraud Detection System - Quick Start Guide

## 1. Database Setup

Run the SQL migration to create the fraud tables:

```bash
# Option 1: Using Supabase UI
# Go to SQL Editor in Supabase dashboard and run fraud_schema.sql

# Option 2: Using Django migration
python manage.py migrate fraud
```

## 2. Backend Configuration

### Models Already Configured
Located in `backend/fraud/models.py`:
- ✅ BookingFraudCheck
- ✅ OrderFraudCheck

### Admin Interface Configured
Located in `backend/fraud/admin.py`:
- ✅ BookingFraudCheckAdmin
- ✅ OrderFraudCheckAdmin

Access at: `http://localhost:8000/admin/fraud/`

### API Endpoints Configured
Located in `backend/fraud/urls.py` and `backend/fraud/views.py`:

```
GET    /api/fraud/alerts/              - List all fraud alerts
GET    /api/fraud/alerts/{id}/         - Get single alert
GET    /api/fraud/alerts/metrics/      - Get metrics
POST   /api/fraud/alerts/{id}/approve/ - Approve an alert
POST   /api/fraud/alerts/{id}/reject/  - Reject an alert
POST   /api/fraud/alerts/{id}/review/  - Mark for review
GET    /api/fraud/alerts/by_level/     - Group by risk level
GET    /api/fraud/alerts/by_entity_type/ - Group by entity type
```

## 3. Frontend Setup

### Components Already Created
- ✅ `components/admin/fraud-dashboard.tsx` - KPI dashboard
- ✅ `components/admin/fraud-filters.tsx` - Advanced filtering
- ✅ `components/admin/fraud-alerts-list.tsx` - Alert list view
- ✅ `components/admin/fraud-alert-detail.tsx` - Alert detail card
- ✅ `components/admin/fraud-alert-modal.tsx` - Alert modal dialog
- ✅ `components/admin/fraud-alert-panel.tsx` - Dashboard widget

### Hook Already Created
- ✅ `hooks/useFraudAlerts.ts` - Data fetching and filtering

### Page Already Created
- ✅ `app/dashboard/fraud/page.tsx` - Main fraud dashboard page

## 4. Usage Examples

### Display Fraud Dashboard
```typescript
import { FraudDashboard } from '@/components/admin/fraud-dashboard';

export function MyComponent() {
  return <FraudDashboard showChart={true} timeRange="30d" />;
}
```

### Display Fraud Alerts List
```typescript
import { useFraudAlerts } from '@/hooks/useFraudAlerts';
import { FraudAlertsList } from '@/components/admin/fraud-alerts-list';

export function AlertsPage() {
  const { alerts, isLoading } = useFraudAlerts();

  return (
    <FraudAlertsList
      alerts={alerts}
      isLoading={isLoading}
      onSelectAlert={(alert) => console.log('Selected:', alert)}
      maxItems={10}
    />
  );
}
```

### Integrate into Dashboard
```typescript
import { FraudAlertPanel } from '@/components/admin/fraud-alert-panel';

export function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <FraudAlertPanel limit={5} />
    </div>
  );
}
```

### Create Fraud Check (Backend)
```python
from fraud.models import BookingFraudCheck, OrderFraudCheck

# For a booking
booking_check = BookingFraudCheck.objects.create(
    booking_id=1,
    score=75,
    level='high_risk',
    signals=['unusual_amount', 'new_user'],
    recommendation='review',
    ai_reasoning='High amount from new user account'
)

# For an order
order_check = OrderFraudCheck.objects.create(
    order_id=1,
    score=95,
    level='blocked',
    signals=['payment_mismatch', 'location_anomaly', 'velocity_check'],
    recommendation='reject',
    ai_reasoning='Multiple fraud signals detected'
)
```

## 5. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  Frontend - Fraud Dashboard                  │
├─────────────────────────────────────────────────────────────┤
│  FraudDashboard (KPI) + FraudFilters + FraudAlertsList      │
└────────────────────────────┬────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         GET /api/fraud/alerts/    GET /api/fraud/alerts/metrics/
                │                         │
                └────────────┬────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
   ┌────┴───────────────────────────────────────┴────┐
   │     Django REST Framework ViewSet              │
   │     fraud/views.py - FraudAlertViewSet        │
   └────┬───────────────────────────────────────┬───┘
        │                                       │
   ┌────┴──────────────────┐         ┌─────────┴───────┐
   │  BookingFraudCheck    │         │  OrderFraudCheck│
   │  models.py            │         │  models.py      │
   └────┬──────────────────┘         └─────────┬───────┘
        │                                       │
        └───────────────────┬───────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
    ┌───┴──────────────┐            ┌──────────┴──┐
    │ Bookings Table   │            │ Orders Table│
    │ (Supabase)       │            │ (Supabase)  │
    └──────────────────┘            └─────────────┘
```

## 6. Key Features

### Dashboard KPIs
- Total Alerts (all time)
- Open Alerts (requiring action)
- Critical Issues (blocked level)
- Resolution Rate (percentage)
- Avg Risk Score
- False Positive Rate

### Filtering Options
- **Severity**: Critical, High, Medium, Low
- **Status**: Open, Investigating, Resolved, False Positive
- **Alert Type**: suspicious_activity, fake_review, unusual_spike, suspicious_seller, payment_fraud, bot_activity
- **Entity Type**: user, order, business, product, review
- **Search**: Title and entity name

### Alert Status Flow
```
open ──→ investigating ──→ resolved
 ↓                           ↑
 └──────→ false_positive ────┘
```

### Risk Score Mapping
- 0-25: Low (🟢 Green)
- 26-50: Medium (🟡 Yellow)
- 51-75: High (🟠 Orange)
- 76-100: Critical (🔴 Red)

## 7. Admin Interface

Access Django admin at `/admin/`:

```
Admin > Fraud > Booking Fraud Checks
- View all booking fraud checks
- Filter by level, recommendation, date
- Search by booking_id
- Readonly (no add/delete by non-superuser)

Admin > Fraud > Order Fraud Checks
- View all order fraud checks
- Filter by level, recommendation, date
- Search by order_id
- Readonly (no add/delete by non-superuser)
```

## 8. API Examples

### Get All Alerts
```bash
curl -X GET http://localhost:8000/api/fraud/alerts/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Metrics
```bash
curl -X GET http://localhost:8000/api/fraud/alerts/metrics/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Single Alert
```bash
curl -X GET http://localhost:8000/api/fraud/alerts/{alert_id}/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Approve an Alert
```bash
curl -X POST http://localhost:8000/api/fraud/alerts/{alert_id}/approve/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Reject an Alert
```bash
curl -X POST http://localhost:8000/api/fraud/alerts/{alert_id}/reject/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Mark for Review with Reasoning
```bash
curl -X POST http://localhost:8000/api/fraud/alerts/{alert_id}/review/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reasoning": "Manual review needed - suspicious pattern"}'
```

### Group by Risk Level
```bash
curl -X GET http://localhost:8000/api/fraud/alerts/by_level/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Group by Entity Type
```bash
curl -X GET http://localhost:8000/api/fraud/alerts/by_entity_type/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 9. Frontend Type Definitions

```typescript
type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
type AlertStatus = 'open' | 'investigating' | 'resolved' | 'false_positive';
type AlertType = 'suspicious_activity' | 'fake_review' | 'unusual_spike' 
                | 'suspicious_seller' | 'payment_fraud' | 'bot_activity';

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

## 10. Testing the System

### 1. Add Sample Data
```python
from fraud.models import BookingFraudCheck, OrderFraudCheck

# Create a sample booking fraud check
BookingFraudCheck.objects.create(
    booking_id=1,
    score=85,
    level='high_risk',
    signals=['unusual_amount', 'new_user', 'fast_consecutive_bookings'],
    recommendation='review',
    ai_reasoning='Multiple suspicious signals detected'
)

# Create a sample order fraud check
OrderFraudCheck.objects.create(
    order_id=1,
    score=45,
    level='suspicious',
    signals=['multiple_failed_payments'],
    recommendation='approve',
    ai_reasoning='Low risk but requires monitoring'
)
```

### 2. Visit Fraud Dashboard
Navigate to: `http://localhost:3000/dashboard/fraud`

### 3. Test API Endpoints
Use the API examples above to test each endpoint

### 4. Check Django Admin
Visit: `http://localhost:8000/admin/fraud/`

## 11. Troubleshooting

### Issue: No alerts appearing
**Solution**: 
1. Check if fraudchecks exist in database: `SELECT * FROM booking_fraud_checks;`
2. Verify API endpoint: `curl http://localhost:8000/api/fraud/alerts/`
3. Check browser console for errors

### Issue: API returns 404
**Solution**:
1. Ensure fraud app is registered in INSTALLED_APPS
2. Check URL routing is correct
3. Verify authentication token is valid

### Issue: Serializer not mapping data correctly
**Solution**:
1. Verify FraudAlert type matches API response
2. Check level/recommendation mapping in serializer
3. Update frontend types if schema changes

## 12. Next Steps

1. ✅ Deploy fraud_schema.sql to production database
2. ✅ Test API endpoints
3. ✅ Integrate with order/booking creation process
4. ✅ Set up fraud detection service (backend)
5. ✅ Configure email alerts for critical issues
6. ✅ Create fraud pattern analysis reports
7. ✅ Implement bulk actions UI
8. ✅ Add dispute resolution workflow
