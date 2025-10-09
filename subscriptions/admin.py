from django.contrib import admin
from .models import Plan, Subscription, Invoice, Usage


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'price', 'currency', 'interval', 'is_active', 'is_popular')
    list_filter = ('is_active', 'is_popular', 'interval', 'currency')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'status', 'current_period_end', 'created_at')
    list_filter = ('status', 'plan', 'created_at')
    search_fields = ('user__email', 'plan__name')
    readonly_fields = ('stripe_subscription_id', 'stripe_customer_id', 'created_at', 'updated_at')


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('subscription', 'amount', 'currency', 'status', 'due_date', 'paid_at')
    list_filter = ('status', 'currency', 'due_date')
    search_fields = ('subscription__user__email', 'stripe_invoice_id')
    readonly_fields = ('stripe_invoice_id', 'stripe_payment_intent_id', 'paid_at', 'created_at', 'updated_at')


@admin.register(Usage)
class UsageAdmin(admin.ModelAdmin):
    list_display = ('subscription', 'metric', 'value', 'limit', 'period_start')
    list_filter = ('metric', 'period_start')
    search_fields = ('subscription__user__email', 'metric')