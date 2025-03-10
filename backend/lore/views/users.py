"""Describes the viewsets for Lore Users."""

from typing import TYPE_CHECKING, Any, ClassVar, cast, overload

from dj_rest_auth.views import IsAuthenticated, Response
from django.db.models import QuerySet
from django.http import Http404, HttpRequest
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, mixins, permissions, viewsets
from rest_framework.response import Serializer
from rest_framework.serializers import BaseSerializer
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_404_NOT_FOUND,
    HTTP_405_METHOD_NOT_ALLOWED,
    HTTP_409_CONFLICT,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from rest_framework.views import Request

from lore import serializers
import lore
from lore.models import Achievement, LoreGroup, LoreUser, Quote


class MutualPermission(permissions.BasePermission):
    """Restricts object permissions to users that are in the same group."""

    def has_permission(self, request, view) -> bool:
        """Restricts high level permissions to shared groups.

        A specific field can only be queried on if that object is actually
        known by the user. For example, if the user is not in a group, they
        cannot filter by it.
        """
        user: LoreUser = cast(LoreUser, request.user)
        group_id = request.GET.get("member_of")
        if group_id is not None:
            group: LoreGroup | None = cast(
                LoreGroup | None,
                LoreGroup.groups.filter(pk=group_id).first(),
            )
            if group and not group.has_member(user):
                return False

        # user must be in the same group as the achievement
        achievement_id = request.GET.get("achievement")
        if achievement_id is not None:
            achievement: Achievement = cast(
                Achievement,
                Achievement.achievements.filter(
                    pk=achievement_id,
                ).first(),
            )
            if achievement:
                group: LoreGroup | None = cast(
                    LoreGroup | None,
                    LoreGroup.groups.filter(pk=achievement.group.pk).first(),
                )
                if group and not group.has_member(user):
                    return False

        quote_id = request.GET.get("quote")
        if quote_id is not None:
            quote: Quote = cast(
                Quote,
                Quote.quotes.filter(
                    pk=quote_id,
                ).first(),
            )
            if quote:
                group: LoreGroup | None = cast(
                    LoreGroup | None,
                    LoreGroup.groups.filter(pk=quote.group.pk).first(),
                )
                if group and not group.has_member(user):
                    return False

        return True

    def has_object_permission(
        self, request: HttpRequest, view: viewsets.ViewSet, obj: LoreUser
    ) -> bool:
        """Return true if accessing user shares a group with the object."""
        user: LoreUser = cast(LoreUser, request.user)
        mutual_users = user.get_mutual_users()
        return mutual_users.filter(pk=obj.pk).exists()


def create_is_owner_permission(
    actions: list[str],
) -> type[permissions.BasePermission]:
    """Build an object level ownership permission for specific actions.

    If the view's action is not in actions, then the user will have permission
    to access the route. Otherwise, they can only access the route if the object
    is owned by them.
    """

    class IsOwner(permissions.BasePermission):
        def has_object_permission(
            self,
            request: HttpRequest,
            view: viewsets.ViewSet,
            obj: LoreUser,
        ) -> bool:
            """Return true if the user owns the object."""
            if view.action not in actions:
                return True
            user: LoreUser = cast(LoreUser, request.user)
            return user.pk == obj.pk

    return IsOwner


class BaseLoreUserViewSet(
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """Viewset for all lore users.

    Can be searched by first and last name
    Filter for what group a user is in with `member_of`
    Filter for who accomplished an achievement with `achievement`
    """

    queryset = LoreUser.users.all()
    serializer_class = serializers.UserSerializer
    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        IsAuthenticated,
        MutualPermission,
        create_is_owner_permission(["destroy", "update", "partial_update"]),
    ]
    filter_backends: ClassVar[list[type[Any]]] = [
        filters.SearchFilter,
    ]
    search_fields: ClassVar[list[str]] = ["first_name", "last_name"]
    # currently, any additional fields need to be added to the MutualPermission


