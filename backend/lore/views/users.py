"""Describes the viewsets for Lore Users."""

from typing import TYPE_CHECKING, ClassVar, cast

from dj_rest_auth.views import IsAuthenticated
from django.http import HttpRequest
from rest_framework import mixins, permissions, viewsets
from rest_framework.status import HTTP_401_UNAUTHORIZED, HTTP_404_NOT_FOUND
from rest_framework.views import Response

from lore import serializers
from lore.models import LoreGroup, LoreUser

if TYPE_CHECKING:
    from django.db.models import QuerySet


class MutualUserPermission(permissions.BasePermission):
    """Restricts object permissions to users that are in the same group."""

    def has_object_permission(
        self, request: HttpRequest, view: viewsets.ViewSet, obj: LoreUser
    ) -> bool:
        """Return true if accessing user shares a group with the object."""
        user: LoreUser = cast(LoreUser, request.user)
        mutual_users = user.get_mutual_users()
        return mutual_users.filter(pk=obj.pk).exists()


def create_is_owner_permission(
    actions: list[str],
) -> type[permissions.BasePermission]:
    """Build an object level ownership permission for specific actions.

    If the view's action is not in actions, then the user will have permission
    to access the route. Otherwise, they can only access the route if the object
    is owned by them.
    """

    class IsOwner(permissions.BasePermission):
        def has_object_permission(
            self,
            request: HttpRequest,
            view: viewsets.ViewSet,
            obj: LoreUser,
        ) -> bool:
            """Return true if the user owns the object."""
            if view.action not in actions:
                return True
            user: LoreUser = cast(LoreUser, request.user)
            return user.pk == obj.pk

    return IsOwner


class LoreUserViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """Viewset for lore users."""

    queryset = LoreUser.users.all()
    serializer_class = serializers.UserSerializer
    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        IsAuthenticated,
        MutualUserPermission,
        create_is_owner_permission(["destroy", "update", "partial_update"]),
    ]

    def list(self, request: HttpRequest) -> Response:
        """List users that the logged in user shares a group with.

        Supports an optional `group_id` field to filter users by the given
        group.
        """
        user: LoreUser = cast(LoreUser, request.user)
        group_id = request.GET.get("group_id", None)

        users: QuerySet[LoreUser, LoreUser] | None
        if group_id is None:
            users = user.get_mutual_users()
        else:
            group: LoreGroup | None = LoreGroup.groups.filter(
                pk=group_id,
            ).first()

            if group is None:
                return Response(
                    "Group does not exist",
                    status=HTTP_404_NOT_FOUND,
                )

            if not group.has_member(user):
                return Response(
                    "You are not in this group",
                    status=HTTP_401_UNAUTHORIZED,
                )

            users = group.members

        context = {"request": request}
        serializer = self.serializer_class(users, many=True, context=context)
        return Response(serializer.data)
