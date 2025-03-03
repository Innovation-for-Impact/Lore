"""The view for the groups."""

from typing import Any, ClassVar, Literal, cast

from django.http import Http404, HttpRequest
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_401_UNAUTHORIZED,
)
from rest_framework.views import Response

from lore import models, serializers


class GroupMemberPermission(permissions.BasePermission):
    """Permission to only allow user to view a group they are in."""

    def has_object_permission(
        self, request: HttpRequest, view, obj: models.LoreGroup
    ):
        """Return true if the user can view the object.

        The user may view the group if they are staff, or are a member
        of the group
        """
        user: models.LoreUser = cast(models.LoreUser, request.user)
        return user.is_in_group(obj.pk)


class GroupViewSet(viewsets.ModelViewSet):
    """Queryset for groups."""

    queryset = models.LoreGroup.groups.all()
    serializer_class = serializers.GroupSerializer
    permission_classes: ClassVar[list[Any]] = [
        permissions.IsAuthenticated,
        GroupMemberPermission,
    ]

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

    def update(self, request: HttpRequest, pk: int | None = None) -> Response:
        """Unimplemented."""
        raise Http404

    def partial_update(
        self, request: HttpRequest, pk: int | None = None
    ) -> Response:
        """Unimplemented."""
        raise Http404

    def destroy(self, _: HttpRequest, pk: int | None = None) -> Response:
        """Destroy the group if it exists and there is at most 1 member."""
        group: models.LoreGroup | None = cast(
            models.LoreGroup | None,
            models.LoreGroup.groups.filter(pk=pk).first(),
        )
        if group is None:
            msg = "Group does not exist"
            raise Http404(msg)
        num_members = group.members.count()
        if num_members > 1:
            return Response(
                HTTP_401_UNAUTHORIZED,
                "Cannot delete the group as there is more than 1 member",
            )
        group.delete()

        return Response(HTTP_204_NO_CONTENT)

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
