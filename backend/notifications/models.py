import uuid
from django.db import models
from users.models import User

class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id', related_name='notifications')
    title = models.TextField()
    description = models.TextField(null=True, blank=True)
    type = models.TextField()  # e.g., 'email', 'sms', 'push'
    link = models.TextField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification {self.id} - {self.title} (User: {self.user_id})"