class LoreUserViewSet(
    BaseLoreUserViewSet,
    mixins.UpdateModelMixin,
):
    """Viewset for all lore users.

    Can be searched by first and last name
    Filter for what group a user is in with `member_of`
    Filter for who accomplished an achievement with `achievement`
    """

    queryset = LoreUser.users.all()
    serializer_class = serializers.UserSerializer
    permission_classes: ClassVar[list[type[permissions.BasePermission]]] = [
        IsAuthenticated,
        MutualPermission,
        create_is_owner_permission(["destroy", "update", "partial_update"]),
    ]
    filter_backends: ClassVar[list[type[Any]]] = [
        filters.SearchFilter,
    ]
    search_fields: ClassVar[list[str]] = ["first_name", "last_name"]
    # currently, any additional fields need to be added to the MutualPermission


class MemberViewSet(BaseLoreUserViewSet):
    """Viewset for group members.

    Supports listing, retrieving, and deleting members
    """

    def get_queryset(self):
        """Get all the users based on the url."""
        queryset = LoreUser.users
        if self.kwargs.get("loregroup_pk") is not None:
            queryset = queryset.filter(
                member_of=self.kwargs["loregroup_pk"],
            ).order_by("pk")

        return queryset

    def destroy(self, request: Request, loregroup_pk: int, pk: int):
        """Remove the user from the group.

        Raises a 404 if the membership doesn't exist.
        """
        user: LoreUser | None = cast(
            LoreUser | None, self.get_queryset().filter(pk=pk).first()
        )
        if user is None:
            msg = "No user found"
            raise Http404(msg)

        group: LoreGroup | None = cast(
            LoreGroup | None,
            LoreGroup.groups.filter(pk=loregroup_pk).first(),
        )
        if group is None:
            msg = "Group does not exist"
            raise Http404(msg)

        group.leave_group(user)
        return Response(status=HTTP_204_NO_CONTENT)


class AchievedViewSet(BaseLoreUserViewSet, mixins.CreateModelMixin):
    def get_queryset(self):
        """Get all the users based on the url."""
        queryset = LoreUser.users
        if self.kwargs.get("achievement_pk") is not None:
            queryset = queryset.filter(
                achievement=self.kwargs["achievement_pk"],
            ).order_by("pk")

        return queryset

    def get_serializer_class(self) -> type[BaseSerializer]:
        if self.action in ["create", "delete"]:
            return Serializer
        return self.serializer_class

    def create(self, request: Request, achievement_pk: int) -> Response:
        """Add or delete the authenticated user to the list of achievers.

        Returns the authenticated user on success
        """
        user = cast(LoreUser, request.user)
        achievement = cast(
            Achievement | None,
            Achievement.achievements.filter(pk=achievement_pk).first(),
        )

        if achievement is None:
            return Response(
                {"message": "Achievement does not exist"},
                status=HTTP_404_NOT_FOUND,
            )

        if achievement.has_achiever(user):
            return Response(
                {"message": "Already achieved"},
                status=HTTP_409_CONFLICT,
            )

        # permissions should not allow this to be false
        if not achievement.add_achiever(user):
            return Response(
                {"message": "Not allowed to access item"},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )

        context = {"request": request}
        serializer = self.serializer_class(
            user,
            many=False,
            context=context,
        )
        return Response(serializer.data, status=HTTP_201_CREATED)

    def destroy(
        self, request: Request, achievement_pk: int, pk: int
    ) -> Response:
        """Remove the authenticated user from the achievement.

        Returns no content on success
        Raises a 404 if the membership doesn't exist.
        """
        user = cast(LoreUser, self.get_queryset().filter(pk=pk).first())
        achievement = cast(
            Achievement | None,
            Achievement.achievements.filter(pk=achievement_pk).first(),
        )

        if achievement is None:
            return Response(
                {"message": "Achievement does not exist"},
                status=HTTP_404_NOT_FOUND,
            )

        if not achievement.has_achiever(user):
            return Response(
                {"message": "Not achieved"},
                status=HTTP_404_NOT_FOUND,
            )

        # permissions should not allow this to be false
        if not achievement.remove_achiever(user):
            return Response(
                {"message": "Not allowed to access item"},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(status=HTTP_204_NO_CONTENT)
