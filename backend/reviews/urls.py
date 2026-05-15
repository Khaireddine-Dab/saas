from django.urls import path
from .views import (
    ReviewListView,
    ReviewDetailView,
    ReviewCreateView,
    ReviewUpdateView,
    ReviewDeleteView,
    ReviewModerationView,
    ReviewByProductView,
    ReviewByStoreView,
    ReviewByUserView,
    ReviewSearchView,
    ReviewFlagView,
    ReviewHelpfulView,
    ReviewByStatusView,
)

urlpatterns = [
    # List and Create
    path('list/', ReviewListView.as_view(), name='review-list'),
    path('add/', ReviewCreateView.as_view(), name='review-create'),
    
    # Detail, Update, Delete
    path('<uuid:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    path('<uuid:pk>/update/', ReviewUpdateView.as_view(), name='review-update'),
    path('<uuid:pk>/delete/', ReviewDeleteView.as_view(), name='review-delete'),
    path('<uuid:pk>/moderate/', ReviewModerationView.as_view(), name='review-moderate'),
    path('<uuid:pk>/flag/', ReviewFlagView.as_view(), name='review-flag'),
    path('<uuid:pk>/helpful/', ReviewHelpfulView.as_view(), name='review-helpful'),
    
    # Filter and Search
    path('search/', ReviewSearchView.as_view(), name='review-search'),
    path('by-status/<str:review_status>/', ReviewByStatusView.as_view(), name='review-by-status'),
    path('by-product/<uuid:product_id>/', ReviewByProductView.as_view(), name='review-by-product'),
    path('by-store/<uuid:store_id>/', ReviewByStoreView.as_view(), name='review-by-store'),
    path('by-user/<uuid:user_id>/', ReviewByUserView.as_view(), name='review-by-user'),
]
