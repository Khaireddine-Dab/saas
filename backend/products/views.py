from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.authentication import JWTAuthentication
from stores.models import Store
from .models import Product
from .serializers import ProductSerializer

class ProductListView(APIView):
    """
    GET /api/products/store/<store_id>/
    Liste tous les produits pour une boutique spécifique.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, store_id):
        # Vérifier si la boutique existe
        if not Store.objects.filter(id=store_id).exists():
            return Response({'error': 'Boutique introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        
        products = Product.objects.filter(store_id=store_id).order_by('-created_at')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class AllProductListView(APIView):
    """
    GET /api/products/
    Liste tous les produits globalement.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.all().order_by('-created_at')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
