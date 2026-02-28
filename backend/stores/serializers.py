from rest_framework import serializers
from .models import Store
from users.serializers import UserSerializer

class StoreSerializer(serializers.ModelSerializer):
    owner_details = UserSerializer(source='owner', read_only=True)

    class Meta:
        model = Store
        fields = [
            'id', 'name', 'slug', 'description', 'phone', 'email', 
            'address', 'city', 'status', 'rne', 'owner', 'owner_details',
            'created_at', 'updated_at'
        ]
