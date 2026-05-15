from rest_framework import serializers
from .models import Promotion, PromotionItem
from stores.serializers import StoreSerializer
from items.serializers import ItemSerializer


class PromotionItemSerializer(serializers.ModelSerializer):
    item_details = ItemSerializer(source='item', read_only=True)
    
    class Meta:
        model = PromotionItem
        fields = ['promotion', 'item', 'item_details']


class PromotionListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    store_details = StoreSerializer(source='store', read_only=True)
    discount_display = serializers.SerializerMethodField()
    is_active = serializers.BooleanField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    is_upcoming = serializers.BooleanField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Promotion
        fields = [
            'id', 'store', 'store_details', 'title',
            'discount_percent', 'discount_text', 'discount_display',
            'valid_from', 'valid_until', 'active',
            'is_active', 'is_expired', 'is_upcoming', 'days_remaining',
            'apply_to_all', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_discount_display(self, obj):
        return obj.get_discount_display()


class PromotionDetailSerializer(serializers.ModelSerializer):
    """Full serializer with item details"""
    store_details = StoreSerializer(source='store', read_only=True)
    item_details = ItemSerializer(source='item', read_only=True)
    promotion_items = PromotionItemSerializer(
        source='promotionitem_set',
        many=True,
        read_only=True
    )
    discount_display = serializers.SerializerMethodField()
    is_active = serializers.BooleanField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    is_upcoming = serializers.BooleanField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    target_items = ItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Promotion
        fields = [
            'id', 'store', 'store_details', 'title', 'description',
            'discount_percent', 'discount_text', 'discount_display',
            'valid_from', 'valid_until', 'active',
            'is_active', 'is_expired', 'is_upcoming', 'days_remaining',
            'apply_to_all', 'item', 'item_details',
            'promotion_items', 'target_items',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class PromotionCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating promotions"""
    
    class Meta:
        model = Promotion
        fields = [
            'store', 'title', 'description',
            'discount_percent', 'discount_text',
            'valid_from', 'valid_until', 'active',
            'apply_to_all', 'item'
        ]
    
    def validate(self, data):
        """Validate promotion data"""
        if not data.get('discount_percent') and not data.get('discount_text'):
            raise serializers.ValidationError(
                "Either discount_percent or discount_text must be provided"
            )
        
        if data['valid_from'] >= data['valid_until']:
            raise serializers.ValidationError(
                "valid_from must be before valid_until"
            )
        
        return data
