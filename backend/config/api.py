from rest_framework import permissions, viewsets


class IsOwner(permissions.BasePermission):
    """Object-level guard: only the owner may touch the row."""

    message = 'You do not own this object.'

    def has_object_permission(self, request, view, obj):
        return getattr(obj, 'owner_id', None) == request.user.id


class OwnerViewSet(viewsets.ModelViewSet):
    """CRUD scoped to request.user. All dashboard viewsets inherit this."""

    permission_classes = [permissions.IsAuthenticated, IsOwner]
    owner_field = 'owner'

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(**{self.owner_field: self.request.user})

    def perform_create(self, serializer):
        serializer.save(**{self.owner_field: self.request.user})
