from rest_framework.serializers import ModelSerializer

from .models import Customer


class CustomerSerializer(ModelSerializer):
    """Serializer for the Customer model"""

    class Meta:
        model = Customer
        fields = "__all__"

    def to_representation(self, instance):
        """Serialize customer data"""
        ret = super().to_representation(instance)
        # Cast all ObjectIds to strings
        ret["_id"] = str(ret["_id"])
        ret["user"] = str(ret["user"])
        return ret
