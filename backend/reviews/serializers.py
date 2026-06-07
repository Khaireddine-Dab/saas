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
    author_details = UserSerializer(source='author', read_only=True)
    item_details = ProductSerializer(source='item', read_only=True)
    store_details = StoreSerializer(source='store', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'item', 'item_details', 'store', 'store_details',
            'author', 'author_details', 'rating', 'title', 'is_approved',
            'is_spam', 'is_verified', 'sentiment_score', 'sentiment_label',
            'created_at'
        ]


class ReviewDetailSerializer(serializers.ModelSerializer):
    """Full serializer with all details"""
    author_details = UserSerializer(source='author', read_only=True)
    item_details = ProductSerializer(source='item', read_only=True)
    store_details = StoreSerializer(source='store', read_only=True)
    flags = ReviewFlagSerializer(many=True, read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'item', 'item_details', 'store', 'store_details',
            'author', 'author_details', 'rating', 'title', 'comment', 'is_approved',
            'is_spam', 'is_verified', 'sentiment_score', 'sentiment_label',
            'vendor_response', 'vendor_response_ai_suggestion', 'responded_at',
            'qr_token', 'qr_scanned_at', 'image_1', 'image_2',
            'flags', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'sentiment_score', 'sentiment_label']


class ReviewCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating reviews"""
    class Meta:
        model = Review
        fields = [
            'item', 'store', 'author', 'rating', 'title', 'comment'
        ]


class ReviewModerationSerializer(serializers.ModelSerializer):
    """Serializer for moderation actions"""
    class Meta:
        model = Review
        fields = [
            'is_approved', 'is_spam', 'sentiment_score', 'sentiment_label',
            'vendor_response', 'vendor_response_ai_suggestion'
        ]
