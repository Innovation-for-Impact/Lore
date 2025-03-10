import contextlib
from typing import Any, ClassVar, cast, override

from django.urls import reverse
from rest_framework import serializers
from rest_framework.views import Request
from rest_framework_nested.relations import NestedHyperlinkedRelatedField

from lore import models


class DataLinksSerializerMixin(serializers.Serializer):
    """A mixin to partition a serializers's info into data and links.

    Will automatically group any fields ending in "_url" into a "links"
    group. Any mention of these urls will be removed elsewhere. All
    other data is grouped into "data".
    """

    @override
    def to_representation(self, instance: serializers.Serializer) -> dict:
        res = super().to_representation(instance)

        links = {}
        data = {}
        for key, value in res.items():
            if key == getattr(self, "url_field_name", None):
                links["self"] = value
                continue
            if not key.endswith("_url"):
                data[key] = value
                continue

            name = key[:-4]
            links[name] = value
        return {"data": data, "links": links}


class QuoteSerializer(serializers.ModelSerializer, DataLinksSerializerMixin):
    """Serializer for the quote detail.

    Serializes the quote's:
      - id
      - text
      - said_by
      - said_by_url
      - group
      - group_url
      - created
      - url
    """

    said_by_url = serializers.HyperlinkedRelatedField(
        view_name="loreuser-detail",
        lookup_field="pk",
        many=False,
        read_only=True,
        source="said_by",
    )
    group_url = serializers.HyperlinkedRelatedField(
        view_name="loregroup-detail",
        lookup_field="pk",
        many=False,
        read_only=True,
        source="group",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            # get userse that are only in the shared group
            user: models.LoreUser = cast(
                models.LoreUser,
                self.context["request"].user,
            )

            self.fields["said_by"] = serializers.PrimaryKeyRelatedField(
                queryset=user.get_mutual_users(),
                read_only=False,
            )
            self.fields["group"] = serializers.PrimaryKeyRelatedField(
                read_only=True,
            )
        except KeyError:
            pass

    def create(self, validated_data: dict[Any, Any]) -> models.Quote:
        """Create an instane of an Quote."""
        return models.Quote.quotes.create_quote(
            text=validated_data["text"],
            said_by_pk=validated_data["said_by"].pk,
            pinned=validated_data["pinned"],
            group=validated_data["group"],
        )

    class Meta:
        model = models.Quote
        fields: ClassVar[list[str]] = [
            "id",
            "text",
            "said_by",
            "pinned",
            "said_by_url",
            "group_url",
            "group",
            "created",
            "url",
        ]


class ImageSerializer(serializers.ModelSerializer, DataLinksSerializerMixin):
    """Serializer for the image detail.

    Serializes the images's:
      - id
      - image
      - description
      - group
      - group_url
      - created
      - url
    """

    group_url = serializers.HyperlinkedRelatedField(
        view_name="loregroup-detail",
        lookup_field="pk",
        many=False,
        read_only=True,
        source="group",
    )
    description = serializers.CharField(required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        with contextlib.suppress(KeyError):
            self.fields["group"] = serializers.PrimaryKeyRelatedField(
                read_only=True,
            )

    def create(self, validated_data: dict[Any, Any]) -> models.Image:
        """Create an instane of an Image."""
        return models.Image.images.create_image(
            image=validated_data["image"],
            description=validated_data.get("description"),
            group=validated_data["group"],
        )

    class Meta:
        model = models.Image
        fields: ClassVar[list[str]] = [
            "id",
            "image",
            "description",
            "group",
            "created",
            "url",
            "group_url",
        ]


# TODO : add achieved urls to serializer
class AchievementSerializer(
    DataLinksSerializerMixin, serializers.ModelSerializer
):
    """Serializer for the achievement detail.

    Serializes the images's:
      - id (read only)
      - title
      - image
      - description
      - achieved_by (write only)
      - achieved_by_url (read only)
      - group (read only)
      - group_url (read only)
      - created (read only)
      - url (read only)
    """

    group_url = serializers.HyperlinkedRelatedField(
        view_name="loregroup-detail",
        lookup_field="pk",
        many=False,
        read_only=True,
        source="group",
    )
    image = serializers.ImageField(required=False)
    achievers_url = serializers.HyperlinkedIdentityField(
        view_name="achievement-loreuser-list",
        lookup_field="pk",
        lookup_url_kwarg="achievement_pk",
        many=False,
    )
    logged_in_user_url = serializers.SerializerMethodField()

    num_achieved = serializers.ReadOnlyField()

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        with contextlib.suppress(KeyError):
            self.fields["group"] = serializers.PrimaryKeyRelatedField(
                read_only=True,
            )

    def create(self, validated_data: dict[Any, Any]) -> models.Achievement:
        """Create an instane of an Image."""
        return models.Achievement.achievements.create_achievement(
            title=validated_data["title"],
            image=validated_data.get("image"),
            description=validated_data["description"],
            achieved_by=validated_data.get("achieved_by", []),
            group=validated_data["group"],
        )

    def get_logged_in_user_url(self, obj: models.Achievement) -> str | None:
        """Get the url for the authenticated user."""
        request: Request = self.context["request"]
        if not obj.has_achiever(request.user):
            return None
        base_url = request.build_absolute_uri(
            reverse(
                "achievement-loreuser-detail", args=[obj.pk, request.user.pk]
            ),
        )
        return f"{base_url}"

    class Meta:
        model = models.Achievement
        fields: ClassVar[list[str]] = [
            "id",
            "title",
            "image",
            "description",
            "achieved_by",
            "num_achieved",
            "group",
            "created",
            "url",
            "achievers_url",
            "group_url",
            "logged_in_user_url",
        ]
        extra_kwargs: ClassVar[dict[str, dict[str, Any]]] = {
            "achieved_by": {"write_only": True, "allow_empty": True},
        }


class AchievementUpdateSerializer(AchievementSerializer):
    """Limits what achievement fields can be updated.

    Achieved_by is read only
    """

    class Meta(AchievementSerializer.Meta):
        fields: ClassVar[list[str]] = [
            f
            for f in AchievementSerializer.Meta.fields
            if f not in ["achieved_by"]
        ]
        read_only_fields: ClassVar[list[str]] = ["achieved_by"]
        extra_kwargs: ClassVar[dict[str, dict[str, Any]]] = {}


class GroupSerializer(
    serializers.ModelSerializer,
    DataLinksSerializerMixin,
):
    """Serializes a group.

    Provides the following fields:
    - id (read only)
    - name
    - members_url (read only)
    - join_code (read only)
    - avatar
    - created (read only)
    - url (read only)
    - members (write only)
    """

    members_url = serializers.HyperlinkedIdentityField(
        view_name="loregroup-loreuser-list",
        lookup_field="pk",
        lookup_url_kwarg="loregroup_pk",
        many=False,
    )
    quotes_url = serializers.HyperlinkedIdentityField(
        view_name="loregroup-quote-list",
        lookup_field="pk",
        lookup_url_kwarg="loregroup_pk",
        many=False,
    )
    achievements_url = serializers.HyperlinkedIdentityField(
        view_name="loregroup-achievement-list",
        lookup_field="pk",
        lookup_url_kwarg="loregroup_pk",
        many=False,
    )
    images_url = serializers.HyperlinkedIdentityField(
        view_name="loregroup-image-list",
        lookup_field="pk",
        lookup_url_kwarg="loregroup_pk",
        many=False,
    )
    logged_in_member_url = serializers.SerializerMethodField()

    def get_logged_in_member_url(self, obj: models.LoreGroup) -> str:
        """Get the url to leave the group"""
        request: Request = self.context["request"]
        base_url = request.build_absolute_uri(
            reverse(
                "loregroup-loreuser-detail", args=[obj.pk, request.user.pk]
            ),
        )
        return f"{base_url}"

    def create(self, validated_data: dict[Any, Any]) -> models.LoreGroup:
        """Create an instane of an Group."""
        return models.LoreGroup.groups.create_group(
            name=validated_data["name"],
            owner=self.context["request"].user,
            avatar=validated_data.get("avatar"),
            members=validated_data.get("members", []),
        )

    class Meta:
        """Describes the serializer."""

        model = models.LoreGroup
        fields: ClassVar[list[str]] = [
            "id",
            "name",
            "members",
            "num_members",
            "join_code",
            "avatar",
            "created",
            "url",
            "achievements_url",
            "quotes_url",
            "images_url",
            "members_url",
            "logged_in_member_url",
        ]
        read_only_fields: ClassVar[list[str]] = ["join_code"]
        extra_kwargs: ClassVar[dict[str, dict[str, Any]]] = {
            "members": {"write_only": True, "allow_empty": True},
        }


class GroupUpdateSerializer(GroupSerializer):
    """Serializer that limits what group fields can be updated.

    Members cannot be updated
    """

    class Meta(GroupSerializer.Meta):
        """Overwrite behavior on the orignal Meta."""

        model = models.LoreGroup
        fields: ClassVar[list[str]] = [
            f for f in GroupSerializer.Meta.fields if f not in ["members"]
        ]
        read_only_fields: ClassVar[list[str]] = ["join_code", "members"]
        extra_kwargs: ClassVar[dict[str, dict[str, Any]]] = {}


class JoinSerializer(serializers.Serializer):
    join_code = serializers.CharField()


class UserSerializer(
    serializers.HyperlinkedModelSerializer,
    DataLinksSerializerMixin,
):
    class Meta:
        model = models.LoreUser
        fields = ["id", "first_name", "last_name", "avatar", "url"]
