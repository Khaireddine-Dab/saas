import uuid
from django.db import models
from django.utils import timezone
from orders.models import Order
from bookings.models import Booking

class BookingFraudCheck(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='fraud_check', db_column='booking_id')
    score = models.IntegerField()
    level = models.TextField() # 'safe', 'suspicious', 'high_risk', 'blocked'
    signals = models.JSONField(default=list)
    recommendation = models.TextField() # 'approve', 'review', 'reject'
    ai_reasoning = models.TextField(null=True, blank=True)
    checked_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'booking_fraud_checks'
        managed = False

    def __str__(self):
        return f"Fraud Check for Booking {self.booking_id} - {self.level}"

class OrderFraudCheck(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='fraud_check', db_column='order_id')
    score = models.IntegerField()
    level = models.TextField() # 'safe', 'suspicious', 'high_risk', 'blocked'
    signals = models.JSONField(default=list)
    recommendation = models.TextField() # 'approve', 'review', 'reject'
    ai_reasoning = models.TextField(null=True, blank=True)
    checked_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'order_fraud_checks'
        managed = False

    def __str__(self):
        return f"Fraud Check for Order {self.order_id} - {self.level}"
