from typing import Any, ClassVar, Unpack, cast
from django.db.models import QuerySet
from rest_framework import serializers, views

from lore import models


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.LoreUser
        fields = ["id", "first_name", "last_name", "avatar"]


class QuoteSerializer(serializers.ModelSerializer):
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


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.LoreGroup
        fields = ["id", "name", "join_code", "avatar", "created", "url"]
