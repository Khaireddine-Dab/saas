from django.urls import path
from .views import (
    PromotionListView,
    PromotionDetailView,
    PromotionByStoreView,
    ActivePromotionsView,
    PromotionStatsView
)

urlpatterns = [
    # Main endpoints
    path('', PromotionListView.as_view(), name='promotion-list'),
    path('<int:pk>/', PromotionDetailView.as_view(), name='promotion-detail'),
    
    # Store-specific
    path('store/<int:store_id>/', PromotionByStoreView.as_view(), name='promotion-by-store'),
    
    # Status-specific
    path('active/', ActivePromotionsView.as_view(), name='promotion-active'),
    
    # Statistics
    path('stats/', PromotionStatsView.as_view(), name='promotion-stats'),
]
