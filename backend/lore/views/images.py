"""View for images."""

from typing import Any, ClassVar, cast

from dj_rest_auth.views import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.exceptions import ParseError

from lore import serializers
from lore.models import Image, LoreGroup, LoreUser
from lore.utils import GroupMemberItemPermission


class ImageViewSet(viewsets.ModelViewSet):
    """Viewset for quotes.

    Supports filtering by group_id and searching by description
    Images can only be created when querying by a specific group.

    To create an image, it expects an `image` and optional `description` field.
    The group is automatically set by the query parameters.
    """

    serializer_class = serializers.ImageSerializer
    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        IsAuthenticated,
        GroupMemberItemPermission,
    ]
    filter_backends: ClassVar[list[type[Any]]] = [
        filters.SearchFilter,
    ]
    search_fields: ClassVar[list[str]] = ["description"]

    def get_queryset(self):
        """Get all the images for the user's groups or the route's group."""
        user: LoreUser = cast(LoreUser, self.request.user)
        queryset = Image.images
        if self.kwargs.get("loregroup_pk") is not None:
            queryset = queryset.filter(
                group_id=self.kwargs["loregroup_pk"],
            )
        else:
            user_groups = LoreGroup.groups.get_groups_with_user(user)
            queryset = queryset.filter(group__in=user_groups)

        return queryset.order_by("pk")

    def perform_create(self, serializer: serializers.QuoteSerializer) -> None:
        """Create the item in the database."""
        # Extract the group_id from query parameters
        group_id: str | None = self.kwargs.get("loregroup_pk")
        if group_id is None:
            msg = "Expected a group id"
            raise ParseError(msg)
        serializer.save(group=LoreGroup.groups.filter(pk=group_id).first())
