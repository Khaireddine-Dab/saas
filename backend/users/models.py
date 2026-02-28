import uuid
from django.db import models

class User(models.Model):
    class Role(models.TextChoices):
        CLIENT = 'CLIENT', 'Client'
        PRO = 'PRO', 'Pro'
        ADMIN = 'ADMIN', 'Admin'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.TextField(default=Role.ADMIN)
    full_name = models.TextField(null=True, blank=True)
    phone = models.TextField(null=True, blank=True)
    avatar_url = models.TextField(null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    city = models.TextField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Django auth attributes (not used, but required for compatibility)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
        managed = False  # Django ne gère pas la création/migration de cette table

    def __str__(self):
        return f"{self.full_name or self.email} ({self.role})"
    
    # Auth compatibility properties
    @property
    def is_anonymous(self):
        return False
    
    @property
    def is_authenticated(self):
        return True
    
    @property
    def is_active(self):
        return True
    
    @property
    def is_staff(self):
        return self.role == self.Role.ADMIN
    
    @property
    def is_superuser(self):
        return self.role == self.Role.ADMIN
