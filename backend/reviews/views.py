from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import models
from users.authentication import JWTAuthentication
from django.db.models import Q
from .models import Review, ReviewFlag
from .serializers import (
    ReviewListSerializer,
    ReviewDetailSerializer,
    ReviewCreateUpdateSerializer,
    ReviewModerationSerializer,
)


class ReviewListView(APIView):
    """
    GET /api/reviews/list/
    Liste toutes les revues (Admin).
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Optionnel: filtrer par status
        status_filter = request.query_params.get('status')
        
        reviews = Review.objects.all().order_by('-created_at')
        
        if status_filter:
            reviews = reviews.filter(status=status_filter)
        
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)


class ReviewDetailView(APIView):
    """
    GET /api/reviews/<id>/
    Récupère les détails d'une revue.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
            serializer = ReviewDetailSerializer(review)
            return Response(serializer.data)
        except Review.DoesNotExist:
            return Response({'error': 'Revue introuvable.'}, status=status.HTTP_404_NOT_FOUND)


class ReviewCreateView(APIView):
    """
    POST /api/reviews/add/
    Crée une nouvelle revue.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ReviewCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(ReviewDetailSerializer(Review.objects.get(pk=serializer.data['id'])).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewUpdateView(APIView):
    """
    PATCH /api/reviews/<id>/update/
    Met à jour une revue (partial).
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
            serializer = ReviewCreateUpdateSerializer(review, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(ReviewDetailSerializer(review).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Review.DoesNotExist:
            return Response({'error': 'Revue introuvable.'}, status=status.HTTP_404_NOT_FOUND)


class ReviewDeleteView(APIView):
    """
    DELETE /api/reviews/<id>/delete/
    Supprime une revue.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
            review.delete()
            return Response({'success': 'Revue supprimée avec succès.'}, status=status.HTTP_204_NO_CONTENT)
        except Review.DoesNotExist:
            return Response({'error': 'Revue introuvable.'}, status=status.HTTP_404_NOT_FOUND)


class ReviewModerationView(APIView):
    """
    PATCH /api/reviews/<id>/moderate/
    Modère une revue (changement de statut).
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
            serializer = ReviewModerationSerializer(review, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(ReviewDetailSerializer(review).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Review.DoesNotExist:
            return Response({'error': 'Revue introuvable.'}, status=status.HTTP_404_NOT_FOUND)


class ReviewByProductView(APIView):
    """
    GET /api/reviews/by-product/<product_id>/
    Liste les revues d'un produit spécifique.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, product_id):
        reviews = Review.objects.filter(product_id=product_id).order_by('-created_at')
        
        if not reviews.exists():
            return Response([])
        
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)


class ReviewByStoreView(APIView):
    """
    GET /api/reviews/by-store/<store_id>/
    Liste les revues d'une boutique spécifique.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, store_id):
        reviews = Review.objects.filter(store_id=store_id).order_by('-created_at')
        
        if not reviews.exists():
            return Response([])
        
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)


class ReviewByUserView(APIView):
    """
    GET /api/reviews/by-user/<user_id>/
    Liste les revues d'un utilisateur spécifique.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        reviews = Review.objects.filter(user_id=user_id).order_by('-created_at')
        
        if not reviews.exists():
            return Response([])
        
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)


class ReviewSearchView(APIView):
    """
    GET /api/reviews/search/?q=<query>
    Recherche les revues par contenu ou titre.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({'error': 'Paramètre de recherche requis.'}, status=status.HTTP_400_BAD_REQUEST)
        
        reviews = Review.objects.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query)
        ).order_by('-created_at')
        
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)


class ReviewFlagView(APIView):
    """
    POST /api/reviews/<id>/flag/
    Signale une revue.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
            reason = request.data.get('reason', 'other')
            
            # Créer ou mettre à jour le flag
            flag, created = ReviewFlag.objects.get_or_create(
                review=review,
                reason=reason,
                defaults={'count': 1, 'description': request.data.get('description')}
            )
            
            if not created:
                flag.count += 1
                flag.save()
            
            # Mettre à jour le flag_count sur la revue
            review.flag_count = ReviewFlag.objects.filter(review=review).aggregate(models.Sum('count'))['count__sum'] or 0
            review.flagged = True
            review.save()

            from notifications.services import notify_admins
            notify_admins(
                title='Review reported',
                description=f'Review #{review.id} was flagged as {reason}.',
                notification_type='review',
                link=f'/dashboard/reviews?review_id={review.id}',
                metadata={'review_id': review.id, 'reason': reason},
                exclude_user_id=request.user.id,
            )
            
            return Response(ReviewDetailSerializer(review).data, status=status.HTTP_201_CREATED)
        except Review.DoesNotExist:
            return Response({'error': 'Revue introuvable.'}, status=status.HTTP_404_NOT_FOUND)


class ReviewHelpfulView(APIView):
    """
    PATCH /api/reviews/<id>/helpful/
    Marque une revue comme utile/inutile.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
            action = request.data.get('action', 'helpful')  # 'helpful' or 'unhelpful'
            
            if action == 'helpful':
                review.helpful += 1
            elif action == 'unhelpful':
                review.unhelpful += 1
            
            review.save()
            return Response(ReviewDetailSerializer(review).data)
        except Review.DoesNotExist:
            return Response({'error': 'Revue introuvable.'}, status=status.HTTP_404_NOT_FOUND)


class ReviewByStatusView(APIView):
    """
    GET /api/reviews/by-status/<status>/
    Liste les revues avec un statut spécifique.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, review_status):
        reviews = Review.objects.filter(status=review_status).order_by('-created_at')
        
        if not reviews.exists():
            return Response([])
        
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)
