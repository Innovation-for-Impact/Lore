"""View for quotes."""

from typing import Any, ClassVar, cast

from dj_rest_auth.views import IsAuthenticated, Response
from django.http import HttpRequest
from rest_framework.exceptions import ParseError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
)

from lore import serializers
from lore.models import LoreGroup, LoreUser, Quote


class GroupMemberPermission(permissions.BasePermission):
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
        obj: Quote,
    ):
        """Return true if the user can view the object.

        The user may view the group if they are staff, or are a member
        of the group
        """
        user: LoreUser = cast(LoreUser, request.user)
        return user.is_in_group(obj.group.id)


class QuoteViewSet(viewsets.ModelViewSet):
    """Viewset for quotes.

    Supports filtering by group_id and said_by_id, and also searching by text
    Quotes can only be created when querying by a specific group.

    To create a quote, it expects a `text` and `said_by` field. The group
    is automatically set by the query parameters.
    """

    serializer_class = serializers.QuoteSerializer
    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        IsAuthenticated,
        GroupMemberPermission,
    ]
    filter_backends: ClassVar[list[type[Any]]] = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields: ClassVar[list[str]] = ["group_id", "said_by_id"]
    search_fields: ClassVar[list[str]] = ["text"]

    def get_queryset(self):
        """Get all the quotes for the groups the user is in."""
        user: LoreUser = cast(LoreUser, self.request.user)
        user_groups = LoreGroup.groups.get_groups_with_user(user)
        return Quote.quotes.filter(group__in=user_groups).order_by("pk")

    def perform_create(self, serializer: serializers.QuoteSerializer) -> None:
        """Create the item in the database."""
        # Extract the group_id from query parameters
        group_id: str | None = self.request.GET.get("group_id", None)
        if group_id is None:
            msg = "Expected a group id"
            raise ParseError(msg)
        serializer.save(group=LoreGroup.groups.filter(pk=group_id).first())
