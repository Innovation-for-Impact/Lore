"""View for quotes."""

from typing import Any, ClassVar, cast

from dj_rest_auth.views import IsAuthenticated, Response
from django.http import HttpRequest
from rest_framework import permissions, viewsets
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
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
        if view.action not in ["list", "create"]:
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
    """Viewset for quotes."""

    queryset = Quote.quotes.all()
    serializer_class = serializers.QuoteSerializer
    permission_classes: ClassVar[list[Any]] = [
        IsAuthenticated,
        GroupMemberPermission,
    ]

    def list(self, request: HttpRequest) -> Response:
        """List quotes for the given group.

        The group is specified with the `group_id` query parameter
        """
        group_id: str | None = request.GET.get("group_id", None)
        if group_id is None:
            return Response(
                status=HTTP_400_BAD_REQUEST,
                data="Must specify a group id",
            )

        group: LoreGroup | None = LoreGroup.groups.filter(pk=group_id).first()
        if group is None:
            return Response(
                status=HTTP_404_NOT_FOUND,
                data="Group does not exist",
            )

        context = {"request": request}
        quotes = group.get_quotes()
        serialized_quotes = self.serializer_class(
            quotes,
            many=True,
            context=context,
        )
        return Response(serialized_quotes.data)

    def create(self, request: HttpRequest) -> Response:
        """Create a quote in the given group.

        Expects:
        - `text`, the contents of the quote
        - `said_by_id`, the id of the user that said the quote
        - 'group_id', the group to create the quote in
        """
        text = request.POST.get("text", None)
        said_by_id = request.POST.get("said_by_id", None)
        group_id: str | None = request.GET.get("group_id", None)

        if text is None:
            return Response(
                data="Expected text field",
                status=HTTP_400_BAD_REQUEST,
            )
        if said_by_id is None:
            return Response(
                data="Expected said_by_id field",
                status=HTTP_400_BAD_REQUEST,
            )
        if group_id is None:
            return Response(
                data="Expected group_id field",
                status=HTTP_400_BAD_REQUEST,
            )

        quote = Quote.quotes.create_quote(
            text=text,
            said_by_pk=int(said_by_id),
            group_pk=int(group_id),
        )

        context = {"request": request}
        return Response(
            self.serializer_class(quote, context=context, many=False).data,
            status=HTTP_201_CREATED,
        )
