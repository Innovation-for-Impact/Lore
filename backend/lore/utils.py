from typing import cast

from django.http import HttpRequest
from rest_framework import permissions, viewsets
from rest_framework.exceptions import ParseError

from lore.models import GroupItem, LoreUser


class GroupMemberItemPermission(permissions.BasePermission):
    """Permission to only allow user to view a group they are in."""

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
