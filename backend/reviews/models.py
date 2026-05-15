from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from orders.models import Order
from items.models import Item
from stores.models import Store
import uuid


class Review(models.Model):
    class SentimentLabel(models.TextChoices):
        POSITIVE = 'positive', 'Positif'
        NEGATIVE = 'negative', 'Négatif'
        NEUTRAL = 'neutral', 'Neutre'

    # Primary key and URLs
    id = models.BigAutoField(primary_key=True)
    
    # Foreign keys - matching actual database columns
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, db_column='author_id', related_name='reviews_authored')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, db_column='item_id', related_name='reviews', null=True, blank=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, db_column='store_id', related_name='reviews')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, db_column='order_id', related_name='reviews', null=True, blank=True)
    
    # Review content - matching actual database
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.TextField(null=True, blank=True)
    comment = models.TextField()
    image_1 = models.TextField(null=True, blank=True)
    image_2 = models.TextField(null=True, blank=True)
    
    # Verification and QR
    is_verified = models.BooleanField(default=False)
    qr_token = models.TextField(unique=True, null=True, blank=True)
    qr_scanned_at = models.DateTimeField(null=True, blank=True)
    
    # Sentiment analysis
    sentiment_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    sentiment_label = models.CharField(
        max_length=20,
        choices=SentimentLabel.choices,
        null=True,
        blank=True
    )
    
    # Vendor response
    vendor_response = models.TextField(null=True, blank=True)
    vendor_response_ai_suggestion = models.TextField(null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    
    # Approval and spam status
    is_approved = models.BooleanField(default=True)
    is_spam = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reviews'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"Review #{self.id} - {self.rating}★ on Item {self.item_id}"


class ReviewFlag(models.Model):
    """
    Model for flagged reviews (moderation/spam reports).
    Maps to review_flags table if it exists in the database.
    """
    class FlagReason(models.TextChoices):
        SPAM = 'spam', 'Spam'
        FAKE = 'fake', 'Faux'
        INAPPROPRIATE = 'inappropriate', 'Inapproprié'
        DUPLICATE = 'duplicate', 'Doublon'
        OTHER = 'other', 'Autre'

    class FlagStatus(models.TextChoices):
        PENDING = 'pending', 'En attente'
        REVIEWED = 'reviewed', 'Examiné'
        RESOLVED = 'resolved', 'Résolu'

    id = models.BigAutoField(primary_key=True)
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='flags')
    reason = models.CharField(max_length=20, choices=FlagReason.choices)
    count = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=FlagStatus.choices, default=FlagStatus.PENDING)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'review_flags'
        managed = False
        ordering = ['-created_at']

    def __str__(self):
        return f"Flag on Review {self.review.id} - {self.reason}"
