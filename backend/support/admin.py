from django.contrib import admin
from .models import SupportTicket, SupportMessage

class SupportMessageInline(admin.TabularInline):
    model = SupportMessage
    extra = 1
    readonly_fields = ('created_at',)
    fields = ('sender', 'sender_type', 'content', 'is_read', 'created_at')

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_number', 'store', 'customer', 'subject', 'priority', 'status', 'channel', 'created_at')
    list_filter = ('status', 'priority', 'channel')
    search_fields = ('subject', 'customer__email', 'customer_name', 'ticket_number')
    readonly_fields = ('created_at', 'updated_at', 'last_reply_at')
    inlines = [SupportMessageInline]
    
    actions = ['mark_as_closed', 'mark_as_high_priority']

    @admin.action(description='Marquer comme fermé')
    def mark_as_closed(self, request, queryset):
        queryset.update(status='closed')

    @admin.action(description='Marquer comme priorité haute')
    def mark_as_high_priority(self, request, queryset):
        queryset.update(priority='high')

@admin.register(SupportMessage)
class SupportMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'ticket', 'sender', 'sender_type', 'is_read', 'created_at')
    list_filter = ('sender_type', 'is_read', 'created_at')
    search_fields = ('content', 'ticket__ticket_number', 'sender__email')
