from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db.models import Case, When, F, Value, IntegerField, Q
from users.authentication import JWTAuthentication
from stores.models import Store
from .models import Item
from .serializers import ItemSerializer, ItemListSerializer


class StandardPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100


class ItemListView(APIView):
    """
    GET /api/items/store/<store_id>/
    Liste tous les items (produits et services) pour une boutique spécifique.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, store_id):
        # Vérifier si la boutique existe
        if not Store.objects.filter(id=store_id).exists():
            return Response({'error': 'Boutique introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        
        items = Item.objects.filter(store_id=store_id).select_related('store').order_by('-created_at')
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)


class AllItemListView(APIView):
    """
    GET /api/items/
    Liste tous les items triés par:
    1. Items liés à un store PUBLISHED (accepté)
    2. Items liés à un store PENDING (en attente)
    3. Items orphelins (store_id = NULL)
    Avec pagination.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get(self, request):
        # Trier les items par priorité:
        # 1. Store PUBLISHED (ordre = 0)
        # 2. Store PENDING (ordre = 1)
        # 3. Items orphelins (ordre = 2)
        items = Item.objects.select_related('store').annotate(
            store_priority=Case(
                When(store__status='PUBLISHED', then=Value(0)),
                When(store__status='PENDING', then=Value(1)),
                When(store__isnull=True, then=Value(2)),
                default=Value(3),
                output_field=IntegerField()
            )
        ).order_by('store_priority', '-created_at')
        
        # Paginer les résultats
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(items, request)
        
        if page is not None:
            serializer = ItemListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = ItemListSerializer(items, many=True)
        return Response(serializer.data)


class ProductListView(ItemListView):
    """Backward compatibility: GET /api/products/store/<store_id>/"""
    def get(self, request, store_id):
        if not Store.objects.filter(id=store_id).exists():
            return Response({'error': 'Boutique introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        
        products = Item.objects.filter(store_id=store_id, item_type='product').select_related('store').order_by('-created_at')
        serializer = ItemSerializer(products, many=True)
        return Response(serializer.data)


class AllProductListView(AllItemListView):
    """Backward compatibility: GET /api/products/"""
    def get(self, request):
        # Même tri que AllItemListView mais filtré par type PRODUCT
        products = Item.objects.filter(item_type='product').select_related('store').annotate(
            store_priority=Case(
                When(store__status='PUBLISHED', then=Value(0)),
                When(store__status='PENDING', then=Value(1)),
                When(store__isnull=True, then=Value(2)),
                default=Value(3),
                output_field=IntegerField()
            )
        ).order_by('store_priority', '-created_at')
        
        # Paginer les résultats
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(products, request)
        
        if page is not None:
            serializer = ItemListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = ItemListSerializer(products, many=True)
        return Response(serializer.data)


class DeleteOrphanedItemsView(APIView):
    """
    DELETE /api/items/orphaned/
    Supprime tous les items qui ne sont pas liés à aucun store (store_id = NULL)
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        # Récupérer les items orphelins
        orphaned_items = Item.objects.filter(store__isnull=True)
        count = orphaned_items.count()
        
        if count == 0:
            return Response({
                'message': 'Aucun item orphelin trouvé.',
                'deleted_count': 0
            })
        
        # Supprimer les items orphelins
        orphaned_items.delete()
        
        return Response({
            'message': f'{count} item(s) orphelin(s) supprimé(s) avec succès.',
            'deleted_count': count
        }, status=status.HTTP_200_OK)


class ListOrphanedItemsView(APIView):
    """
    GET /api/items/orphaned/
    Liste tous les items orphelins (store_id = NULL) avec pagination.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = StandardPagination

    def get(self, request):
        # Récupérer les items orphelins
        orphaned_items = Item.objects.filter(store__isnull=True).order_by('-created_at')
        
        # Paginer les résultats
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(orphaned_items, request)
        
        if page is not None:
            serializer = ItemListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = ItemListSerializer(orphaned_items, many=True)
        return Response(serializer.data)
