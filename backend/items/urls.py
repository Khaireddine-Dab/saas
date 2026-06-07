from django.urls import path
from .views import (
    ItemListView, AllItemListView,
    ProductListView, AllProductListView,
    DeleteOrphanedItemsView, ListOrphanedItemsView
)

urlpatterns = [
    # New items endpoints
    path('', AllItemListView.as_view(), name='item-list-all'),
    path('store/<int:store_id>/', ItemListView.as_view(), name='item-list-by-store'),
    path('orphaned/', ListOrphanedItemsView.as_view(), name='list-orphaned-items'),
    path('orphaned/delete/', DeleteOrphanedItemsView.as_view(), name='delete-orphaned-items'),
    
    # Backward compatibility: products endpoints
    path('products/', AllProductListView.as_view(), name='product-list-all'),
    path('products/store/<int:store_id>/', ProductListView.as_view(), name='product-list-by-store'),
]
