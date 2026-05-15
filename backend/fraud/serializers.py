from rest_framework import serializers
from .models import BookingFraudCheck, OrderFraudCheck

class FraudAlertSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    type = serializers.SerializerMethodField()
    severity = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    entityType = serializers.SerializerMethodField()
    entityId = serializers.SerializerMethodField()
    entityName = serializers.SerializerMethodField()
    riskScore = serializers.IntegerField(source='score')
    flags = serializers.ListField(source='signals')
    createdAt = serializers.DateTimeField(source='checked_at')
    updatedAt = serializers.DateTimeField(source='checked_at')
    notes = serializers.CharField(source='ai_reasoning', allow_null=True)

    def get_type(self, obj):
        if isinstance(obj, OrderFraudCheck):
            return 'payment_fraud'
        return 'suspicious_activity'

    def get_severity(self, obj):
        mapping = {
            'safe': 'low',
            'suspicious': 'medium',
            'high_risk': 'high',
            'blocked': 'critical'
        }
        return mapping.get(obj.level, 'medium')

    def get_status(self, obj):
        mapping = {
            'approve': 'resolved',
            'review': 'investigating',
            'reject': 'open'
        }
        return mapping.get(obj.recommendation, 'open')

    def get_title(self, obj):
        if isinstance(obj, OrderFraudCheck):
            return f"Order Fraud Check - {obj.order.order_number}"
        return f"Booking Fraud Check #{obj.booking_id}"

    def get_description(self, obj):
        return obj.ai_reasoning or f"AI detected {obj.level} activity with a score of {obj.score}/100."

    def get_entityType(self, obj):
        return 'order' if isinstance(obj, OrderFraudCheck) else 'booking'

    def get_entityId(self, obj):
        if isinstance(obj, OrderFraudCheck):
            return str(obj.order_id)
        return str(obj.booking_id)

    def get_entityName(self, obj):
        if isinstance(obj, OrderFraudCheck):
            return obj.order.order_number
        return f"Booking #{obj.booking_id}"
