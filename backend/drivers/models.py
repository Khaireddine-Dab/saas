from django.db import models
import uuid


class Driver(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        INACTIVE = 'inactive', 'Inactive'
        SUSPENDED = 'suspended', 'Suspended'
        ON_BREAK = 'on-break', 'On Break'
        OFFLINE = 'offline', 'Offline'

    class VehicleType(models.TextChoices):
        MOTORCYCLE = 'motorcycle', 'Motorcycle'
        CAR = 'car', 'Car'
        VAN = 'van', 'Van'
        TRUCK = 'truck', 'Truck'

    class VehicleStatus(models.TextChoices):
        ACTIVE = 'active', 'Active'
        INACTIVE = 'inactive', 'Inactive'
        MAINTENANCE = 'maintenance', 'Maintenance'

    class DocumentStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        VERIFIED = 'verified', 'Verified'
        REJECTED = 'rejected', 'Rejected'
        EXPIRED = 'expired', 'Expired'

    # Identifiants et infos de base
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.INACTIVE
    )

    # Informations de contact supplémentaires
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)

    # Véhicule
    vehicle_type = models.CharField(
        max_length=20,
        choices=VehicleType.choices,
        null=True,
        blank=True
    )
    vehicle_license_plate = models.CharField(max_length=50, unique=True, null=True, blank=True)
    vehicle_make = models.CharField(max_length=100, null=True, blank=True)
    vehicle_model = models.CharField(max_length=100, null=True, blank=True)
    vehicle_year = models.IntegerField(null=True, blank=True)
    vehicle_capacity_kg = models.IntegerField(default=50)
    vehicle_status = models.CharField(
        max_length=20,
        choices=VehicleStatus.choices,
        default=VehicleStatus.ACTIVE,
        null=True,
        blank=True
    )
    vehicle_last_inspection = models.DateTimeField(null=True, blank=True)

    # Documents - License
    license_status = models.CharField(
        max_length=20,
        choices=DocumentStatus.choices,
        default=DocumentStatus.PENDING
    )
    license_expiry_date = models.DateField(null=True, blank=True)
    license_verified_at = models.DateTimeField(null=True, blank=True)

    # Documents - ID
    id_status = models.CharField(
        max_length=20,
        choices=DocumentStatus.choices,
        default=DocumentStatus.PENDING
    )
    id_expiry_date = models.DateField(null=True, blank=True)
    id_verified_at = models.DateTimeField(null=True, blank=True)

    # Documents - Insurance
    insurance_status = models.CharField(
        max_length=20,
        choices=DocumentStatus.choices,
        default=DocumentStatus.PENDING
    )
    insurance_expiry_date = models.DateField(null=True, blank=True)
    insurance_verified_at = models.DateTimeField(null=True, blank=True)

    # Documents - Registration
    registration_status = models.CharField(
        max_length=20,
        choices=DocumentStatus.choices,
        default=DocumentStatus.PENDING
    )
    registration_expiry_date = models.DateField(null=True, blank=True)
    registration_verified_at = models.DateTimeField(null=True, blank=True)

    # Documents - Background Check
    background_check_status = models.CharField(
        max_length=20,
        choices=DocumentStatus.choices,
        default=DocumentStatus.PENDING
    )
    background_check_expiry_date = models.DateField(null=True, blank=True)
    background_check_verified_at = models.DateTimeField(null=True, blank=True)

    # Performances
    total_deliveries = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=100.0)
    avg_delivery_time_minutes = models.IntegerField(default=0)
    acceptance_rate = models.DecimalField(max_digits=5, decimal_places=2, default=100.0)

    # Localisation actuelle
    current_lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    current_lng = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    current_address = models.TextField(null=True, blank=True)
    location_updated_at = models.DateTimeField(null=True, blank=True)

    # Compte bancaire
    bank_name = models.CharField(max_length=100, null=True, blank=True)
    account_number = models.CharField(max_length=50, null=True, blank=True)
    account_holder = models.CharField(max_length=255, null=True, blank=True)

    # Gains
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    earnings_this_month = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    earnings_this_week = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    last_payout_date = models.DateTimeField(null=True, blank=True)

    # Dates importantes
    join_date = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'drivers'
        managed = False

    def __str__(self):
        return f"{self.name} ({self.email})"
