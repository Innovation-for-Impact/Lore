"""View for quotes."""

from typing import Any, ClassVar, cast

from dj_rest_auth.views import IsAuthenticated
from django.http import HttpRequest
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.exceptions import ParseError

from lore import serializers
from lore.models import LoreGroup, LoreUser, Quote
from lore.utils import GroupMemberItemPermission, GroupMemberRoutePermissions


class BaseQuoteViewSet(viewsets.ModelViewSet):
    """Viewset for quotes.

    Supports filtering by group_id and said_by_id, and also searching by text
    Quotes can only be created when querying by a specific group.

    To create a quote, it expects a `text` and `said_by` field. The group
    is automatically set by the query parameters.
    """

    serializer_class = serializers.QuoteSerializer
    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        IsAuthenticated,
        GroupMemberItemPermission,
    ]
    filter_backends: ClassVar[list[type[Any]]] = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields: ClassVar[list[str]] = [
        "said_by_id",
        "pinned",
    ]
    search_fields: ClassVar[list[str]] = ["text"]

    def perform_create(self, serializer: serializers.QuoteSerializer) -> None:
        """Create the item in the database."""
        # Extract the group_id from query parameters
        group_id: str | None = self.kwargs.get("loregroup_pk")
        if group_id is None:
            msg = "Expected a group id"
            raise ParseError(msg)
        serializer.save(group=LoreGroup.groups.filter(pk=group_id).first())


class AllUserGroupsQuoteViewSet(BaseQuoteViewSet):
    """Displays the quotes for all groups the user is in."""

    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        IsAuthenticated,
        GroupMemberItemPermission,
    ]

    def get_queryset(self):
        """Get all the quotes for the user's groups or the route's group."""
        user: LoreUser = cast("LoreUser", self.request.user)
        queryset = Quote.quotes
        user_groups = LoreGroup.groups.get_groups_with_user(user)
        queryset = queryset.filter(group__in=user_groups)

        return queryset.order_by("pk")


class GroupQuoteViewSet(BaseQuoteViewSet):
    """Displays the quotes for a specific group."""

    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        IsAuthenticated,
        GroupMemberItemPermission,
        GroupMemberRoutePermissions,
    ]

    def get_queryset(self):
        """Get all the quotes for the user's groups or the route's group."""
        user: LoreUser = cast("LoreUser", self.request.user)
        queryset = Quote.quotes
        if self.kwargs.get("loregroup_pk") is None:
            return None

        queryset = queryset.filter(
            group_id=self.kwargs["loregroup_pk"],
        )

        return queryset.order_by("pk")
