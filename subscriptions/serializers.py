from rest_framework import serializers
from .models import Plan, Subscription, Invoice, Usage


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'currency',
            'interval', 'features', 'max_users', 'max_storage',
            'is_active', 'is_popular', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usage
        fields = [
            'id', 'metric', 'value', 'limit', 'period_start',
            'period_end', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = [
            'id', 'amount', 'currency', 'status', 'due_date',
            'paid_at', 'created_at'
        ]
        read_only_fields = ['id', 'paid_at', 'created_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    plan_id = serializers.IntegerField(write_only=True)
    invoices = InvoiceSerializer(many=True, read_only=True)
    usage_records = UsageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'plan', 'plan_id', 'status', 'current_period_start',
            'current_period_end', 'trial_start', 'trial_end',
            'canceled_at', 'cancel_at_period_end', 'invoices',
            'usage_records', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'stripe_subscription_id', 'stripe_customer_id',
            'created_at', 'updated_at'
        ]
