from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Permission permettant l'accès uniquement aux utilisateurs ayant le rôle ADMIN.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and str(request.user.role).upper() == 'ADMIN')

class IsProUser(permissions.BasePermission):
    """
    Permission permettant l'accès uniquement aux utilisateurs ayant le rôle PRO ou ADMIN.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        role = str(request.user.role).upper()
        return role in [ 'ADMIN']
