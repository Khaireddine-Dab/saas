from rest_framework import viewsets, permissions
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and managing service bookings.
    """
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Admins can see all bookings
        if user.role == 'ADMIN':
            return queryset
            
        # Pros see bookings for their stores
        if user.role == 'PRO':
            return queryset.filter(store__owner=user)
            
        # Clients see their own bookings
        return queryset.filter(customer=user)

    def perform_create(self, serializer):
        # Generate a booking number if not provided
        import uuid
        booking_number = f"BK-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(booking_number=booking_number, customer=self.request.user)
