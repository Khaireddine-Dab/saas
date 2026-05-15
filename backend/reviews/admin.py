from django.contrib import admin
from .models import Review, ReviewFlag

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'store', 'rating', 'sentiment_label', 'is_approved', 'created_at')
    list_filter = ('rating', 'sentiment_label', 'is_approved', 'is_spam')
    search_fields = ('comment', 'author__email', 'store__name')
    readonly_fields = ('sentiment_score', 'sentiment_label', 'created_at', 'updated_at')

@admin.register(ReviewFlag)
class ReviewFlagAdmin(admin.ModelAdmin):
    list_display = ('id', 'review', 'reason', 'count', 'status', 'created_at')
    list_filter = ('reason', 'status')
    search_fields = ('description', 'review__id')
    actions = ['mark_as_resolved']

    @admin.action(description='Marquer comme résolu')
    def mark_as_resolved(self, request, queryset):
        queryset.update(status='resolved')
