from rest_framework.serializers import ModelSerializer

from .models import Customer


class CustomerSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["_id"] = str(ret["_id"])
        ret["user"] = str(ret["user"])
        return ret
