from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = str(getattr(user, 'role', '')).upper()

        if role == 'ADMIN':
            queryset = Notification.objects.all()
            user_id = self.request.query_params.get('user_id')
            if user_id:
                queryset = queryset.filter(user_id=user_id)
        else:
            queryset = Notification.objects.filter(user=user)

        notification_type = self.request.query_params.get('type')
        if notification_type:
            queryset = queryset.filter(type=notification_type)

        is_read = self.request.query_params.get('is_read')
        if is_read is not None:
            is_read_bool = is_read.lower() == 'true'
            queryset = queryset.filter(is_read=is_read_bool)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        role = str(getattr(user, 'role', '')).upper()

        if role == 'ADMIN':
            # Admin can specify target user
            serializer.save()
        else:
            # Non-admins can only send to themselves
            serializer.save(user=user)

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        """Mark all notifications of the current user (or target user if admin) as read"""
        user = request.user
        role = str(getattr(user, 'role', '')).upper()

        target_user = user
        if role == 'ADMIN':
            user_id = request.data.get('user_id')
            if user_id:
                from users.models import User
                try:
                    target_user = User.objects.get(id=user_id)
                except User.DoesNotExist:
                    return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        Notification.objects.filter(user=target_user, is_read=False).update(is_read=True)
        return Response({"message": "All notifications marked as read."}, status=status.HTTP_200_OK)
