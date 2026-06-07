from django.db import models
from django.utils import timezone
import uuid

class Reel(models.Model):
    id = models.BigAutoField(primary_key=True)
    store_id = models.BigIntegerField()
    media_path = models.TextField()
    media_type = models.TextField(null=True, blank=True)
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=150, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='TND', null=True, blank=True)
    cta_type = models.TextField(null=True, blank=True)
    cta_value = models.TextField(null=True, blank=True)
    category = models.CharField(max_length=50, null=True, blank=True)
    is_sponsored = models.BooleanField(default=False, null=True, blank=True)
    status = models.TextField(default='active', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    item_id = models.IntegerField(null=True, blank=True)
    # Exclude embedding from model definition since pgvector requires custom setup,
    # and we only need basic CRUD here.

    class Meta:
        managed = False
        db_table = 'reels'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class ReelStat(models.Model):
    reel = models.OneToOneField(Reel, on_delete=models.CASCADE, primary_key=True, related_name='stats')
    views_count = models.IntegerField(default=0, null=True, blank=True)
    likes_count = models.IntegerField(default=0, null=True, blank=True)
    clicks_count = models.IntegerField(default=0, null=True, blank=True)
    contact_count = models.IntegerField(default=0, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    saves_count = models.IntegerField(default=0, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'reel_stats'

    def __str__(self):
        return f"Stats for {self.reel_id}"

class Story(models.Model):
    id = models.BigAutoField(primary_key=True)
    store_id = models.BigIntegerField()
    author_id = models.UUIDField(null=True, blank=True)
    media_url = models.TextField()
    media_type = models.TextField(default='image')
    caption = models.TextField(null=True, blank=True)
    views_count = models.IntegerField(default=0)
    is_approved = models.BooleanField(default=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'stories'
        ordering = ['-created_at']

    def __str__(self):
        return f"Story {self.id} (Store {self.store_id})"

    @property
    def is_active(self) -> bool:
        return timezone.now() <= self.expires_at

class StoryView(models.Model):
    id = models.BigAutoField(primary_key=True)
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='views')
    viewer_id = models.UUIDField()
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'story_views'
        unique_together = (('story', 'viewer_id'),)

    def __str__(self):
        return f"View {self.id} on Story {self.story_id}"

class ReelComment(models.Model):
    id = models.BigAutoField(primary_key=True)
    reel = models.ForeignKey(Reel, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    user_id = models.UUIDField(null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    attachment_url = models.TextField(null=True, blank=True)
    attachment_type = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'reel_comments'
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment {self.id} on Reel {self.reel_id}"
