from rest_framework import serializers
from .models import SupportTicket, SupportMessage
from users.serializers import UserSerializer
from stores.serializers import StoreSerializer

class SupportMessageSerializer(serializers.ModelSerializer):
    sender_details = UserSerializer(source='sender', read_only=True)
    
    class Meta:
        model = SupportMessage
        fields = ['id', 'ticket', 'sender', 'sender_details', 'content', 'sender_type', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'sender_type', 'created_at']

class SupportTicketSerializer(serializers.ModelSerializer):
    messages = SupportMessageSerializer(many=True, read_only=True)
    store_details = StoreSerializer(source='store', read_only=True)
    customer_details = UserSerializer(source='customer', read_only=True)
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)

    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_number', 'store', 'store_details', 'customer', 'customer_details',
            'customer_name', 'subject', 'priority', 'status', 'channel', 
            'assigned_to', 'assigned_to_details', 'messages', 
            'created_at', 'updated_at', 'last_reply_at'
        ]
        read_only_fields = ['id', 'ticket_number', 'created_at', 'updated_at', 'last_reply_at']
