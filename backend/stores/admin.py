from django.contrib import admin
from .models import Store

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'owner', 'status', 'city', 'created_at')
    list_filter = ('status', 'city')
    search_fields = ('name', 'owner__email', 'rne')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['approve_stores', 'reject_stores']

    @admin.action(description='Approuver les boutiques sélectionnées')
    def approve_stores(self, request, queryset):
        rows_updated = queryset.update(status='PUBLISHED')
        self.message_user(request, f"{rows_updated} boutique(s) approuvée(s) avec succès.")

    @admin.action(description='Rejeter les boutiques sélectionnées')
    def reject_stores(self, request, queryset):
        rows_updated = queryset.update(status='REJECTED')
        self.message_user(request, f"{rows_updated} boutique(s) rejetée(s).")
