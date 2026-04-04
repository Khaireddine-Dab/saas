import uuid
from django.db import models
from stores.models import Store

class Product(models.Model):
    class Status(models.TextChoices):
        VISIBLE = 'visible', 'Visible'
        HIDDEN = 'hidden', 'Hidden'
        FLAGGED = 'flagged', 'Flagged'
        BANNED = 'banned', 'Banned'

    id = models.BigAutoField(primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, db_column='store_id', related_name='products')
    name = models.TextField()
    description = models.TextField(null=True, blank=True)
    category = models.TextField(null=True, blank=True, db_column='item_type') # mapping category to item_type
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_unit = models.TextField(default='unit')
    main_image = models.TextField(null=True, blank=True)
    status = models.TextField(choices=Status.choices, default=Status.VISIBLE)
    rating_average = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    total_reviews = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'items'
        managed = False

    def __str__(self):
        return self.name
