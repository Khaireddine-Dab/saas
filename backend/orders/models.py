from django.db import models
from users.models import User
from stores.models import Store
from products.models import Product

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        VALIDATED = 'VALIDATED', 'Validée'
        COMPLETED = 'COMPLETED', 'Terminée'
        CANCELLED = 'CANCELLED', 'Annulée'

    id = models.BigAutoField(primary_key=True)
    order_number = models.TextField(unique=True)
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, db_column='customer_id', related_name='orders')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, db_column='store_id', related_name='orders')
    item = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, db_column='item_id', related_name='orders')
    
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    customer_name = models.TextField()
    customer_phone = models.TextField()
    customer_email = models.TextField(null=True, blank=True)
    delivery_address = models.TextField()
    
    customer_notes = models.TextField(null=True, blank=True)
    vendor_notes = models.TextField(null=True, blank=True)
    
    status = models.TextField(choices=Status.choices, default=Status.PENDING)
    tracking_code = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    validated_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'orders'
        managed = False

    def __str__(self):
        return f"Order {self.order_number} - {self.status}"
