from rest_framework import serializers
from .models import Banner


class BannerListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for banner listings.
    Includes computed fields for status and analytics.
    """
    placement_display = serializers.CharField(source='get_placement_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    click_rate = serializers.SerializerMethodField()
    is_active = serializers.BooleanField(read_only=True)
    is_upcoming = serializers.BooleanField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)

    class Meta:
        model = Banner
        fields = [
            'id', 'store_id', 'title', 'placement', 'placement_display',
            'status', 'status_display', 'priority', 'start_date', 'end_date',
            'impressions', 'clicks', 'click_rate', 'conversion_rate',
            'is_active', 'is_upcoming', 'is_expired', 'days_remaining',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_click_rate(self, obj):
        return obj.click_rate


class BannerDetailSerializer(serializers.ModelSerializer):
    """
    Full serializer for banner detail view.
    Includes all fields and computed properties.
    """
    placement_display = serializers.CharField(source='get_placement_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    click_rate = serializers.SerializerMethodField()
    is_active = serializers.BooleanField(read_only=True)
    is_upcoming = serializers.BooleanField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)

    class Meta:
        model = Banner
        fields = [
            'id', 'store_id', 'title', 'description', 'image_url', 'target_url',
            'placement', 'placement_display', 'status', 'status_display',
            'priority', 'start_date', 'end_date', 'impressions', 'clicks',
            'click_rate', 'conversion_rate', 'is_active', 'is_upcoming',
            'is_expired', 'days_remaining', 'created_at', 'updated_at', 'created_by',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_click_rate(self, obj):
        return obj.click_rate


class BannerCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating banners.
    Validates date ranges and required fields.
    """

    class Meta:
        model = Banner
        fields = [
            'store_id', 'title', 'description', 'image_url', 'target_url',
            'placement', 'status', 'priority', 'start_date', 'end_date',
            'conversion_rate', 'created_by',
        ]

    def validate(self, data):
        """Validate banner data"""
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError(
                'Start date must be before end date.'
            )
        return data

    def validate_priority(self, value):
        """Validate priority is positive"""
        if value < 0:
            raise serializers.ValidationError('Priority must be non-negative.')
        return value

    def validate_conversion_rate(self, value):
        """Validate conversion rate is between 0 and 1"""
        if not (0 <= value <= 1):
            raise serializers.ValidationError('Conversion rate must be between 0 and 1.')
        return value
