import contextlib
from typing import Any, ClassVar, cast

from django.db.models import QuerySet
from django.urls import reverse
from rest_framework import serializers
from rest_framework.relations import HyperlinkedRelatedField

from lore import models


class QuoteSerializer(serializers.ModelSerializer):
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
            group=validated_data["group"],
        )

    class Meta:
        model = models.Quote
        fields: ClassVar[list[str]] = [
            "id",
            "text",
            "said_by",
            "said_by_url",
            "group",
            "group_url",
            "created",
            "url",
        ]


class ImageSerializer(serializers.ModelSerializer):
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
            "group_url",
            "created",
            "url",
        ]


class AchievementSerializer(serializers.ModelSerializer):
    """Serializer for the achievement detail.

    Serializes the images's:
      - id
      - title
      - image
      - description
      - achieved_by
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
    image = serializers.ImageField(required=False)
    achieved_by_url = serializers.SerializerMethodField()
    num_achieved = serializers.ReadOnlyField()

    def __init__(self, *args, **kwargs):
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

    def get_achieved_by_url(self, obj: models.Achievement) -> str:
        """Create a url resource to the users that achieved this."""
        url = self.context["request"].build_absolute_uri(
            reverse("loreuser-list"),
        )
        return f"{url}?achievement={obj.pk}"

    class Meta:
        model = models.Achievement
        fields: ClassVar[list[str]] = [
            "id",
            "title",
            "image",
            "description",
            "achieved_by_url",
            "num_achieved",
            "group",
            "group_url",
            "created",
            "url",
        ]


class GroupSerializer(serializers.ModelSerializer):
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

    members_url = serializers.SerializerMethodField()

    def get_members_url(self, obj: models.LoreGroup) -> str:
        """Create a url resource to the members in the group."""
        base_url = self.context["request"].build_absolute_uri(
            reverse("loreuser-list"),
        )
        return f"{base_url}?member_of={obj.pk}"

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
            "members_url",
            "join_code",
            "avatar",
            "created",
            "url",
        ]
        read_only_fields: ClassVar[list[str]] = ["join_code"]
        extra_kwargs: ClassVar[dict[str, dict[str, Any]]] = {
            "members": {"write_only": True},
        }


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.LoreUser
        fields = ["id", "first_name", "last_name", "avatar", "url"]
