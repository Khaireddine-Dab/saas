import uuid
from django.db import models
from users.models import User
from stores.models import Store

class SupportTicket(models.Model):
    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
        URGENT = 'urgent', 'Urgent'

    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        IN_PROGRESS = 'in_progress', 'In Progress'
        WAITING = 'waiting', 'Waiting'
        RESOLVED = 'resolved', 'Resolved'
        CLOSED = 'closed', 'Closed'

    class Channel(models.TextChoices):
        CHAT = 'chat', 'Chat'
        PHONE = 'phone', 'Phone'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_number = models.IntegerField(unique=True, editable=False) # Serial handled by DB
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='support_tickets', db_column='store_id')
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='support_tickets', db_column='customer_id')
    customer_name = models.TextField(null=True, blank=True)
    subject = models.TextField()
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN, null=True)
    channel = models.CharField(max_length=20, choices=Channel.choices, default=Channel.CHAT, null=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_tickets', db_column='assigned_to')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_reply_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'support_tickets'
        managed = False # Tables exist in Supabase
        ordering = ['-created_at']

    def __str__(self):
        return f"Ticket #{self.ticket_number} - {self.subject}"

class SupportMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages', db_column='ticket_id')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, db_column='sender_id')
    sender_type = models.TextField() # 'customer' or 'support'
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'support_messages'
        managed = False # We will create this table in Supabase as well
        ordering = ['created_at']

    def __str__(self):
        return f"Message on Ticket #{self.ticket.ticket_number} by {self.sender.email}"
