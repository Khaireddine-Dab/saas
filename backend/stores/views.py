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
            store.status = 'ACCEPTED'
            store.save()
            return Response({'message': 'Boutique validée avec succès.'})
            
        elif action == 'reject':
            # Optionnel : envoyer un mail au owner avant suppression
            store.delete()
            return Response({'message': 'Boutique rejetée et supprimée.'})
            
        return Response({'error': 'Action non valide.'}, status=status.HTTP_400_BAD_REQUEST)
