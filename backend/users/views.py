from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings

import uuid

from supabase import create_client
from django.conf import settings as django_settings
from django.db import connection
from django.db.utils import DatabaseError

from .models import User
from .serializers import UserSerializer, SignupSerializer, LoginSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication


def get_supabase_client():
    """Retourne un client Supabase Admin (service role)."""
    return create_client(
        django_settings.SUPABASE_URL,
        django_settings.SUPABASE_SERVICE_KEY,
    )


def sync_signup_user_as_admin(supabase, user_uuid) -> None:
    """
    Après auth.users, un trigger Supabase insère souvent public.users / public.profiles
    avec role = CLIENT. On force ADMIN côté SQL (même connexion que l’ORM) et on aligne
    profiles (rôle texte souvent en minuscules : admin).
    """
    uid = str(uuid.UUID(str(user_uuid)))
    with connection.cursor() as cursor:
        cursor.execute(
            "UPDATE public.users SET role = %s WHERE id = %s::uuid",
            [User.Role.ADMIN, uid],
        )
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE public.profiles SET role = %s WHERE id = %s::uuid",
                ["admin", uid],
            )
    except DatabaseError:
        pass
    try:
        supabase.table("users").update({"role": User.Role.ADMIN}).eq("id", uid).execute()
    except Exception:
        pass
    try:
        supabase.table("profiles").update({"role": "admin"}).eq("id", uid).execute()
    except Exception:
        pass


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
                'user_metadata': {'role': User.Role.ADMIN}
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

        user_uuid = uuid.UUID(str(auth_user.id))  # aligné sur auth.users / PK Postgres

        # 2. Insérer / mettre à jour dans public.users — rôle ADMIN par défaut pour l’inscription dashboard
        try:
            user, _created = User.objects.update_or_create(
                id=user_uuid,
                defaults={
                    'email': email,
                    'full_name': full_name,
                    'phone': phone,
                    'role': User.Role.ADMIN,
                    'status': User.Status.ACTIVE,
                }
            )
            sync_signup_user_as_admin(supabase, user_uuid)
            user.refresh_from_db()
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
        except DatabaseError as db_err:
            return Response(
                {'error': f'Erreur de connexion à la base de données. Veuillez réessayer.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Vérifier que le rôle est ADMIN (insensible à la casse vs valeur en base)
        if str(user.role or "").upper() != User.Role.ADMIN:
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


class AddUserView(APIView):
    """
    POST /api/users/add/
    Crée un nouvel utilisateur (réservé aux admins).
    Body: { email, password, full_name, phone, role }
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Vérifier que l'appelant est admin
        if str(getattr(request.user, 'role', '')).upper() != 'ADMIN':
            return Response(
                {'error': 'Accès réservé aux administrateurs.'},
                status=status.HTTP_403_FORBIDDEN
            )

        email = request.data.get('email')
        password = request.data.get('password')
        full_name = request.data.get('full_name', '')
        phone = request.data.get('phone', '')
        role = request.data.get('role', User.Role.ADMIN)

        if not email or not password:
            return Response(
                {'error': 'Email et mot de passe sont obligatoires.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Valider le rôle
        valid_roles = [r.value for r in User.Role]
        if role.upper() not in [r.upper() for r in valid_roles]:
            return Response(
                {'error': f'Rôle invalide. Rôles acceptés: {valid_roles}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        supabase = get_supabase_client()

        # 1. Créer dans Supabase Auth
        try:
            auth_response = supabase.auth.admin.create_user({
                'email': email,
                'password': password,
                'email_confirm': True,
                'user_metadata': {'role': role.upper()}
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

        user_uuid = auth_user.id

        # 2. Insérer dans public.users
        try:
            user, _ = User.objects.update_or_create(
                id=user_uuid,
                defaults={
                    'email': email,
                    'full_name': full_name,
                    'phone': phone,
                    'role': role.upper(),
                }
            )
        except Exception as e:
            try:
                supabase.auth.admin.delete_user(str(user_uuid))
            except Exception:
                pass
            return Response(
                {'error': f'Erreur insertion public.users : {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        from notifications.services import notify_user
        notify_user(
            user,
            title='Welcome to Ro2ya',
            description='Your account has been created successfully.',
            notification_type='user',
            link='/dashboard/users',
            metadata={'created_by_admin': str(request.user.id)},
        )

        return Response(
            {'message': 'Utilisateur créé avec succès.', 'user': UserSerializer(user).data},
            status=status.HTTP_201_CREATED
        )


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
        
        old_status = user.status
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.save()
            new_status = request.data.get('status')
            if new_status and new_status != old_status:
                from notifications.services import notify_user
                notify_user(
                    updated_user,
                    title='Account status updated',
                    description=f'Your account status is now: {new_status}.',
                    notification_type='user',
                    link='/dashboard/users',
                    metadata={'old_status': old_status, 'new_status': new_status},
                )
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
