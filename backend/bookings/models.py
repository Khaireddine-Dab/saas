from django.db import models
from users.models import User
from stores.models import Store
from items.models import Item

class Booking(models.Model):
    """
    Model for service bookings/reservations.
    Maps to the existing 'bookings' database table.
    """
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        CONFIRMED = 'CONFIRMED', 'Confirmée'
        COMPLETED = 'COMPLETED', 'Terminée'
        CANCELLED = 'CANCELLED', 'Annulée'

    id = models.BigAutoField(primary_key=True)
    booking_number = models.TextField(unique=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, db_column='item_id', related_name='bookings')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, db_column='customer_id', related_name='bookings')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, db_column='store_id', related_name='bookings')
    
    booking_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration_minutes = models.IntegerField()
    
    customer_name = models.TextField()
    customer_phone = models.TextField()
    customer_email = models.TextField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.TextField(choices=Status.choices, default=Status.PENDING)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'bookings'
        managed = False

    def __str__(self):
        return f"Booking {self.booking_number} - {self.status}"
