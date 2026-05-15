from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_code', 'customer_name', 'merchant_name', 'amount', 'type', 'status', 'time_created')
    list_filter = ('type', 'status', 'time_created', 'merchant_name')
    search_fields = ('transaction_code', 'order_number', 'customer_name', 'merchant_name', 'qr_code_token')
    readonly_fields = ('id', 'time_created', 'time_accepted', 'collection_time', 'pickup_time', 'time_delivered')
    
    # Custom colors for status in admin list can be added via custom templates or media
