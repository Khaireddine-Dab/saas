from django.contrib import admin
from .models import Banner

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'placement', 'status', 'priority', 'start_date', 'end_date', 'impressions', 'clicks')
    list_filter = ('placement', 'status', 'start_date', 'end_date')
    search_fields = ('title', 'description', 'target_url')
    readonly_fields = ('created_at', 'updated_at', 'impressions', 'clicks', 'conversion_rate')
    
    actions = ['make_active', 'make_inactive']

    @admin.action(description='Rendre les bannières actives')
    def make_active(self, request, queryset):
        queryset.update(status='active')

    @admin.action(description='Rendre les bannières inactives')
    def make_inactive(self, request, queryset):
        queryset.update(status='inactive')
