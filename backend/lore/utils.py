from typing import Callable, cast

from django.db.models import Model
from django.http import HttpRequest
from rest_framework import permissions, viewsets
from rest_framework.exceptions import ParseError

from lore.models import GroupItem, LoreUser


class GroupMemberRoutePermissions(permissions.BasePermission):
    def has_permission(
        self,
        request: HttpRequest,
        view: viewsets.ModelViewSet,
    ):
        """Return true if the user can interact with the resource."""
        # allows user to interact with list
        if "pk" in view.kwargs:
            return True
        user: LoreUser = cast(LoreUser, request.user)
        group_pk = view.kwargs.get(
            "loregroup_pk",
            view.kwargs.get("group_id", None),
        )
        if group_pk is None:
            self.message = """You do not have permissions.
            Try specifying a group_id query paremeter
            """
            return False
        try:
            return user.is_in_group(int(group_pk))
        except ValueError as e:
            msg = "Expected an integer group id."
            raise ParseError(msg) from e


class GroupMemberItemPermission(permissions.BasePermission):
    """Permission to only allow user to view a group they are in."""

    def has_object_permission(
        self,
        request: HttpRequest,
        view: viewsets.ModelViewSet,
        obj: GroupItem,
    ):
        """Return true if the user can view the object.

        The user may view the group if they are staff, or are a member
        of the group
        """
        user: LoreUser = cast(LoreUser, request.user)
        group_pk = view.kwargs.get(
            "loregroup_pk",
            view.kwargs.get("group_id", obj.group.id),
        )
        return user.is_in_group(group_pk)


def create_is_owner_permission(
    actions: list[str],
    is_owner: Callable[[LoreUser, Model], bool],
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
            obj: Model,
        ) -> bool:
            """Return true if the user owns the object."""
            if view.action not in actions:
                return True
            user: LoreUser = cast(LoreUser, request.user)
            return is_owner(user, obj)

    return IsOwner


def create_is_group_action_permission(
    actions: list[str],
) -> type[permissions.BasePermission]:
    """Build an object level ownership permission for specific actions.

    If the view's action is not in actions, then the user will have permission
    to access the route. Otherwise, they can only access the route if the object
    is owned by them.
    """

    class CanPerformGroupAction(permissions.BasePermission):
        def has_permission(
            self,
            _: HttpRequest,
            view: viewsets.ViewSet,
        ) -> bool:
            """Return true if the user owns the object."""
            if view.action not in actions:
                return True
            group_pk = view.kwargs.get("loregroup_pk")
            return group_pk is not None

    return CanPerformGroupAction
