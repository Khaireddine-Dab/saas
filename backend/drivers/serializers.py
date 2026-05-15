from rest_framework import serializers
from .models import Driver


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = [
            'id', 'name', 'email', 'phone', 'status',
            'address', 'city', 'postal_code', 'country',
            'vehicle_type', 'vehicle_license_plate', 'vehicle_make', 'vehicle_model',
            'vehicle_year', 'vehicle_capacity_kg', 'vehicle_status', 'vehicle_last_inspection',
            'license_status', 'license_expiry_date', 'license_verified_at',
            'id_status', 'id_expiry_date', 'id_verified_at',
            'insurance_status', 'insurance_expiry_date', 'insurance_verified_at',
            'registration_status', 'registration_expiry_date', 'registration_verified_at',
            'background_check_status', 'background_check_expiry_date', 'background_check_verified_at',
            'total_deliveries', 'rating', 'completion_rate', 'avg_delivery_time_minutes', 'acceptance_rate',
            'current_lat', 'current_lng', 'current_address', 'location_updated_at',
            'bank_name', 'account_number', 'account_holder',
            'total_earnings', 'earnings_this_month', 'earnings_this_week', 'last_payout_date',
            'join_date', 'last_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'join_date']


class DriverListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    class Meta:
        model = Driver
        fields = [
            'id', 'name', 'email', 'phone', 'status', 'vehicle_type',
            'vehicle_license_plate', 'total_deliveries', 'rating', 'completion_rate',
            'current_lat', 'current_lng', 'total_earnings', 'created_at'
        ]


class DriverUpdateSerializer(serializers.ModelSerializer):
    """Serializer for PATCH/PUT operations"""
    class Meta:
        model = Driver
        fields = [
            'name', 'phone', 'status', 'address', 'city', 'postal_code', 'country',
            'vehicle_type', 'vehicle_license_plate', 'vehicle_make', 'vehicle_model',
            'vehicle_year', 'vehicle_capacity_kg', 'vehicle_status', 'vehicle_last_inspection',
            'license_status', 'license_expiry_date', 'license_verified_at',
            'id_status', 'id_expiry_date', 'id_verified_at',
            'insurance_status', 'insurance_expiry_date', 'insurance_verified_at',
            'registration_status', 'registration_expiry_date', 'registration_verified_at',
            'background_check_status', 'background_check_expiry_date', 'background_check_verified_at',
            'completion_rate', 'avg_delivery_time_minutes', 'acceptance_rate',
            'current_lat', 'current_lng', 'current_address', 'location_updated_at',
            'bank_name', 'account_number', 'account_holder', 'last_payout_date'
        ]
