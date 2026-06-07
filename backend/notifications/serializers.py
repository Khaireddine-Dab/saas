from rest_framework import serializers
from .models import Notification
from users.serializers import UserSerializer

class NotificationSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'user',
            'user_details',
            'title',
            'description',
            'type',
            'link',
            'is_read',
            'metadata',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
