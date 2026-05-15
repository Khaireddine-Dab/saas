from rest_framework import serializers
from .models import Booking
from items.serializers import ItemSerializer
from users.serializers import UserSerializer # Assuming it exists
from stores.serializers import StoreSerializer

class BookingSerializer(serializers.ModelSerializer):
    item_details = ItemSerializer(source='item', read_only=True)
    customer_details = UserSerializer(source='customer', read_only=True)
    store_details = StoreSerializer(source='store', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_number', 'item', 'item_details',
            'customer', 'customer_details', 'store', 'store_details',
            'booking_date', 'start_time', 'end_time', 'duration_minutes',
            'customer_name', 'customer_phone', 'customer_email', 'notes',
            'price', 'status', 'status_display',
            'created_at', 'updated_at', 'confirmed_at', 'completed_at'
        ]
        read_only_fields = ['id', 'booking_number', 'created_at', 'updated_at']
