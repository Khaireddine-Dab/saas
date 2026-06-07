from django.contrib import admin
from .models import BookingFraudCheck, OrderFraudCheck


@admin.register(BookingFraudCheck)
class BookingFraudCheckAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking_id', 'score', 'level', 'recommendation', 'checked_at')
    list_filter = ('level', 'recommendation', 'checked_at')
    search_fields = ('booking_id', 'ai_reasoning')
    readonly_fields = ('id', 'checked_at')
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('id', 'booking_id')
        }),
        ('Fraud Assessment', {
            'fields': ('score', 'level', 'recommendation')
        }),
        ('Details', {
            'fields': ('signals', 'ai_reasoning', 'checked_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(OrderFraudCheck)
class OrderFraudCheckAdmin(admin.ModelAdmin):
    list_display = ('id', 'order_id', 'score', 'level', 'recommendation', 'checked_at')
    list_filter = ('level', 'recommendation', 'checked_at')
    search_fields = ('order_id', 'ai_reasoning')
    readonly_fields = ('id', 'checked_at')
    
    fieldsets = (
        ('Order Information', {
            'fields': ('id', 'order_id')
        }),
        ('Fraud Assessment', {
            'fields': ('score', 'level', 'recommendation')
        }),
        ('Details', {
            'fields': ('signals', 'ai_reasoning', 'checked_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
