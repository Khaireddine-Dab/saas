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
        ticket = serializer.save()
        from notifications.services import notify_admins
        subject = getattr(ticket, 'subject', None) or 'Support ticket'
        notify_admins(
            title='New support ticket',
            description=f'{subject}',
            notification_type='support',
            link=f'/dashboard/support/tickets?ticket_id={ticket.id}',
            metadata={'ticket_id': str(ticket.id)},
        )

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

        ticket = message.ticket
        ticket.last_reply_at = timezone.now()
        ticket.save()

        if str(getattr(user, 'role', '')).upper() != 'ADMIN':
            from notifications.services import notify_admins
            notify_admins(
                title='New support message',
                description=(message.content or '')[:120],
                notification_type='support',
                link=f'/dashboard/support/chat?ticket_id={ticket.id}',
                metadata={'ticket_id': str(ticket.id), 'message_id': str(message.id)},
            )
        elif ticket.customer_id:
            from notifications.services import notify_user
            from users.models import User
            try:
                customer = User.objects.get(id=ticket.customer_id)
                notify_user(
                    customer,
                    title='Support reply',
                    description=(message.content or '')[:120],
                    notification_type='support',
                    link=f'/dashboard/support/chat?ticket_id={ticket.id}',
                    metadata={'ticket_id': str(ticket.id), 'message_id': str(message.id)},
                )
            except User.DoesNotExist:
                pass
