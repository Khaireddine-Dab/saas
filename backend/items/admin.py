from django.contrib import admin
from .models import Item

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'item_type', 'store', 'price', 'status', 'created_at')
    list_filter = ('item_type', 'status', 'store', 'is_bookable')
    search_fields = ('name', 'description', 'store__name')
    readonly_fields = ('created_at', 'updated_at', 'embedding')
    
    actions = ['mark_as_flagged', 'mark_as_available']

    @admin.action(description='Signaler les articles sélectionnés')
    def mark_as_flagged(self, request, queryset):
        queryset.update(status='flagged')

    @admin.action(description='Rendre les articles disponibles')
    def mark_as_available(self, request, queryset):
        queryset.update(status='available')
