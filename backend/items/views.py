from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.authentication import JWTAuthentication
from stores.models import Store
from .models import Item
from .serializers import ItemSerializer


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
        
        items = Item.objects.filter(store_id=store_id).order_by('-created_at')
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)


class AllItemListView(APIView):
    """
    GET /api/items/
    Liste tous les items (produits et services) globalement.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = Item.objects.all().order_by('-created_at')
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)


class ProductListView(ItemListView):
    """Backward compatibility: GET /api/products/store/<store_id>/"""
    def get(self, request, store_id):
        if not Store.objects.filter(id=store_id).exists():
            return Response({'error': 'Boutique introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        
        products = Item.objects.filter(store_id=store_id, item_type='product').order_by('-created_at')
        serializer = ItemSerializer(products, many=True)
        return Response(serializer.data)


class AllProductListView(AllItemListView):
    """Backward compatibility: GET /api/products/"""
    def get(self, request):
        products = Item.objects.filter(item_type='product').order_by('-created_at')
        serializer = ItemSerializer(products, many=True)
        return Response(serializer.data)
