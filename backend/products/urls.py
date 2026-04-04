from django.urls import path
from .views import ProductListView, AllProductListView

urlpatterns = [
    path('', AllProductListView.as_view(), name='product-list-all'),
    path('store/<int:store_id>/', ProductListView.as_view(), name='product-list-by-store'),
]
