from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import Plan, Subscription, Invoice, Usage
from .serializers import PlanSerializer, SubscriptionSerializer, InvoiceSerializer, UsageSerializer

User = get_user_model()


class PlanListView(generics.ListAPIView):
    """Liste des plans disponibles"""
    queryset = Plan.objects.filter(is_active=True)
    serializer_class = PlanSerializer
    permission_classes = [AllowAny]


class UserSubscriptionView(generics.ListCreateAPIView):
    """Abonnements de l'utilisateur"""
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)


class SubscriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détails d'un abonnement"""
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_subscription_view(request, plan_id):
    """Créer un nouvel abonnement"""
    plan = get_object_or_404(Plan, id=plan_id, is_active=True)
    user = request.user
    
    # Vérifier s'il y a déjà un abonnement actif
    active_subscription = Subscription.objects.filter(
        user=user, 
        status__in=['active', 'trialing']
    ).first()
    
    if active_subscription:
        return Response(
            {'error': 'Vous avez déjà un abonnement actif'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Calculer les dates
    now = timezone.now()
    if plan.interval == 'monthly':
        period_end = now + timedelta(days=30)
    elif plan.interval == 'yearly':
        period_end = now + timedelta(days=365)
    else:  # lifetime
        period_end = now + timedelta(days=36500)  # 100 ans
    
    # Créer l'abonnement
    subscription = Subscription.objects.create(
        user=user,
        plan=plan,
        current_period_start=now,
        current_period_end=period_end,
        status='active'
    )
    
    # Créer la première facture
    Invoice.objects.create(
        subscription=subscription,
        amount=plan.price,
        currency=plan.currency,
        status='paid',
        due_date=now,
        paid_at=now
    )
    
    return Response(
        SubscriptionSerializer(subscription).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_subscription_view(request, subscription_id):
    """Annuler un abonnement"""
    subscription = get_object_or_404(
        Subscription, 
        id=subscription_id, 
        user=request.user
    )
    
    if subscription.status not in ['active', 'trialing']:
        return Response(
            {'error': 'Cet abonnement n\'est pas actif'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    subscription.status = 'canceled'
    subscription.canceled_at = timezone.now()
    subscription.save()
    
    return Response({
        'message': 'Abonnement annulé avec succès',
        'subscription': SubscriptionSerializer(subscription).data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def subscription_usage_view(request, subscription_id):
    """Utilisation d'un abonnement"""
    subscription = get_object_or_404(
        Subscription, 
        id=subscription_id, 
        user=request.user
    )
    
    # Récupérer l'utilisation actuelle
    usage_records = Usage.objects.filter(subscription=subscription)
    
    data = {
        'subscription': SubscriptionSerializer(subscription).data,
        'usage': UsageSerializer(usage_records, many=True).data,
        'limits': {
            'max_users': subscription.plan.max_users,
            'max_storage': subscription.plan.max_storage,
        }
    }
    
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_invoices_view(request):
    """Factures de l'utilisateur"""
    user = request.user
    subscriptions = Subscription.objects.filter(user=user)
    invoices = Invoice.objects.filter(subscription__in=subscriptions).order_by('-created_at')
    
    return Response(InvoiceSerializer(invoices, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_usage_view(request, subscription_id):
    """Mettre à jour l'utilisation des ressources"""
    subscription = get_object_or_404(
        Subscription, 
        id=subscription_id, 
        user=request.user
    )
    
    metric = request.data.get('metric')
    value = request.data.get('value')
    
    if not metric or value is None:
        return Response(
            {'error': 'Metric et value requis'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Récupérer la limite selon le plan
    if metric == 'users':
        limit = subscription.plan.max_users
    elif metric == 'storage':
        limit = subscription.plan.max_storage
    else:
        limit = 0
    
    # Créer ou mettre à jour l'enregistrement d'utilisation
    now = timezone.now()
    usage, created = Usage.objects.update_or_create(
        subscription=subscription,
        metric=metric,
        period_start=now.replace(day=1, hour=0, minute=0, second=0, microsecond=0),
        defaults={
            'value': value,
            'limit': limit,
            'period_end': now.replace(day=1, hour=0, minute=0, second=0, microsecond=0) + timedelta(days=32)
        }
    )
    
    return Response({
        'message': 'Utilisation mise à jour',
        'usage': UsageSerializer(usage).data
    })