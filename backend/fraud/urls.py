from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FraudAlertViewSet

router = DefaultRouter()
router.register(r'alerts', FraudAlertViewSet, basename='fraud-alerts')

urlpatterns = [
    path('', include(router.urls)),
]
