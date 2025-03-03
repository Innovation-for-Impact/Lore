from rest_framework import serializers

from lore import models


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.LoreUser
        fields = ["id", "first_name", "last_name"]


# TODO: Fix serializer referencing said_by w/ url
class QuoteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Quote
        fields = ["id", "text", "said_by", "url"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.LoreGroup
        fields = ["id", "name", "join_code", "url"]
