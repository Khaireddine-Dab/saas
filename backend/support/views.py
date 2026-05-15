from rest_framework import viewsets, permissions, response, status
from .models import SupportTicket, SupportMessage
from .serializers import SupportTicketSerializer, SupportMessageSerializer
from django.utils import timezone
from django.db import models

class SupportTicketViewSet(viewsets.ModelViewSet):
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return SupportTicket.objects.all()
        
        # Owners see tickets for their stores
        # Assuming User model has a role 'PRO' for store owners
        if user.role == 'PRO':
            return SupportTicket.objects.filter(store__owner=user)
            
        # Customers see their own tickets
        return SupportTicket.objects.filter(customer=user)

    def perform_create(self, serializer):
        # When an owner creates a ticket, we might need to specify the store
        # For now, let's just save as is, but we could auto-assign based on context
        serializer.save()

class SupportMessageViewSet(viewsets.ModelViewSet):
    serializer_class = SupportMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        ticket_id = self.request.query_params.get('ticket_id')
        
        queryset = SupportMessage.objects.all()
        if ticket_id:
            queryset = queryset.filter(ticket_id=ticket_id)
            
        if user.role == 'ADMIN':
            return queryset
            
        # Filter messages for tickets the user has access to
        return queryset.filter(
            models.Q(ticket__customer=user) | 
            models.Q(ticket__store__owner=user)
        )

    def perform_create(self, serializer):
        user = self.request.user
        sender_type = 'support' if user.role == 'ADMIN' else 'customer'
        message = serializer.save(sender=user, sender_type=sender_type)
        
        # Update last_reply_at on the ticket
        ticket = message.ticket
        ticket.last_reply_at = timezone.now()
        ticket.save()
