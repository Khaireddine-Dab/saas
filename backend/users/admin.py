from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'full_name', 'role', 'status', 'display_platforms', 'created_at')
    list_filter = ('role', 'status', 'used_web', 'used_mobile', 'city')
    search_fields = ('email', 'full_name', 'phone')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['suspend_users', 'activate_users']

    @admin.display(description='Plateformes')
    def display_platforms(self, obj):
        platforms = []
        if obj.used_web:
            platforms.append("🌐 Web")
        if obj.used_mobile:
            platforms.append("📱 Mobile")
        
        if obj.used_web and obj.used_mobile:
            return "💎 Hybride (Both)"
        return " | ".join(platforms) if platforms else "Aucune"

    @admin.action(description='Suspendre les utilisateurs sélectionnés')
    def suspend_users(self, request, queryset):
        rows_updated = queryset.update(status='suspended')
        self.message_user(request, f"{rows_updated} utilisateur(s) suspendu(s).")

    @admin.action(description='Activer les utilisateurs sélectionnés')
    def activate_users(self, request, queryset):
        rows_updated = queryset.update(status='active')
        self.message_user(request, f"{rows_updated} utilisateur(s) activé(s) avec succès.")
