from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from users.authentication import JWTAuthentication
from stores.models import Store
from .models import Promotion
from .serializers import (
    PromotionListSerializer,
    PromotionDetailSerializer,
    PromotionCreateUpdateSerializer
)


class PromotionListView(APIView):
    """
    GET /api/promotions/
    Liste toutes les promotions avec filtres optionnels
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Filtres optionnels
        store_id = request.query_params.get('store_id')
        active_only = request.query_params.get('active', 'false').lower() == 'true'
        
        promotions = Promotion.objects.all()
        
        if store_id:
            promotions = promotions.filter(store_id=store_id)
        
        if active_only:
            today = timezone.now().date()
            promotions = promotions.filter(
                active=True,
                valid_from__lte=today,
                valid_until__gte=today
            )
        
        serializer = PromotionListSerializer(promotions, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """POST /api/promotions/ - Créer une nouvelle promotion"""
        serializer = PromotionCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            promotion = serializer.save()
            return Response(
                PromotionDetailSerializer(promotion).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PromotionDetailView(APIView):
    """
    GET /api/promotions/<id>/
    PUT /api/promotions/<id>/
    DELETE /api/promotions/<id>/
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        try:
            return Promotion.objects.get(pk=pk)
        except Promotion.DoesNotExist:
            return None
    
    def get(self, request, pk):
        promotion = self.get_object(pk)
        if not promotion:
            return Response(
                {'error': 'Promotion non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = PromotionDetailSerializer(promotion)
        return Response(serializer.data)
    
    def put(self, request, pk):
        promotion = self.get_object(pk)
        if not promotion:
            return Response(
                {'error': 'Promotion non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = PromotionCreateUpdateSerializer(promotion, data=request.data, partial=True)
        if serializer.is_valid():
            promotion = serializer.save()
            return Response(PromotionDetailSerializer(promotion).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        promotion = self.get_object(pk)
        if not promotion:
            return Response(
                {'error': 'Promotion non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )
        promotion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PromotionByStoreView(APIView):
    """
    GET /api/promotions/store/<store_id>/
    Liste toutes les promotions d'une boutique
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, store_id):
        if not Store.objects.filter(id=store_id).exists():
            return Response(
                {'error': 'Boutique introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        promotions = Promotion.objects.filter(store_id=store_id).order_by('-valid_from')
        serializer = PromotionListSerializer(promotions, many=True)
        return Response(serializer.data)


class ActivePromotionsView(APIView):
    """
    GET /api/promotions/active/
    Liste uniquement les promotions actuellement actives
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        today = timezone.now().date()
        promotions = Promotion.objects.filter(
            active=True,
            valid_from__lte=today,
            valid_until__gte=today
        ).order_by('-valid_from')
        
        serializer = PromotionListSerializer(promotions, many=True)
        return Response(serializer.data)


class PromotionStatsView(APIView):
    """
    GET /api/promotions/stats/
    Statistiques sur les promotions
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        today = timezone.now().date()
        
        total = Promotion.objects.count()
        active = Promotion.objects.filter(
            active=True,
            valid_from__lte=today,
            valid_until__gte=today
        ).count()
        upcoming = Promotion.objects.filter(valid_from__gt=today).count()
        expired = Promotion.objects.filter(valid_until__lt=today).count()
        
        return Response({
            'total_promotions': total,
            'active_promotions': active,
            'upcoming_promotions': upcoming,
            'expired_promotions': expired
        })
