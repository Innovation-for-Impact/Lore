"""View for achievements."""

from typing import Any, ClassVar, cast

from dj_rest_auth.views import IsAuthenticated
from django.http import HttpRequest
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from rest_framework.serializers import BaseSerializer

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
    filterset_fields: ClassVar[list[str]] = ["achieved_by"]
    search_fields: ClassVar[list[str]] = ["description", "title"]

    def get_serializer_class(self) -> type[BaseSerializer]:
        """Choose the serializer based on the action.

        If the route is update or partial update, a limited serializer is used.
        Otherwise, use a full serializer.
        """
        if self.action in ["update", "partial_update"]:
            return serializers.AchievementUpdateSerializer
        return serializers.AchievementSerializer

    def get_queryset(self):
        """Get all achievements for the user's groups or the route's group."""
        user: LoreUser = cast(LoreUser, self.request.user)
        queryset = Achievement.achievements
        if self.kwargs.get("loregroup_pk") is not None:
            queryset = queryset.filter(
                group_id=self.kwargs["loregroup_pk"],
            )
        else:
            user_groups = LoreGroup.groups.get_groups_with_user(user)
            queryset = queryset.filter(group__in=user_groups)

        return queryset.order_by("pk")

    def perform_create(
        self,
        serializer: serializers.AchievementSerializer,
    ) -> None:
        """Create the item in the database."""
        # Extract the group_id from query parameters
        group_id: str | None = self.kwargs.get("loregroup_pk")
        if group_id is None:
            msg = "Expected a group id"
            raise ParseError(msg)
        serializer.save(group=LoreGroup.groups.filter(pk=group_id).first())
