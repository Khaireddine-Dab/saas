from rest_framework import serializers
from .models import Item, Product
from stores.serializers import StoreSerializer


class ItemSerializer(serializers.ModelSerializer):
    store_details = StoreSerializer(source='store', read_only=True)
    item_type_display = serializers.CharField(source='get_item_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Item
        fields = [
            'id', 'item_type', 'item_type_display', 'store', 'store_details',
            'name', 'slug', 'description',
            'price', 'price_unit', 'stock_quantity', 'duration_minutes',
            'is_bookable', 'available_days',
            'main_image', 'image_2', 'image_3',
            'status', 'status_display',
            'view_count', 'order_count', 'booking_count',
            'rating_average', 'total_reviews',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'view_count', 'order_count', 'booking_count', 'embedding']


class ItemListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views with basic store info"""
    item_type_display = serializers.CharField(source='get_item_type_display', read_only=True)
    store_details = serializers.SerializerMethodField()
    
    def get_store_details(self, obj):
        if obj.store:
            return {
                'id': obj.store.id,
                'name': obj.store.name
            }
        return None
    
    class Meta:
        model = Item
        fields = [
            'id', 'item_type', 'item_type_display', 'name', 'price',
            'main_image', 'rating_average', 'total_reviews', 'is_bookable',
            'stock_quantity', 'view_count', 'order_count', 'booking_count',
            'store', 'store_details'
        ]


# Backward compatibility alias
ProductSerializer = ItemSerializer

