from django.db import models
from django.utils import timezone


class Banner(models.Model):
    """
    Banner model for promotional banners.
    Maps to existing PostgreSQL banners table.
    """
    PLACEMENT_CHOICES = [
        ('homepage', 'Home Page'),
        ('category', 'Category'),
        ('checkout', 'Checkout'),
        ('popup', 'Popup'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('expired', 'Expired'),
    ]

    id = models.BigAutoField(primary_key=True)
    store_id = models.BigIntegerField(db_column='store_id')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    image_url = models.URLField(null=True, blank=True, db_column='image_url')
    target_url = models.URLField(null=True, blank=True, db_column='target_url')
    placement = models.CharField(max_length=50, choices=PLACEMENT_CHOICES)
    status = models.CharField(
        max_length=50, 
        choices=STATUS_CHOICES, 
        default='draft'
    )
    priority = models.IntegerField(default=1)
    start_date = models.DateField(db_column='start_date')
    end_date = models.DateField(db_column='end_date')
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    conversion_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=4, 
        default=0.0,
        db_column='conversion_rate'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_column='created_at')
    updated_at = models.DateTimeField(auto_now=True, db_column='updated_at')
    created_by = models.CharField(
        max_length=255, 
        null=True, 
        blank=True,
        db_column='created_by'
    )

    class Meta:
        managed = False
        db_table = 'banners'
        ordering = ['-priority', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_placement_display()})"

    @property
    def is_active(self) -> bool:
        """Check if banner is currently active"""
        today = timezone.now().date()
        return (
            self.status == 'active' 
            and self.start_date <= today 
            and today <= self.end_date
        )

    @property
    def is_upcoming(self) -> bool:
        """Check if banner is scheduled but not yet active"""
        today = timezone.now().date()
        return self.status == 'scheduled' and self.start_date > today

    @property
    def is_expired(self) -> bool:
        """Check if banner has passed end date"""
        today = timezone.now().date()
        return today > self.end_date

    @property
    def days_remaining(self) -> int:
        """Calculate days until end_date"""
        today = timezone.now().date()
        if today >= self.end_date:
            return 0
        return (self.end_date - today).days

    @property
    def click_rate(self) -> float:
        """Calculate click-through rate"""
        if self.impressions == 0:
            return 0.0
        return round(self.clicks / self.impressions, 4)

    def record_impression(self):
        """Increment impression count"""
        self.impressions += 1
        self.save(update_fields=['impressions'])

    def record_click(self):
        """Increment click count"""
        self.clicks += 1
        self.save(update_fields=['clicks'])
