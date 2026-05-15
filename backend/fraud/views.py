from rest_framework import viewsets, response, status
from rest_framework.decorators import action
from .models import BookingFraudCheck, OrderFraudCheck
from .serializers import FraudAlertSerializer
from itertools import chain

class FraudAlertViewSet(viewsets.ViewSet):
    """
    ViewSet for handling both Booking and Order fraud checks.
    Provides a unified interface for the frontend.
    """
    
    def list(self, request):
        # Fetch all checks with optimizations
        booking_checks = BookingFraudCheck.objects.all()
        order_checks = OrderFraudCheck.objects.select_related('order').all()
        
        # Combine and sort by date
        combined = sorted(
            list(chain(booking_checks, order_checks)),
            key=lambda x: x.checked_at,
            reverse=True
        )
        
        serializer = FraudAlertSerializer(combined, many=True)
        return response.Response(serializer.data)

    @action(detail=False, methods=['get'])
    def metrics(self, request):
        # Calculate metrics for the dashboard
        booking_checks = BookingFraudCheck.objects.all()
        order_checks = OrderFraudCheck.objects.all()
        
        all_checks = list(chain(booking_checks, order_checks))
        total = len(all_checks)
        
        if total == 0:
            return response.Response({
                "totalAlerts": 0,
                "openAlerts": 0,
                "criticalAlerts": 0,
                "avgResolutionTime": 0,
                "resolvedAlerts": 0,
                "falsePositiveRate": 0
            })

        open_alerts = sum(1 for c in all_checks if c.recommendation == 'reject')
        critical = sum(1 for c in all_checks if c.level == 'blocked')
        resolved = sum(1 for c in all_checks if c.recommendation == 'approve')
        
        return response.Response({
            "totalAlerts": total,
            "openAlerts": open_alerts,
            "criticalAlerts": critical,
            "avgResolutionTime": 4.5,  # Mock value for now
            "resolvedAlerts": resolved,
            "falsePositiveRate": 0.05  # Mock value for now
        })
