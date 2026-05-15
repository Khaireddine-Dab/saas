from rest_framework import serializers
from .models import Order
from stores.serializers import StoreSerializer
from items.serializers import ItemSerializer, ProductSerializer

class OrderSerializer(serializers.ModelSerializer):
    store_details = StoreSerializer(source='store', read_only=True)
    item_details = ProductSerializer(source='item', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer', 'store', 'store_details', 
            'item', 'item_details', 'quantity', 'unit_price', 'total_price',
            'customer_name', 'customer_phone', 'customer_email', 'delivery_address',
            'customer_notes', 'vendor_notes', 'status', 'tracking_code',
            'cart', 'items_json', 'fraud_score', 'fraud_level', 'merchant_override_fraud',
            'created_at', 'updated_at', 'validated_at', 'completed_at'
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']
