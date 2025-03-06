"""The feed of recent events to display to a user."""

from typing import Any, ClassVar, cast

from dj_rest_auth.views import IsAuthenticated
from django.db.models import CharField, F, Model, QuerySet, Value
from django.http import HttpRequest
from django.urls import reverse
from rest_framework import status
from rest_framework import permissions
from rest_framework.exceptions import ParseError
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView, Response, View

from lore.models import Image, LoreGroup, LoreUser, Quote
from lore.views import groups


class GroupMemberPermission(permissions.BasePermission):
    """Permission to only allow user to view a group they are in."""

    def has_permission(
        self,
        request: HttpRequest,
        view: View,
    ):
        """Return true if the user can view the group.

        The user may view the group if they are a member
        of the group
        """
        group_id = request.GET.get("group_id")
        if group_id is None:
            return True
        user: LoreUser = cast(LoreUser, request.user)
        try:
            return user.is_in_group(int(group_id))
        except ValueError as e:
            msg = "Expected an integer group id."
            raise ParseError(msg) from e


class FeedView(APIView, PageNumberPagination):
    """Display info about recent events.

    Supports the GET path, which retrieves a list of data ordered by timestamp.
    This list rreturns urls and types, so the requester must retrieve the items
    involved in the events themselves.
    """

    permission_classes: ClassVar[list[type[BasePermission]]] = [
        IsAuthenticated,
        GroupMemberPermission,
    ]

    def get(self, request: HttpRequest) -> Response:
        """Retrieve an ordererd list by timestamp of recent actions.

        Query can be limited to a specific group by specifying the group_id
        query parameter.
        """
        user = cast(LoreUser, request.user)

        user_groups: QuerySet[LoreGroup, LoreGroup] | None = None
        group_id = request.GET.get("group_id")
        if group_id is None:
            user_groups = LoreGroup.groups.get_groups_with_user(user).all()
        else:
            user_groups = LoreGroup.groups.filter(pk=group_id)

        quotes = Quote.quotes.filter(group__in=user_groups)
        images = Image.images.filter(group__in=user_groups)

        def annotate_type(
            queryset: QuerySet[Model, Model],
            type_name: str,
        ) -> QuerySet[Model, Model]:
            """Annotate the object with an extra 'type' column."""
            return queryset.annotate(
                type=Value(type_name, output_field=CharField()),
            )

        # get item ids ordered by descending timestamp
        # adds an additional type field
        item_ordering = list(
            annotate_type(quotes, "quote")
            .annotate(timestamp=F("created"))
            .union(
                annotate_type(images, "image").annotate(
                    timestamp=F("created"),
                ),
            )
            .values("id", "type", "timestamp")
            .order_by("-timestamp"),
        )

        def update_item(item: dict[str, Any]) -> dict[str, Any]:
            """Attach the item's url and remove the id field."""
            item["url"] = request.build_absolute_uri(
                reverse(
                    f"{item['type']}-detail",
                    kwargs={"pk": item["id"]},
                ),
            )
            del item["id"]
            return item

        paginated_item_ordering: list[Any] | None = self.paginate_queryset(
            item_ordering,
            request,
            view=self,
        )
        if paginated_item_ordering is None:
            return Response(
                "Failed to paginate data",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        linked_items = [update_item(item) for item in paginated_item_ordering]
        return self.get_paginated_response(linked_items)
