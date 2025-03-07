"""View for achievements."""

from typing import Any, ClassVar, cast

from dj_rest_auth.views import IsAuthenticated
from django.http import HttpRequest
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from rest_framework.serializers import BaseSerializer
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_409_CONFLICT,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from rest_framework.views import Response

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

    def get_serializer_class(self) -> type[BaseSerializer]:
        """Choose the serializer based on the action.

        If the route is update or partial update, a limited serializer is used.
        Otherwise, use a full serializer.
        """
        if self.action in ["update", "partial_update"]:
            return serializers.AchievementUpdateSerializer
        return serializers.AchievementSerializer

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

    @action(
        methods=["post"],
        detail=True,
    )
    def achieve(self, request: HttpRequest, pk: int) -> Response:
        """Add the user to the list of achievers.

        Returns the achievement on success
        """
        user = cast(LoreUser, request.user)
        achievement = cast(
            Achievement | None,
            Achievement.achievements.filter(pk=pk).first(),
        )

        if achievement is None:
            return Response(
                "Achievement does not exist",
                status=HTTP_404_NOT_FOUND,
            )

        if achievement.has_achiever(user):
            return Response("Already achieved", status=HTTP_409_CONFLICT)

        # permissions should not allow this to be false
        if not achievement.add_achiever(user):
            return Response(
                "Not allowed to access item",
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )

        context = {"request": request}
        serializer = self.get_serializer_class()(
            achievement,
            many=False,
            context=context,
        )
        return Response(serializer.data, status=HTTP_201_CREATED)

    @action(
        methods=["post"],
        detail=True,
    )
    def unachieve(self, request: HttpRequest, pk: int) -> Response:
        """Remove the user from the list of achievers.

        Returns the achievemetn on success
        """
        user = cast(LoreUser, request.user)
        achievement = cast(
            Achievement | None,
            Achievement.achievements.filter(pk=pk).first(),
        )

        if achievement is None:
            return Response(
                "Achievement does not exist",
                status=HTTP_404_NOT_FOUND,
            )

        if not achievement.has_achiever(user):
            return Response("Not achieved", status=HTTP_404_NOT_FOUND)

        # permissions should not allow this to be false
        if not achievement.remove_achiever(user):
            return Response(
                "Not allowed to access item",
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )

        context = {"request": request}
        serializer = self.get_serializer_class()(
            achievement,
            many=False,
            context=context,
        )
        return Response(serializer.data, status=HTTP_201_CREATED)
