from django.contrib import admin
from .models import Promotion, PromotionItem

class PromotionItemInline(admin.TabularInline):
    model = PromotionItem
    extra = 1

@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'store', 'valid_from', 'valid_until', 'active')
    list_filter = ('active', 'valid_from', 'valid_until', 'store')
    search_fields = ('title', 'description', 'store__name')
    readonly_fields = ('created_at',)
    inlines = [PromotionItemInline]
    
    actions = ['activate_promotions', 'deactivate_promotions']

    @admin.action(description='Activer les promotions sélectionnées')
    def activate_promotions(self, request, queryset):
        queryset.update(active=True)

    @admin.action(description='Désactiver les promotions sélectionnées')
    def deactivate_promotions(self, request, queryset):
        queryset.update(active=False)
