import uuid
from django.db import models
from users.models import User

class Store(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        ACCEPTED = 'ACCEPTED', 'Accepté'
        REJECTED = 'REJECTED', 'Rejeté'

    id = models.BigAutoField(primary_key=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, db_column='owner_id', related_name='owned_stores')
    name = models.TextField()
    slug = models.TextField(unique=True)
    description = models.TextField(null=True, blank=True)
    phone = models.TextField()
    email = models.TextField(null=True, blank=True)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=12, decimal_places=9)
    longitude = models.DecimalField(max_digits=12, decimal_places=9)
    city = models.TextField()
    status = models.TextField(choices=Status.choices, default=Status.PENDING)
    rne = models.TextField(unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'stores'
        managed = False  # Django ne gère pas la création de cette table

    def __str__(self):
        return f"{self.name} ({self.status})"
