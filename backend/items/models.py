from django.db import models
from stores.models import Store


class Item(models.Model):
    """
    Generic Item model for both Products and Services.
    Maps to the existing 'items' database table.
    """
    class ItemType(models.TextChoices):
        PRODUCT = 'PRODUCT', 'Produit'  # Must match PostgreSQL enum value (uppercase)
        SERVICE = 'SERVICE', 'Service'  # Must match PostgreSQL enum value (uppercase)

    class Status(models.TextChoices):
        AVAILABLE = 'available', 'Disponible'
        HIDDEN = 'hidden', 'Caché'
        FLAGGED = 'flagged', 'Signalé'
        BANNED = 'banned', 'Interdit'

    id = models.BigAutoField(primary_key=True)
    item_type = models.CharField(
        max_length=20,
        choices=ItemType.choices,
        default=ItemType.PRODUCT
    )
    
    # Basic info
    name = models.TextField()
    slug = models.TextField(unique=True)
    description = models.TextField(null=True, blank=True)
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_unit = models.CharField(max_length=50, default='unit')
    
    # Inventory & Booking
    stock_quantity = models.IntegerField(null=True, blank=True)  # For products
    duration_minutes = models.IntegerField(null=True, blank=True)  # For services
    is_bookable = models.BooleanField(null=True, blank=True)  # For services
    available_days = models.JSONField(null=True, blank=True)  # For services: days when available
    
    # Images
    main_image = models.TextField()
    image_2 = models.TextField(null=True, blank=True)
    image_3 = models.TextField(null=True, blank=True)
    
    # Status & Visibility
    status = models.CharField(
        max_length=50,
        choices=Status.choices,
        default=Status.AVAILABLE
    )
    
    # Analytics
    view_count = models.IntegerField(default=0, null=True, blank=True)
    order_count = models.IntegerField(default=0, null=True, blank=True)  # For products
    booking_count = models.IntegerField(default=0, null=True, blank=True)  # For services
    
    # Reviews & Ratings
    rating_average = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, null=True, blank=True)
    total_reviews = models.IntegerField(default=0, null=True, blank=True)
    
    # Vector embedding for search (PostgreSQL vector)
    embedding = models.JSONField(null=True, blank=True)
    
    # Store relationship
    store = models.ForeignKey(Store, on_delete=models.CASCADE, db_column='store_id', related_name='items')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        db_table = 'items'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_item_type_display()}: {self.name}"

    @property
    def is_product(self):
        return self.item_type == self.ItemType.PRODUCT

    @property
    def is_service(self):
        return self.item_type == self.ItemType.SERVICE
    
    @property
    def is_available(self):
        """Check if item is available for ordering/booking"""
        return self.status == self.Status.AVAILABLE


# Backward compatibility alias
Product = Item

