from rest_framework import serializers
from .models import Review, ReviewFlag
from users.serializers import UserSerializer
from items.serializers import ItemSerializer, ProductSerializer
from stores.serializers import StoreSerializer


class ReviewFlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewFlag
        fields = [
            'id', 'review', 'reason', 'count', 'status',
            'description', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ReviewListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    user_details = UserSerializer(source='user', read_only=True)
    product_details = ProductSerializer(source='product', read_only=True)
    store_details = StoreSerializer(source='store', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'product', 'product_details', 'store', 'store_details',
            'user', 'user_details', 'rating', 'title', 'status',
            'spam_score', 'risk_level', 'flagged', 'verified',
            'helpful', 'unhelpful', 'created_at'
        ]


class ReviewDetailSerializer(serializers.ModelSerializer):
    """Full serializer with all details"""
    user_details = UserSerializer(source='user', read_only=True)
    product_details = ProductSerializer(source='product', read_only=True)
    store_details = StoreSerializer(source='store', read_only=True)
    flags = ReviewFlagSerializer(many=True, read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'product', 'product_details', 'store', 'store_details',
            'user', 'user_details', 'rating', 'title', 'content', 'status',
            'spam_score', 'risk_level', 'flagged', 'flag_count',
            'rejection_reason', 'verified', 'helpful', 'unhelpful',
            'flags', 'created_at', 'updated_at', 'approved_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'spam_score', 'risk_level']


class ReviewCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating reviews"""
    class Meta:
        model = Review
        fields = [
            'product', 'store', 'user', 'rating', 'title', 'content'
        ]


class ReviewModerationSerializer(serializers.ModelSerializer):
    """Serializer for moderation actions"""
    class Meta:
        model = Review
        fields = [
            'status', 'spam_score', 'risk_level', 'rejection_reason', 'flagged'
        ]
