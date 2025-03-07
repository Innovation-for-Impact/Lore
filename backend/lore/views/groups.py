"""The view for the groups."""

from typing import Any, ClassVar, cast

from django.http import Http404, HttpRequest
from rest_framework import filters, mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from rest_framework.serializers import BaseSerializer
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
        self,
        request: HttpRequest,
        view,
        obj: models.LoreGroup,
    ):
        """Return true if the user can view the object.

        The user may view the group if they are staff, or are a member
        of the group
        """
        user: models.LoreUser = cast(models.LoreUser, request.user)
        return user.is_in_group(obj.pk)


class GroupViewSet(viewsets.ModelViewSet):
    """Queryset for groups."""

    serializer_class = serializers.GroupSerializer
    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        permissions.IsAuthenticated,
        GroupMemberPermission,
    ]
    filter_backends: ClassVar[list[type[Any]]] = [
        filters.SearchFilter,
    ]
    search_fields: ClassVar[list[str]] = ["name"]

    def get_serializer_class(self) -> type[BaseSerializer]:
        """Choose serializer class based on action.

        If the action is an update route, choose the update serializer.
        Otherwise, use the standard serializer.
        """
        if self.action in ["update", "partial_update"]:
            return serializers.GroupUpdateSerializer
        return serializers.GroupSerializer

    def get_queryset(self):
        """List all groups that the user is in."""
        user: models.LoreUser = cast(models.LoreUser, self.request.user)
        return models.LoreGroup.groups.get_groups_with_user(user).order_by(
            "pk",
        )

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
                status=HTTP_401_UNAUTHORIZED,
                data="Cannot delete the group as there is more than 1 member",
            )
        group.delete()

        return Response(status=HTTP_204_NO_CONTENT)

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
