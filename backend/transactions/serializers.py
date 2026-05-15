from rest_framework import serializers
from .models import Transaction


class TransactionListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for transaction listings.
    Includes computed and display fields.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    net_amount = serializers.FloatField(read_only=True)
    is_recent = serializers.BooleanField(read_only=True)
    duration_display = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_code', 'order_number', 'customer_name',
            'merchant_name', 'amount', 'fee', 'net_amount', 'status',
            'status_display', 'type', 'type_display', 'time_created',
            'is_recent', 'duration_total_minutes', 'duration_display',
        ]
        read_only_fields = ['id', 'time_created']

    def get_duration_display(self, obj):
        return obj.get_duration_display()


class TransactionDetailSerializer(serializers.ModelSerializer):
    """
    Full serializer for transaction detail view.
    Includes all fields and computed properties.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    net_amount = serializers.FloatField(read_only=True)
    is_recent = serializers.BooleanField(read_only=True)
    duration_display = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_code', 'order_number', 'booking_id',
            'customer_id', 'customer_name', 'merchant_id', 'merchant_number',
            'merchant_name', 'driver_name', 'drop_location', 'amount', 'fee',
            'net_amount', 'status', 'status_display', 'type', 'type_display',
            'date', 'time_created', 'time_accepted', 'collection_time',
            'pickup_time', 'time_delivered', 'wait_duration_minutes',
            'delivery_duration_minutes', 'duration_total_minutes', 'duration_display',
            'km', 'qr_code_token', 'is_recent',
        ]
        read_only_fields = ['id', 'time_created']

    def get_duration_display(self, obj):
        return obj.get_duration_display()


class TransactionCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating transactions.
    Validates status and type values.
    """

    class Meta:
        model = Transaction
        fields = [
            'transaction_code', 'order_number', 'booking_id',
            'customer_id', 'customer_name', 'merchant_id', 'merchant_number',
            'merchant_name', 'driver_name', 'drop_location', 'amount', 'fee',
            'status', 'type', 'date', 'time_accepted', 'collection_time',
            'pickup_time', 'time_delivered', 'wait_duration_minutes',
            'delivery_duration_minutes', 'km', 'qr_code_token',
        ]

    def validate(self, data):
        """Validate transaction data"""
        if data['status'] not in dict(Transaction.STATUS_CHOICES):
            raise serializers.ValidationError('Invalid status value.')
        if data['type'] not in dict(Transaction.TYPE_CHOICES):
            raise serializers.ValidationError('Invalid type value.')
        
        # Validate amount
        if data['amount'] <= 0:
            raise serializers.ValidationError('Amount must be greater than 0.')
        
        # Validate fee if present
        if data.get('fee') and data['fee'] < 0:
            raise serializers.ValidationError('Fee cannot be negative.')
        
        return data

    def validate_amount(self, value):
        """Validate amount is positive"""
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than 0.')
        return value
