"""The feed of recent events to display to a user."""

from typing import Any, ClassVar, cast

from dj_rest_auth.views import IsAuthenticated
from django.db.models import CharField, F, Model, QuerySet, Value
from django.http import HttpRequest
from django.urls import reverse
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView, Response

from lore.models import Image, LoreGroup, LoreUser, Quote


class FeedView(APIView, PageNumberPagination):
    """Display info about recent events.

    Supports the GET path, whichr retrieves a list of data ordered by timestamp.
    This list rreturns urls and types, so the requester must retrieve the items
    involved in the events themselves.
    """

    permission_classes: ClassVar[list[type[BasePermission]]] = [
        IsAuthenticated,
    ]

    def get(self, request: HttpRequest) -> Response:
        """Retrieve an ordererd list by timestamp of recent actions."""
        user = cast(LoreUser, request.user)

        user_groups = LoreGroup.groups.get_groups_with_user(user).all()
        quotes = Quote.quotes.filter(group__in=user_groups)
        images = Image.images.filter(group__in=user_groups)

        def annotate_type(
            queryset: QuerySet[Model, Model],
            type_name: str,
        ) -> QuerySet[Model, Model]:
            return queryset.annotate(
                type=Value(type_name, output_field=CharField()),
            )

        item_ordering = list(
            (
                annotate_type(quotes, "quote")
                .annotate(updated_at=F("created"))
                .values("id", "type", "updated_at")
                .union(
                    annotate_type(images, "image").annotate(
                        updated_at=F("created"),
                    ),
                )
            ).order_by("-updated_at"),
        )

        def update_item(item: dict[str, Any]) -> dict[str, Any]:
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
