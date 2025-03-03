"""The view for the groups."""

from typing import Any, ClassVar, cast

from django.http import HttpRequest
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from rest_framework.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.views import Response

from lore import models, serializers


class GroupViewSet(viewsets.ModelViewSet):
    """Queryset for groups."""

    queryset = models.LoreGroup.groups.all()
    serializer_class = serializers.GroupSerializer
    permission_classes: ClassVar[list[Any]] = [permissions.IsAuthenticated]

    def list(self, request: HttpRequest) -> Response:
        """List the groups that the user is currently in."""
        user: models.LoreUser = cast(models.LoreUser, request.user)
        groups = models.LoreGroup.groups.get_groups_with_user(user)

        context = {"request": request}
        group_serializer = self.serializer_class(
            groups,
            many=True,
            context=context,
        )
        return Response(group_serializer.data)

    def create(self, request: HttpRequest) -> Response:
        """Route to create a group with the name and the logged in user."""
        name = request.POST.get("name", None)
        if name is None:
            msg = "Expected group name"
            raise ParseError(msg)

        user: models.LoreUser = cast(models.LoreUser, request.user)
        group = models.LoreGroup.groups.create_group(name=name, owner=user)

        context = {"request": request}
        group_serialize = self.serializer_class(
            group,
            many=False,
            context=context,
        )
        return Response(group_serialize.data)

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def join(self, request: HttpRequest) -> Response:
        """Route for the logged in user to join a group.

        Expects a "join_code" in the post request
        Raises a 401 error if the join code is missing
        Raises a 404 error if there is no group with the join code
        """
        user: models.LoreUser = cast(models.LoreUser, request.user)
        join_code = request.POST.get("join_code", None)
        if join_code is None:
            msg = "Expected join code"
            raise ParseError(msg)

        models.LoreGroup.groups.join_group(join_code, user)
        return Response(status=HTTP_201_CREATED)

    @action(
        detail=False,
        methods=["delete"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def leave(self, request: HttpRequest) -> Response:
        """Cause the user to leave the group with the given group_id."""
        user: models.LoreUser = cast(models.LoreUser, request.user)
        group_id = request.POST.get("group_id", None)
        if group_id is None:
            msg = "Expected group"
            raise ParseError(msg)

        models.LoreGroup.groups.leave_group(group_id, user)
        return Response(status=HTTP_204_NO_CONTENT)
