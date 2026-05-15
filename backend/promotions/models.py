from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.core.validators import MinValueValidator, MaxValueValidator
from stores.models import Store
from items.models import Item


class Promotion(models.Model):
    """
    Promotion model for managing discounts and offers.
    Maps to existing 'promotions' PostgreSQL table.
    """
    
    id = models.BigAutoField(primary_key=True)
    
    # Relationships
    store = models.ForeignKey(
        Store, 
        on_delete=models.CASCADE, 
        db_column='store_id', 
        related_name='promotions'
    )
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        db_column='item_id',
        related_name='promotions',
        null=True,
        blank=True
    )
    
    # Basic info
    title = models.TextField()
    description = models.TextField(null=True, blank=True)
    
    # Discount options (can use either percent or text)
    discount_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    discount_text = models.TextField(
        null=True,
        blank=True,
        help_text="Custom discount text (e.g., 'Buy 2 Get 1 Free', '50 TND off')"
    )
    
    # Date range
    valid_from = models.DateField()
    valid_until = models.DateField()
    
    # Status
    active = models.BooleanField(default=True)
    
    # Application scope
    apply_to_all = models.BooleanField(
        default=False,
        help_text="If True, promotion applies to all items in this store"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    
    # Additional items (Many-to-Many via through model)
    items = models.ManyToManyField(
        Item,
        through='PromotionItem',
        related_name='promotions_multi',
        blank=True
    )
    
    class Meta:
        db_table = 'promotions'
        managed = False
        ordering = ['-valid_from']
    
    def __str__(self):
        return f"{self.title} ({self.store.name})"
    
    @property
    def is_active(self):
        """Check if promotion is currently active (valid date range and active flag)"""
        today = timezone.now().date()
        return self.active and self.valid_from <= today <= self.valid_until
    
    @property
    def is_upcoming(self):
        """Check if promotion starts in the future"""
        today = timezone.now().date()
        return self.valid_from > today
    
    @property
    def is_expired(self):
        """Check if promotion has ended"""
        today = timezone.now().date()
        return self.valid_until < today
    
    @property
    def days_remaining(self):
        """Get number of days until promotion expires"""
        today = timezone.now().date()
        if self.valid_until >= today:
            return (self.valid_until - today).days
        return 0
    
    def get_discount_display(self):
        """Return formatted discount text"""
        if self.discount_percent:
            return f"{self.discount_percent}% off"
        return self.discount_text or "Special offer"
    
    @property
    def target_items(self):
        """Get items this promotion applies to"""
        if self.apply_to_all:
            return self.store.items.all()
        elif self.item:
            return Item.objects.filter(id=self.item.id)
        else:
            return self.items.all()


class PromotionItem(models.Model):
    """
    Junction table for Many-to-Many relationship between Promotions and Items.
    Maps to existing 'promotion_items' PostgreSQL table.
    """
    promotion = models.ForeignKey(
        Promotion,
        on_delete=models.CASCADE,
        db_column='promotion_id'
    )
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        db_column='item_id'
    )
    
    class Meta:
        db_table = 'promotion_items'
        managed = False
        unique_together = ('promotion_id', 'item_id')
    
    def __str__(self):
        return f"{self.promotion.title} - {self.item.name}"
