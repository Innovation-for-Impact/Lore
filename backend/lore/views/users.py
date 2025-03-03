from rest_framework import viewsets

from lore import serializers
from lore.models import LoreUser


class LoreUserViewSet(viewsets.ModelViewSet):
    queryset = LoreUser.users.all()
    serializer_class = serializers.UserSerializer
