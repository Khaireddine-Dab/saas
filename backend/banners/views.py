from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum, Avg, Q

from .models import Banner
from .serializers import (
    BannerListSerializer,
    BannerDetailSerializer,
    BannerCreateUpdateSerializer,
)


class BannerListView(APIView):
    """
    GET: List all banners (optionally filtered by store and status)
    POST: Create a new banner
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve banners with optional filters"""
        store_id = request.query_params.get('store_id')
        status_filter = request.query_params.get('status')
        placement = request.query_params.get('placement')

        queryset = Banner.objects.all()

        if store_id:
            queryset = queryset.filter(store_id=store_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if placement:
            queryset = queryset.filter(placement=placement)

        serializer = BannerListSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data,
        })

    def post(self, request):
        """Create a new banner"""
        serializer = BannerCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BannerDetailView(APIView):
    """
    GET: Retrieve a specific banner
    PUT: Update a specific banner
    DELETE: Delete a specific banner
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_banner(self, pk):
        """Helper to get banner or return 404"""
        try:
            return Banner.objects.get(pk=pk)
        except Banner.DoesNotExist:
            return None

    def get(self, request, pk):
        """Retrieve a specific banner"""
        banner = self.get_banner(pk)
        if not banner:
            return Response(
                {'detail': 'Banner not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = BannerDetailSerializer(banner)
        return Response(serializer.data)

    def put(self, request, pk):
        """Update a specific banner"""
        banner = self.get_banner(pk)
        if not banner:
            return Response(
                {'detail': 'Banner not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = BannerCreateUpdateSerializer(banner, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete a specific banner"""
        banner = self.get_banner(pk)
        if not banner:
            return Response(
                {'detail': 'Banner not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        banner.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BannerByStoreView(APIView):
    """
    GET: List banners for a specific store
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, store_id):
        """Retrieve all banners for a store"""
        status_filter = request.query_params.get('status')
        placement = request.query_params.get('placement')

        queryset = Banner.objects.filter(store_id=store_id)

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if placement:
            queryset = queryset.filter(placement=placement)

        serializer = BannerListSerializer(queryset, many=True)
        return Response({
            'store_id': store_id,
            'count': queryset.count(),
            'results': serializer.data,
        })


class ActiveBannersView(APIView):
    """
    GET: List currently active banners
    Returns banners where status='active' and dates are in range
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve active banners"""
        today = timezone.now().date()
        store_id = request.query_params.get('store_id')
        placement = request.query_params.get('placement')

        queryset = Banner.objects.filter(
            status='active',
            start_date__lte=today,
            end_date__gte=today,
        )

        if store_id:
            queryset = queryset.filter(store_id=store_id)
        if placement:
            queryset = queryset.filter(placement=placement)

        serializer = BannerListSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data,
        })


class BannerStatsView(APIView):
    """
    GET: Banner statistics and aggregates
    Returns totals, active counts, impressions, clicks, CTR
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve banner statistics"""
        store_id = request.query_params.get('store_id')

        queryset = Banner.objects.all()
        if store_id:
            queryset = queryset.filter(store_id=store_id)

        today = timezone.now().date()
        total_impressions = queryset.aggregate(Sum('impressions'))['impressions__sum'] or 0
        total_clicks = queryset.aggregate(Sum('clicks'))['clicks__sum'] or 0
        avg_click_rate = (total_clicks / total_impressions) if total_impressions > 0 else 0

        stats = {
            'total_banners': queryset.count(),
            'active_banners': queryset.filter(
                status='active',
                start_date__lte=today,
                end_date__gte=today,
            ).count(),
            'scheduled_banners': queryset.filter(
                status='scheduled',
                start_date__gt=today,
            ).count(),
            'expired_banners': queryset.filter(
                end_date__lt=today,
            ).count(),
            'total_impressions': total_impressions,
            'total_clicks': total_clicks,
            'avg_click_rate': round(avg_click_rate, 4),
        }
        return Response(stats)


class BannerImpressionView(APIView):
    """
    POST: Record a banner impression
    """
    def post(self, request, pk):
        """Record an impression for a banner"""
        try:
            banner = Banner.objects.get(pk=pk)
            banner.record_impression()
            return Response(
                {'message': 'Impression recorded', 'impressions': banner.impressions},
                status=status.HTTP_200_OK,
            )
        except Banner.DoesNotExist:
            return Response(
                {'detail': 'Banner not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )


class BannerClickView(APIView):
    """
    POST: Record a banner click
    """
    def post(self, request, pk):
        """Record a click for a banner"""
        try:
            banner = Banner.objects.get(pk=pk)
            banner.record_click()
            return Response(
                {'message': 'Click recorded', 'clicks': banner.clicks},
                status=status.HTTP_200_OK,
            )
        except Banner.DoesNotExist:
            return Response(
                {'detail': 'Banner not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
