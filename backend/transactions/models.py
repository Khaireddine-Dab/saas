import uuid
from django.db import models
from django.utils import timezone


class Transaction(models.Model):
    """
    Transaction model for financial transactions.
    Maps to existing PostgreSQL transactions table.
    Supports payments, refunds, and payouts.
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    TYPE_CHOICES = [
        ('payment', 'Payment'),
        ('refund', 'Refund'),
        ('payout', 'Payout'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction_code = models.CharField(max_length=50, unique=True, db_column='transaction_code')
    order_number = models.CharField(max_length=50, db_column='order_number')
    booking_id = models.BigIntegerField(null=True, blank=True, db_column='booking_id')
    customer_id = models.UUIDField(null=True, blank=True, db_column='customer_id')
    customer_name = models.CharField(max_length=255, null=True, blank=True, db_column='customer_name')
    merchant_id = models.BigIntegerField(null=True, blank=True, db_column='merchant_id')
    merchant_number = models.CharField(max_length=50, null=True, blank=True, db_column='merchant_number')
    merchant_name = models.CharField(max_length=255, null=True, blank=True, db_column='merchant_name')
    driver_name = models.CharField(max_length=255, null=True, blank=True, db_column='driver_name')
    drop_location = models.CharField(max_length=255, null=True, blank=True, db_column='drop_location')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, db_column='amount')
    fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00, db_column='fee')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending', db_column='status')
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='payment', db_column='type')
    date = models.DateTimeField(null=True, blank=True, db_column='date')
    time_created = models.DateTimeField(auto_now_add=True, db_column='time_created')
    time_accepted = models.DateTimeField(null=True, blank=True, db_column='time_accepted')
    collection_time = models.DateTimeField(null=True, blank=True, db_column='collection_time')
    pickup_time = models.DateTimeField(null=True, blank=True, db_column='pickup_time')
    time_delivered = models.DateTimeField(null=True, blank=True, db_column='time_delivered')
    wait_duration_minutes = models.IntegerField(null=True, blank=True, db_column='wait_duration_minutes')
    delivery_duration_minutes = models.IntegerField(null=True, blank=True, db_column='delivery_duration_minutes')
    km = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, db_column='km')
    qr_code_token = models.CharField(max_length=255, unique=True, null=True, blank=True, db_column='qr_code_token')

    class Meta:
        managed = False
        db_table = 'transactions'
        ordering = ['-time_created']

    def __str__(self):
        return f"{self.transaction_code} - {self.get_status_display()} ({self.get_type_display()})"

    @property
    def net_amount(self) -> float:
        """Calculate net amount after fee"""
        fee = float(self.fee or 0)
        amount = float(self.amount or 0)
        return amount - fee

    @property
    def is_recent(self) -> bool:
        """Check if transaction happened in last 24 hours"""
        hours_ago = (timezone.now() - self.time_created).total_seconds() / 3600
        return hours_ago <= 24

    @property
    def duration_total_minutes(self) -> int:
        """Calculate total duration in minutes"""
        wait = self.wait_duration_minutes or 0
        delivery = self.delivery_duration_minutes or 0
        return wait + delivery

    def get_duration_display(self) -> str:
        """Format duration for display"""
        total = self.duration_total_minutes
        if total == 0:
            return "No data"
        
        hours = total // 60
        minutes = total % 60
        
        if hours > 0:
            return f"{hours}h {minutes}m"
        return f"{minutes}m"
