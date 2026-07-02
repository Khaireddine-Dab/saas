from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.authentication import JWTAuthentication
from .models import Store
from .serializers import StoreSerializer

class PendingStoreListView(APIView):
    """
    GET /api/stores/pending/
    Liste toutes les boutiques avec le statut PENDING.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pending_stores = Store.objects.filter(status='PENDING').order_by('-created_at')
        serializer = StoreSerializer(pending_stores, many=True)
        return Response(serializer.data)

class StoreListView(APIView):
    """
    GET /api/stores/
    Liste toutes les boutiques.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stores = Store.objects.all().order_by('-created_at')
        serializer = StoreSerializer(stores, many=True)
        return Response(serializer.data)

class StoreActionView(APIView):
    """
    POST /api/stores/{id}/validate/ -> Status ACCEPTED
    POST /api/stores/{id}/reject/  -> Suppression de la boutique
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, action):
        try:
            store = Store.objects.get(pk=pk)
        except Store.DoesNotExist:
            return Response({'error': 'Boutique introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if action == 'validate':
            store.status = 'PUBLISHED'
            store.save()

            if store.owner_id:
                from notifications.services import notify_user
                from users.models import User
                try:
                    owner = User.objects.get(id=store.owner_id)
                    store_name = getattr(store, 'name', None) or f'Store #{store.id}'
                    notify_user(
                        owner,
                        title='Store approved',
                        description=f'Your store "{store_name}" has been approved.',
                        notification_type='store',
                        link='/dashboard/merchants',
                        metadata={'store_id': store.id},
                    )
                except User.DoesNotExist:
                    pass

            return Response({'message': 'Boutique validée avec succès.'})
            
        elif action == 'reject':
            # Optionnel : envoyer un mail au owner avant suppression
            store.delete()
            return Response({'message': 'Boutique rejetée et supprimée.'})
            
        return Response({'error': 'Action non valide.'}, status=status.HTTP_400_BAD_REQUEST)

class RatingStore(APIView):
    authentication_classes =[JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, store_id):
        try:
            store = Store.objects.get(id=store_id)
        except Store.DoesNotExist:
            return Response({'error': 'Boutique introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'rating': store.rating_average,
            'review_count': store.total_reviews
        })
