import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from .models import User


class JWTAuthentication(BaseAuthentication):
    """Authentification via token JWT généré par Django."""

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=['HS256']
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expiré.')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Token invalide.')

        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token sans identifiant utilisateur.')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise AuthenticationFailed('Utilisateur non trouvé.')

        # Comparaison plus robuste du rôle
        current_role = str(user.role).upper()
        if current_role != "ADMIN":
            raise AuthenticationFailed(f"Accès réservé aux administrateurs (Rôle actuel: {current_role}).")

        return (user, token)
