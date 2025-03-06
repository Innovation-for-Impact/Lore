"""Describes the viewsets for Lore Users."""

from typing import TYPE_CHECKING, Any, ClassVar, cast, overload

from dj_rest_auth.views import IsAuthenticated
from django.db.models import QuerySet
from django.http import HttpRequest
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, mixins, permissions, viewsets

from lore import serializers
from lore.models import Achievement, LoreGroup, LoreUser


class MutualPermission(permissions.BasePermission):
    """Restricts object permissions to users that are in the same group."""

    def has_permission(self, request, view) -> bool:
        """Restricts high level permissions to shared groups.

        A specific field can only be queried on if that object is actually
        known by the user. For example, if the user is not in a group, they
        cannot filter by it.
        """
        user: LoreUser = cast(LoreUser, request.user)
        group_id = request.GET.get("member_of")
        if group_id is not None:
            group: LoreGroup | None = cast(
                LoreGroup | None,
                LoreGroup.groups.filter(pk=group_id).first(),
            )
            if group and not group.has_member(user):
                return False

        # user must be in the same group as the achievement
        achievement_id = request.GET.get("achievement")
        if achievement_id is not None:
            achievement: Achievement = cast(
                Achievement,
                Achievement.achievements.filter(
                    pk=achievement_id,
                ).first(),
            )
            if achievement:
                group: LoreGroup | None = cast(
                    LoreGroup | None,
                    LoreGroup.groups.filter(pk=achievement.group.pk).first(),
                )
                if group and not group.has_member(user):
                    return False

        return True

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
    """Viewset for all lore users.

    Can be searched by first and last name
    Filter for what group a user is in with `member_of`
    Filter for who accomplished an achievement with `achievement`
    """

    queryset = LoreUser.users.all()
    serializer_class = serializers.UserSerializer
    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        IsAuthenticated,
        MutualPermission,
        create_is_owner_permission(["destroy", "update", "partial_update"]),
    ]
    filter_backends: ClassVar[list[type[Any]]] = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]
    search_fields: ClassVar[list[str]] = ["first_name", "last_name"]
    # currently, any additional fields need to be added to the MutualPermission
    filterset_fields: ClassVar[list[str]] = ["member_of", "achievement"]
