from django.contrib import admin
from .models import Driver

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'status', 'vehicle_type', 'rating', 'total_deliveries', 'created_at')
    list_filter = ('status', 'vehicle_type', 'city')
    search_fields = ('name', 'email', 'phone', 'vehicle_license_plate')
    readonly_fields = ('created_at', 'updated_at', 'join_date', 'last_active')
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'email', 'phone', 'status', 'address', 'city')
        }),
        ('Véhicule', {
            'fields': ('vehicle_type', 'vehicle_license_plate', 'vehicle_make', 'vehicle_model', 'vehicle_status')
        }),
        ('Documents & Vérification', {
            'fields': ('license_status', 'id_status', 'insurance_status', 'background_check_status')
        }),
        ('Performances & Gains', {
            'fields': ('rating', 'total_deliveries', 'total_earnings', 'earnings_this_month')
        }),
    )
    
    actions = ['approve_documents', 'suspend_drivers']

    @admin.action(description='Approuver les documents sélectionnés')
    def approve_documents(self, request, queryset):
        queryset.update(license_status='verified', id_status='verified', status='active')

    @admin.action(description='Suspendre les chauffeurs sélectionnés')
    def suspend_drivers(self, request, queryset):
        queryset.update(status='suspended')
