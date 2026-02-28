from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings

from supabase import create_client, Client
from django.conf import settings as django_settings

from .models import User
from .serializers import UserSerializer, SignupSerializer, LoginSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication


def get_supabase_client() -> Client:
    """Retourne un client Supabase Admin (service role)."""
    return create_client(
        django_settings.SUPABASE_URL,
        django_settings.SUPABASE_SERVICE_KEY,
    )


def get_tokens_for_user(user):
    """Génère un JWT access + refresh token pour un utilisateur."""
    # Créer manuellement les tokens puisque User n'est pas AbstractBaseUser
    refresh = RefreshToken()
    refresh['user_id'] = str(user.id)
    refresh['email'] = user.email
    refresh['role'] = str(user.role)
    
    refresh.set_exp(lifetime=api_settings.REFRESH_TOKEN_LIFETIME)
    
    access = refresh.access_token
    access['user_id'] = str(user.id)
    access['email'] = user.email
    access['role'] = str(user.role)
    
    return {
        'refresh': str(refresh),
        'access': str(access),
    }


class SignupView(APIView):
    """
    POST /api/users/signup/
    1. Crée l'utilisateur dans Supabase Auth (auth.users)
    2. Met à jour public.users avec role=ADMIN et les infos complémentaires
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        email = data['email']
        password = data['password']
        full_name = data.get('full_name', '')
        phone = data.get('phone', '')

        supabase = get_supabase_client()

        # 1. Créer l'utilisateur dans Supabase Auth (auth.users)
        try:
            auth_response = supabase.auth.admin.create_user({
                'email': email,
                'password': password,
                'email_confirm': True,  # confirmer directement sans email
            })
        except Exception as e:
            return Response(
                {'error': f'Erreur Supabase Auth : {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        auth_user = auth_response.user
        if not auth_user:
            return Response(
                {'error': 'Impossible de créer le compte Supabase.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_uuid = auth_user.id  # UUID retourné par auth.users

        # 2. Insérer / mettre à jour dans public.users avec role ADMIN
        try:
            user, created = User.objects.update_or_create(
                id=user_uuid,
                defaults={
                    'email': email,
                    'full_name': full_name,
                    'phone': phone,
                    'role': User.Role.ADMIN,
                }
            )
        except Exception as e:
            # Nettoyer : supprimer l'utilisateur auth créé si l'insert échoue
            try:
                supabase.auth.admin.delete_user(str(user_uuid))
            except Exception:
                pass
            return Response(
                {'error': f'Erreur insertion public.users : {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        tokens = get_tokens_for_user(user)

        return Response({
            'message': 'Compte créé avec succès.',
            'user': UserSerializer(user).data,
            'tokens': tokens,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    POST /api/users/login/
    Connexion uniquement pour les utilisateurs avec le rôle ADMIN.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        supabase = get_supabase_client()

        # Authentifier via Supabase Auth
        try:
            auth_response = supabase.auth.sign_in_with_password({
                'email': email,
                'password': password,
            })
        except Exception as e:
            return Response(
                {'error': 'Email ou mot de passe incorrect.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        auth_user = auth_response.user
        if not auth_user:
            return Response(
                {'error': 'Email ou mot de passe incorrect.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Récupérer l'utilisateur dans public.users
        try:
            user = User.objects.get(id=auth_user.id)
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur introuvable dans la base de données.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Vérifier que le rôle est ADMIN
        if user.role != User.Role.ADMIN:
            return Response(
                {'error': 'Accès refusé. Seuls les administrateurs peuvent se connecter.'},
                status=status.HTTP_403_FORBIDDEN
            )

        tokens = get_tokens_for_user(user)

        return Response({
            'message': f'Bienvenue, {user.full_name or user.email} !',
            'user': UserSerializer(user).data,
            'tokens': tokens,
        }, status=status.HTTP_200_OK)


class UserListView(APIView):
    """
    GET /api/users/list/
    Liste tous les utilisateurs sauf les admins.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = getattr(user, 'role', 'N/A')
        print(f"DEBUG: UserListView request from {user.email}, Role detected: {role}")
        
        # Comparaison insensible à la casse
        if str(role).upper() != "ADMIN":
            return Response(
                {"detail": f"Accès réservé aux administrateurs. Votre rôle: {role}"},
                status=status.HTTP_403_FORBIDDEN
            )

        users = User.objects.exclude(role=User.Role.ADMIN).order_by('-created_at')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class MeView(APIView):
    """
    GET  /api/users/me/  → Profil de l'utilisateur connecté
    PATCH /api/users/me/ → Modifier son profil
    DELETE /api/users/me/ → Supprimer son compte
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        """Supprimer le compte de l'utilisateur connecté"""
        user = request.user
        supabase = get_supabase_client()
        
        user_id = str(user.id)
        email = user.email
        
        try:
            # Supprimer de Supabase Auth
            supabase.auth.admin.delete_user(user_id)
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la suppression du compte Supabase: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Supprimer de la base de données Django
            user.delete()
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la suppression du compte: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(
            {'message': f'Compte {email} supprimé avec succès.'},
            status=status.HTTP_200_OK
        )


class UserDetailView(APIView):
    """
    GET  /api/users/{id}/ → Récupérer les infos d'un utilisateur (admin seulement)
    PATCH /api/users/{id}/ → Modifier un utilisateur (admin seulement)
    DELETE /api/users/{id}/ → Supprimer un utilisateur (admin seulement)
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def _check_admin(self, user):
        """Vérifier que l'utilisateur est admin"""
        if str(user.role).upper() != "ADMIN":
            return False
        return True
    
    def get(self, request, user_id):
        if not self._check_admin(request.user):
            return Response(
                {'error': 'Accès réservé aux administrateurs.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur non trouvé.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(UserSerializer(user).data)
    
    def patch(self, request, user_id):
        """Modifier les informations d'un utilisateur"""
        if not self._check_admin(request.user):
            return Response(
                {'error': 'Accès réservé aux administrateurs.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur non trouvé.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, user_id):
        """Supprimer un utilisateur"""
        if not self._check_admin(request.user):
            return Response(
                {'error': 'Accès réservé aux administrateurs.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur non trouvé.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        email = user.email
        supabase = get_supabase_client()
        
        try:
            # Supprimer de Supabase Auth
            supabase.auth.admin.delete_user(user_id)
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la suppression du compte Supabase: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Supprimer de la base de données Django
            user.delete()
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la suppression du compte: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(
            {'message': f'Utilisateur {email} supprimé avec succès.'},
            status=status.HTTP_200_OK
        )
