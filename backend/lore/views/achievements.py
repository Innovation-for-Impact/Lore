"""View for achievements."""

from typing import Any, ClassVar, cast

from dj_rest_auth.views import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.exceptions import ParseError

from lore import serializers
from lore.models import Achievement, LoreGroup, LoreUser
from lore.utils import GroupMemberItemPermission


class AchievementViewSet(viewsets.ModelViewSet):
    """Viewset for achievements.

    Supports filtering by group_id and searching by description and title
    Achievements can only be created when querying by a specific group.

    To create an achievemet, it expects an `image`, 'description', and 'title'
    fields. The group is automatically set by the query parameters.
    """

    serializer_class = serializers.AchievementSerializer
    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        IsAuthenticated,
        GroupMemberItemPermission,
    ]
    filter_backends: ClassVar[list[type[Any]]] = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields: ClassVar[list[str]] = ["group_id", "achieved_by"]
    search_fields: ClassVar[list[str]] = ["description", "title"]

    def get_queryset(self):
        """Get all the achievements for the groups the user is in."""
        user: LoreUser = cast(LoreUser, self.request.user)
        user_groups = LoreGroup.groups.get_groups_with_user(user)
        return Achievement.achievements.filter(group__in=user_groups).order_by(
            "pk",
        )

    def perform_create(self, serializer: serializers.QuoteSerializer) -> None:
        """Create the item in the database."""
        # Extract the group_id from query parameters
        group_id: str | None = self.request.GET.get("group_id", None)
        if group_id is None:
            msg = "Expected a group id"
            raise ParseError(msg)
        serializer.save(group=LoreGroup.groups.filter(pk=group_id).first())
