from django.urls import path
from .views import PendingStoreListView, StoreActionView, StoreListView, RatingStore

urlpatterns = [
    path('', StoreListView.as_view(), name='store-list'),
    path('pending/', PendingStoreListView.as_view(), name='pending-stores'),
    path('<int:store_id>/rating/', RatingStore.as_view(), name='store-rating'),
    path('<int:pk>/<str:action>/', StoreActionView.as_view(), name='store-action'),
]
