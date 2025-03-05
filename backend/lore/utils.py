from typing import cast

from django.http import HttpRequest
from rest_framework import permissions, viewsets

from lore.models import GroupItem, LoreUser


class GroupMemberItemPermission(permissions.BasePermission):
    """Permission to only allow user to view a group they are in."""

    def has_permission(
        self,
        request: HttpRequest,
        view: viewsets.ModelViewSet,
    ):
        """Return true if the user can interact with the resource."""
        if view.action not in ["create"]:
            return True
        user: LoreUser = cast(LoreUser, request.user)
        group_id = request.GET.get("group_id", None)
        if group_id is None:
            self.message = """You do not have permissions.
            Try specifying a group_id query paremeter
            """
            return False
        # TODO: proper parse error handling
        return user.is_in_group(int(group_id))

    def has_object_permission(
        self,
        request: HttpRequest,
        _: viewsets.ModelViewSet,
        obj: GroupItem,
    ):
        """Return true if the user can view the object.

        The user may view the group if they are staff, or are a member
        of the group
        """
        user: LoreUser = cast(LoreUser, request.user)
        return user.is_in_group(obj.group.id)
