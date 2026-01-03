# formations/permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour n'autoriser que l'auteur à modifier ou supprimer sa formation.
    """

    def has_object_permission(self, request, view, obj):
        # Autoriser toujours les lectures
        if request.method in permissions.SAFE_METHODS:
            return True

        # Écriture autorisée uniquement à l'auteur
        return obj.user == request.user
