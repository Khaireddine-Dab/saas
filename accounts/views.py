from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .models import UserProfile
from .serializers import UserSerializer, UserRegistrationSerializer

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    """Inscription d'un nouvel utilisateur"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Connexion utilisateur"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if email and password:
        user = authenticate(request, username=email, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            })
        else:
            return Response(
                {'error': 'Identifiants invalides'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
    return Response(
        {'error': 'Email et mot de passe requis'}, 
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Déconnexion utilisateur"""
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Déconnexion réussie'})
    except:
        return Response(
            {'error': 'Erreur lors de la déconnexion'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Profil utilisateur"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_dashboard_view(request):
    """Tableau de bord utilisateur"""
    user = request.user
    data = {
        'user': UserSerializer(user).data,
        'organizations': [],
        'subscription': None,
        'stats': {
            'total_organizations': 0,
            'active_subscription': False,
        }
    }
    
    # Organisations de l'utilisateur
    organizations = user.organization_memberships.filter(is_active=True)
    for membership in organizations:
        data['organizations'].append({
            'id': membership.organization.id,
            'name': membership.organization.name,
            'role': membership.role
        })
    
    # Abonnement actif
    active_subscription = user.subscriptions.filter(status='active').first()
    if active_subscription:
        data['subscription'] = {
            'id': active_subscription.id,
            'plan_name': active_subscription.plan.name,
            'status': active_subscription.status,
            'current_period_end': active_subscription.current_period_end
        }
        data['stats']['active_subscription'] = True
    
    data['stats']['total_organizations'] = len(data['organizations'])
    
    return Response(data)