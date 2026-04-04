from django.urls import path
from .views import OrderListView, StoreOrderListView, OrderDetailView

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list-all'),
    path('store/<int:store_id>/', StoreOrderListView.as_view(), name='order-list-by-store'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]
