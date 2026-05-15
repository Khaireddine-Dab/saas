from django.urls import path
from .views import (
    DriverListView,
    DriverDetailView,
    DriverCreateView,
    DriverUpdateView,
    DriverDeleteView,
    DriverStatusView,
    DriverSearchView,
    DriversByStatusView,
    DriversByVehicleTypeView,
)

urlpatterns = [
    # List and Create
    path('list/', DriverListView.as_view(), name='driver-list'),
    path('add/', DriverCreateView.as_view(), name='driver-create'),
    
    # Detail, Update, Delete
    path('<uuid:pk>/', DriverDetailView.as_view(), name='driver-detail'),
    path('<uuid:pk>/update/', DriverUpdateView.as_view(), name='driver-update'),
    path('<uuid:pk>/delete/', DriverDeleteView.as_view(), name='driver-delete'),
    path('<uuid:pk>/status/', DriverStatusView.as_view(), name='driver-status'),
    
    # Search and Filter
    path('search/', DriverSearchView.as_view(), name='driver-search'),
    path('by-status/<str:driver_status>/', DriversByStatusView.as_view(), name='driver-by-status'),
    path('by-vehicle/<str:vehicle_type>/', DriversByVehicleTypeView.as_view(), name='driver-by-vehicle'),
]
