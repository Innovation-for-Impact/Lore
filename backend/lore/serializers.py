from rest_framework import serializers
import lore.models as models


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.LoreUser
        fields = ["id", "first_name", "last_name"]


class QuoteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Quote
        fields = ["id", "text", "said_by"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.LoreGroup
        fields = ["id", "name", "join_code", "url"]
