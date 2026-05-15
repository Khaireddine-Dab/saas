from django.urls import path
from .views import (
    BannerListView,
    BannerDetailView,
    BannerByStoreView,
    ActiveBannersView,
    BannerStatsView,
    BannerImpressionView,
    BannerClickView,
)

app_name = 'banners'

urlpatterns = [
    # Banner CRUD
    path('', BannerListView.as_view(), name='banner-list'),
    path('<int:pk>/', BannerDetailView.as_view(), name='banner-detail'),

    # Store-specific banners
    path('store/<int:store_id>/', BannerByStoreView.as_view(), name='banners-by-store'),

    # Active banners
    path('active/', ActiveBannersView.as_view(), name='active-banners'),

    # Statistics
    path('stats/', BannerStatsView.as_view(), name='banner-stats'),

    # Impressions and clicks
    path('<int:pk>/impression/', BannerImpressionView.as_view(), name='banner-impression'),
    path('<int:pk>/click/', BannerClickView.as_view(), name='banner-click'),
]
