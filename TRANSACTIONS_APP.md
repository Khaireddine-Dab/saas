# Transactions App API Documentation

## Overview
The **Transactions** app manages all financial transactions in the marketplace, including payments, refunds, and payouts. The app provides comprehensive tracking, filtering, and analytics for transaction management.

## Database Model

### Transaction Model
```python
class Transaction(models.Model):
    # Primary Key
    id = UUIDField(primary_key=True, default=uuid.uuid4)
    
    # Transaction Classification
    type = CharField(choices=[
        ('payment', 'Payment'),
        ('refund', 'Refund'),
        ('payout', 'Payout')
    ])
    status = CharField(choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded')
    ])
    
    # Financial Data
    amount = DecimalField(max_digits=12, decimal_places=2)
    fee = DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Parties Involved
    customer_id = UUIDField()  # External UUID reference
    merchant_id = BigIntegerField()  # Store ID
    booking_id = BigIntegerField(null=True, blank=True)
    driver_name = CharField(max_length=255, null=True, blank=True)
    
    # Timestamps
    time_created = DateTimeField(auto_now_add=True)
    time_accepted = DateTimeField(null=True, blank=True)
    collection_time = DateTimeField(null=True, blank=True)
    pickup_time = DateTimeField(null=True, blank=True)
    time_delivered = DateTimeField(null=True, blank=True)
    
    # Delivery Tracking
    wait_duration_minutes = IntegerField(null=True, blank=True)
    delivery_duration_minutes = IntegerField(null=True, blank=True)
    km = FloatField(null=True, blank=True)
```

## API Endpoints

### 1. Transaction List & Create
```
GET    /api/transactions/
POST   /api/transactions/
```

**Query Parameters:**
- `status` (str): Filter by status (pending, completed, failed, refunded)
- `type` (str): Filter by type (payment, refund, payout)
- `merchant_id` (int): Filter by merchant/store ID
- `customer_id` (uuid): Filter by customer ID

**GET Response:**
```json
{
  "count": 150,
  "next": "http://api.example.com/api/transactions/?page=2",
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "payment",
      "status": "completed",
      "amount": "100.00",
      "fee": "10.00",
      "net_amount": "90.00",
      "customer_id": "550e8400-e29b-41d4-a716-446655440001",
      "merchant_id": 42,
      "booking_id": 12345,
      "time_created": "2024-01-15T10:30:00Z",
      "is_recent": true
    }
  ]
}
```

**POST Request:**
```json
{
  "type": "payment",
  "status": "pending",
  "amount": "150.00",
  "fee": "15.00",
  "customer_id": "550e8400-e29b-41d4-a716-446655440001",
  "merchant_id": 42,
  "booking_id": 12345,
  "driver_name": "Ahmed"
}
```

### 2. Transaction Detail
```
GET    /api/transactions/<id>/
PUT    /api/transactions/<id>/
DELETE /api/transactions/<id>/
```

