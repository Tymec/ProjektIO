from rest_framework.serializers import ModelSerializer

from .models import Order, OrderItem, Product, Review, ShippingAddress


# Create your serializers here.
class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["user"] = str(ret["user"])
        ret["_id"] = str(ret["_id"])
        return ret

    def to_internal_value(self, data):
        if "_id" in data:
            data["_id"] = int(data["_id"])
        if "user" in data:
            data["user"] = int(data["user"])
        return super().to_internal_value(data)


class ReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["product"] = str(ret["product"])
        ret["user"] = str(ret["user"])
        ret["_id"] = str(ret["_id"])
        return ret

    def to_internal_value(self, data):
        if "product" in data:
            data["product"] = int(data["product"])
        if "user" in data:
            data["user"] = int(data["user"])
        if "_id" in data:
            data["_id"] = int(data["_id"])
        return super().to_internal_value(data)


class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["user"] = str(ret["user"])
        ret["_id"] = str(ret["_id"])
        return ret

    def to_internal_value(self, data):
        if "user" in data:
            data["user"] = int(data["user"])
        if "_id" in data:
            data["_id"] = int(data["_id"])
        return super().to_internal_value(data)


class OrderItemSerializer(ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["product"] = str(ret["product"])
        ret["order"] = str(ret["order"])
        ret["_id"] = str(ret["_id"])
        return ret

    def to_internal_value(self, data):
        if "product" in data:
            data["product"] = int(data["product"])
        if "order" in data:
            data["order"] = int(data["order"])
        if "_id" in data:
            data["_id"] = int(data["_id"])
        return super().to_internal_value(data)


class ShippingAddressSerializer(ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["order"] = str(ret["order"])
        ret["_id"] = str(ret["_id"])
        return ret

    def to_internal_value(self, data):
        if "order" in data:
            data["order"] = int(data["order"])
        if "_id" in data:
            data["_id"] = int(data["_id"])
        return super().to_internal_value(data)
