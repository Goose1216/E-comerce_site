from rest_framework import permissions


class DisableOptionsPermission(permissions.BasePermission):
    """ Глобальное разрешение запретить все запросы для метода OPTIONS. """
    def has_permission(self, request, view):
        if request.method == 'OPTIONS':
            return False
        return True