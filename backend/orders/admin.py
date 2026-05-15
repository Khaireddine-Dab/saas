from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'order_number', 'customer_name', 'store', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'store', 'created_at')
    search_fields = ('order_number', 'customer_name', 'customer_email', 'tracking_code')
    readonly_fields = ('created_at', 'updated_at', 'validated_at', 'completed_at')
    
    # Visual cues for status in the list
    def get_status_color(self, obj):
        # This is just a helper for display if we had custom CSS, 
        # but for now we rely on standard admin
        return obj.status
