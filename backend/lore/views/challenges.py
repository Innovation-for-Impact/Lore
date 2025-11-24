"""View for challenges."""

from typing import Any, ClassVar, cast

from dj_rest_auth.views import IsAuthenticated
from django.db.models import QuerySet
from django.http import HttpRequest
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from rest_framework.response import Serializer
from rest_framework.serializers import BaseSerializer
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)
from rest_framework.views import Request, Response

from lore import serializers
from lore.models import Challenge, ChallengeParticipant, LoreGroup, LoreUser
from lore.utils import GroupMemberItemPermission
from lore.views.users import (
    BaseLoreUserViewSet,
    MutualPermission,
    create_is_owner_permission,
)


class ChallengeViewSet(viewsets.ModelViewSet):
    """Viewset for challnges."""

    serializer_class = serializers.ChallengeSerializer
    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        IsAuthenticated,
        GroupMemberItemPermission,
    ]
    filter_backends: ClassVar[list[type[Any]]] = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields: ClassVar[list[str]] = ["participants", "achievement"]
    search_fields: ClassVar[list[str]] = ["description", "title"]

    def get_serializer_class(self) -> type[BaseSerializer]:
        """Choose the serializer based on the action.

        If the route is update or partial update, a limited serializer is used.
        Otherwise, use a full serializer.
        """
        if self.action in ["update", "partial_update"]:
            return serializers.ChallengeUpdateSerializer
        return serializers.ChallengeSerializer

    def get_queryset(self):
        """Get all challenges for the user's groups or the route's group."""
        user: LoreUser = cast("LoreUser", self.request.user)
        queryset = Challenge.challenges
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
        serializer: serializers.ChallengeSerializer,
    ) -> None:
        """Create the item in the database."""
        # Extract the group_id from query parameters
        group_id: str | None = self.kwargs.get("loregroup_pk")
        if group_id is None:
            msg = "Expected a group id"
            raise ParseError(msg)
        serializer.save(group=LoreGroup.groups.filter(pk=group_id).first())


class ChallengeParticipantsViewSet(viewsets.ModelViewSet):
    queryset = ChallengeParticipant.objects.all().order_by("pk")
    serializer_class = serializers.ChallengeParticipantSerializer
    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        IsAuthenticated,
        MutualPermission,
        create_is_owner_permission(["destroy", "update", "partial_update"]),
    ]
    filter_backends: ClassVar[list[type[Any]]] = [
        filters.SearchFilter,
    ]
    search_fields: ClassVar[list[str]] = ["loreuser"]

    def get_queryset(self):
        """Get all the users based on the url."""
        queryset = ChallengeParticipant.objects
        if self.kwargs.get("challenge_pk") is not None:
            queryset = queryset.filter(
                challenge=self.kwargs["challenge_pk"],
            ).order_by("pk")

        return queryset

    def get_serializer_class(self) -> type[BaseSerializer]:
        if self.action in ["create", "delete"]:
            return Serializer
        return self.serializer_class

    def create(self, request: Request, challenge_pk: int) -> Response:
        """Add or delete the authenticated user to the list of participants.

        Returns the authenticated user on success
        """
        user = cast("LoreUser", request.user)
        challenge = cast(
            "Challenge | None",
            Challenge.challenges.filter(pk=challenge_pk).first(),
        )

        if challenge is None:
            return Response(
                {"message": "Challenge does not exist"},
                status=HTTP_404_NOT_FOUND,
            )

        participant = challenge.add_participant(user)
        if not participant:
            return Response(
                {"message": "Cannot become a participant"},
                status=HTTP_400_BAD_REQUEST,
            )

        context = {"request": request}
        serializer = self.serializer_class(
            participant,
            many=False,
            context=context,
        )
        return Response(serializer.data, status=HTTP_201_CREATED)

    # def destroy(
    #     self,
    #     request: Request,
    #     challenge_pk: int,
    #     pk: int,
    # ) -> Response:
    #     """Remove the authenticated user from the challenge.
    #
    #     Returns no content on success
    #     Raises a 404 if the membership doesn't exist.
    #     """
    #     user = cast(LoreUser, self.get_queryset().filter(pk=pk).first())
    #     challenge = cast(
    #         "Challenge | None",
    #         Challenge.challenges.filter(pk=challenge_pk).first(),
    #     )
    #
    #     if challenge is None:
    #         return Response(
    #             {"message": "Challenge does not exist"},
    #             status=HTTP_404_NOT_FOUND,
    #         )
    #
    #     if not challenge.has_achiever(user):
    #         return Response(
    #             {"message": "Not achieved"},
    #             status=HTTP_404_NOT_FOUND,
    #         )
    #
    #     # permissions should not allow this to be false
    #     if not challenge.remove_achiever(user):
    #         return Response(
    #             {"message": "Not allowed to access item"},
    #             status=HTTP_500_INTERNAL_SERVER_ERROR,
    #         )
    #
    #     return Response(status=HTTP_204_NO_CONTENT)
