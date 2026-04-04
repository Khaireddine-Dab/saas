from rest_framework import serializers
from .models import Product
from stores.serializers import StoreSerializer

class ProductSerializer(serializers.ModelSerializer):
    store_details = StoreSerializer(source='store', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'store', 'store_details', 'name', 'description',
            'category', 'price', 'price_unit', 'main_image', 'status', 
            'created_at', 'updated_at', 'rating_average', 'total_reviews'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
