from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .serializers import MeSerializer


class MeView(generics.RetrieveUpdateAPIView):
    """Current operator profile (first/last name, username, email)."""

    serializer_class = MeSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_object(self):
        return self.request.user
