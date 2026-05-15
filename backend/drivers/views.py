from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.authentication import JWTAuthentication
from django.db.models import Q
from .models import Driver
from .serializers import DriverSerializer, DriverListSerializer, DriverUpdateSerializer


class DriverListView(APIView):
    """
    GET /api/drivers/list/
    Liste tous les livreurs (Admin).
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Optionnel: filtrer par status
        status_filter = request.query_params.get('status')
        
        drivers = Driver.objects.all().order_by('-created_at')
        
        if status_filter:
            drivers = drivers.filter(status=status_filter)
        
        serializer = DriverListSerializer(drivers, many=True)
        return Response(serializer.data)


class DriverDetailView(APIView):
    """
    GET /api/drivers/<id>/
    Récupère les détails d'un livreur.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            driver = Driver.objects.get(pk=pk)
            serializer = DriverSerializer(driver)
            return Response(serializer.data)
        except Driver.DoesNotExist:
            return Response({'error': 'Livreur introuvable.'}, status=status.HTTP_404_NOT_FOUND)


class DriverCreateView(APIView):
    """
    POST /api/drivers/add/
    Crée un nouveau livreur.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DriverSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DriverUpdateView(APIView):
    """
    PATCH /api/drivers/<id>/update/
    Met à jour un livreur (partial).
    
    PUT /api/drivers/<id>/update/
    Remplace complètement un livreur.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            driver = Driver.objects.get(pk=pk)
            serializer = DriverUpdateSerializer(driver, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(DriverSerializer(driver).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Driver.DoesNotExist:
            return Response({'error': 'Livreur introuvable.'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            driver = Driver.objects.get(pk=pk)
            serializer = DriverUpdateSerializer(driver, data=request.data, partial=False)
            if serializer.is_valid():
                serializer.save()
                return Response(DriverSerializer(driver).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Driver.DoesNotExist:
            return Response({'error': 'Livreur introuvable.'}, status=status.HTTP_404_NOT_FOUND)


class DriverDeleteView(APIView):
    """
    DELETE /api/drivers/<id>/delete/
    Supprime un livreur.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            driver = Driver.objects.get(pk=pk)
            driver.delete()
            return Response({'success': 'Livreur supprimé avec succès.'}, status=status.HTTP_204_NO_CONTENT)
        except Driver.DoesNotExist:
            return Response({'error': 'Livreur introuvable.'}, status=status.HTTP_404_NOT_FOUND)


class DriverStatusView(APIView):
    """
    PATCH /api/drivers/<id>/status/
    Met à jour le statut d'un livreur.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            driver = Driver.objects.get(pk=pk)
            new_status = request.data.get('status')
            
            if not new_status or new_status not in dict(Driver.Status.choices):
                return Response(
                    {'error': 'Statut invalide.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            driver.status = new_status
            driver.save()
            return Response(DriverSerializer(driver).data)
        except Driver.DoesNotExist:
            return Response({'error': 'Livreur introuvable.'}, status=status.HTTP_404_NOT_FOUND)


class DriverSearchView(APIView):
    """
    GET /api/drivers/search/?q=<query>
    Recherche les livreurs par nom, email ou téléphone.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({'error': 'Paramètre de recherche requis.'}, status=status.HTTP_400_BAD_REQUEST)
        
        drivers = Driver.objects.filter(
            Q(name__icontains=query) |
            Q(email__icontains=query) |
            Q(phone__icontains=query)
        ).order_by('-created_at')
        
        serializer = DriverListSerializer(drivers, many=True)
        return Response(serializer.data)


class DriversByStatusView(APIView):
    """
    GET /api/drivers/by-status/<status>/
    Liste les livreurs avec un statut spécifique.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, driver_status):
        drivers = Driver.objects.filter(status=driver_status).order_by('-created_at')
        
        if not drivers.exists():
            return Response([])
        
        serializer = DriverListSerializer(drivers, many=True)
        return Response(serializer.data)


class DriversByVehicleTypeView(APIView):
    """
    GET /api/drivers/by-vehicle/<vehicle_type>/
    Liste les livreurs avec un type de véhicule spécifique.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, vehicle_type):
        drivers = Driver.objects.filter(vehicle_type=vehicle_type).order_by('-created_at')
        
        if not drivers.exists():
            return Response([])
        
        serializer = DriverListSerializer(drivers, many=True)
        return Response(serializer.data)
