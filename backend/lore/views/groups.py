"""The view for the groups."""

from typing import cast, ClassVar, Any
from django.contrib.auth.models import AnonymousUser
from django.http import HttpRequest, HttpResponseBadRequest
from rest_framework import viewsets, permissions
from rest_framework.exceptions import NotAuthenticated, ParseError
from rest_framework.views import Response

import lore.models as models
import lore.serializers as serializers


class GroupViewSet(viewsets.ModelViewSet):
    """Queryset for groups"""

    queryset = models.LoreGroup.groups.all()
    serializer_class = serializers.GroupSerializer
    permission_classes: ClassVar[list[Any]] = [permissions.IsAuthenticated]

    def create(self, request: HttpRequest) -> Response:
        """Route to create a group with the name and the logged in user."""
        name = request.POST["name"]
        if name is None:
            msg = "Expected group name"
            raise ParseError(msg)

        user: models.LoreUser = cast(models.LoreUser, request.user)
        group = models.LoreGroup.groups.create_group(name=name, owner=user)

        group_serialize = serializers.GroupSerializer(group, many=False)
        return Response(group_serialize.data)