**GET Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "payment",
  "status": "completed",
  "amount": "100.00",
  "fee": "10.00",
  "net_amount": "90.00",
  "customer_id": "550e8400-e29b-41d4-a716-446655440001",
  "merchant_id": 42,
  "booking_id": 12345,
  "driver_name": "Ahmed",
  "time_created": "2024-01-15T10:30:00Z",
  "time_accepted": "2024-01-15T10:35:00Z",
  "collection_time": "2024-01-15T10:40:00Z",
  "pickup_time": "2024-01-15T10:45:00Z",
  "time_delivered": "2024-01-15T11:00:00Z",
  "wait_duration_minutes": 10,
  "delivery_duration_minutes": 15,
  "duration_total_minutes": 25,
  "km": 5.5,
  "is_recent": false
}
```

**PUT Request (Partial Update):**
```json
{
  "status": "completed",
  "time_accepted": "2024-01-15T10:35:00Z",
  "collection_time": "2024-01-15T10:40:00Z"
}
```

### 3. Transactions by Merchant
```
GET /api/transactions/merchant/<merchant_id>/
```

Filter all transactions for a specific merchant/store.

**Query Parameters:**
- `status` (str): Filter by status
- `type` (str): Filter by type

**Response:** Same format as Transaction List

### 4. Transactions by Customer
```
GET /api/transactions/customer/<customer_id>/
```

Filter all transactions for a specific customer.

**Query Parameters:**
- `status` (str): Filter by status
- `type` (str): Filter by type

**Response:** Same format as Transaction List

### 5. Transaction Statistics
```
GET /api/transactions/stats/
```

Get comprehensive transaction statistics.

**Query Parameters:**
- `merchant_id` (int): Filter stats for specific merchant
- `customer_id` (uuid): Filter stats for specific customer

**Response:**
```json
{
  "total_amount": "50000.00",
  "total_fee": "5000.00",
  "total_transactions": 500,
  "successful_count": 450,
  "failed_count": 30,
  "pending_count": 20,
  "success_rate": 90.0,
  "average_amount": "100.00",
  "average_fee": "10.00",
  "status_breakdown": {
    "completed": 450,
    "failed": 30,
    "pending": 20,
    "refunded": 0
  },
  "type_breakdown": {
    "payment": 450,
    "refund": 40,
    "payout": 10
  }
}
```

### 6. Successful Transactions
```
GET /api/transactions/successful/
```

List only completed transactions.

**Query Parameters:**
- `merchant_id` (int): Filter by merchant
- `customer_id` (uuid): Filter by customer

**Response:** Same format as Transaction List (status=completed only)

### 7. Failed Transactions
```
GET /api/transactions/failed/
```

List transactions with failed or pending status.

**Query Parameters:**
- `merchant_id` (int): Filter by merchant
- `customer_id` (uuid): Filter by customer

**Response:** Same format as Transaction List (status=failed or pending only)

## Computed Properties

### net_amount
Amount after deducting fees.
```python
net_amount = amount - fee
```

### is_recent
Boolean indicating if transaction was created in the last 30 days.
```python
is_recent = (now - time_created).days < 30
```

### duration_total_minutes
Total duration from creation to delivery.
```python
duration_total_minutes = wait_duration_minutes + delivery_duration_minutes
```

### get_duration_display()
Human-readable format for durations.
```
"25 minutes" or "2 hours 30 minutes"
```

## Status Values

| Status | Description |
|--------|-------------|
| pending | Transaction initiated, awaiting processing |
| completed | Transaction successfully processed |
| failed | Transaction failed to process |
| refunded | Transaction has been refunded |

## Transaction Type Values

| Type | Description |
|------|-------------|
| payment | Customer payment to merchant |
| refund | Refund issued to customer |
| payout | Payout to merchant or driver |

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Responses

### 400 Bad Request
```json
{
  "errors": {
    "amount": ["Ensure this value is greater than 0."],
    "status": ["Invalid status value. Must be one of: pending, completed, failed, refunded"]
  }
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

## Admin Interface

The Transactions app includes a Django admin interface accessible at `/admin/`:

**Features:**
- List view with columns: ID, Customer, Merchant, Type, Status, Amount, Fee, Net Amount, Created Date, Booking ID
- Filters: Status, Type, Creation Date, Acceptance Date
- Search: By ID, Customer ID, Merchant ID, Booking ID, Driver Name
- Read-only fields: ID, Net Amount, Is Recent, Duration Total
- Date hierarchy: By creation date
- Ordering: Newest first

## Usage Examples

### Get all completed payments for a merchant
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/transactions/merchant/42/?status=completed&type=payment"
```

### Get transaction statistics
```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/transactions/stats/"
```

### Create a new transaction
```bash
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "status": "pending",
    "amount": "100.00",
    "fee": "10.00",
    "customer_id": "550e8400-e29b-41d4-a716-446655440001",
    "merchant_id": 42,
    "booking_id": 12345
  }' \
  http://localhost:8000/api/transactions/
```

### Update transaction status
```bash
curl -X PUT -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "time_accepted": "2024-01-15T10:35:00Z"
  }' \
  http://localhost:8000/api/transactions/550e8400-e29b-41d4-a716-446655440000/
```

## Filtering and Sorting

All list endpoints support query string filters:

```
GET /api/transactions/?status=completed&type=payment&merchant_id=42&customer_id=550e8400-e29b-41d4-a716-446655440001
```

## File Structure

```
transactions/
├── __init__.py           # App initialization
├── admin.py              # Django admin configuration
├── apps.py               # App configuration
├── models.py             # Transaction model
├── serializers.py        # API serializers
├── views.py              # API views
├── urls.py               # URL routing
├── tests.py              # Unit tests
└── migrations/
    └── __init__.py       # Migrations directory
```

## Next Steps

1. **Remove mock data** from frontend transactions dashboard
2. **Create frontend components** for transaction management
3. **Implement real-time updates** via WebSockets or polling
4. **Add pagination** for large result sets
5. **Add caching layer** for statistics
6. **Add unit tests** coverage
7. **Add performance indexes** on merchant_id, customer_id, status
