from django.urls import path
from .views import PendingStoreListView, StoreActionView

urlpatterns = [
    path('pending/', PendingStoreListView.as_view(), name='pending-stores'),
    path('<int:pk>/<str:action>/', StoreActionView.as_view(), name='store-action'),
]
