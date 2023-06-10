from rest_framework.serializers import (
    ModelSerializer,
    PrimaryKeyRelatedField,
    SerializerMethodField,
)

from .models import Order, OrderItem, Product, Review


class ReviewSerializer(ModelSerializer):
    product = PrimaryKeyRelatedField(queryset=Product.objects, many=False)

    class Meta:
        model = Review
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["_id"] = str(ret["_id"])
        ret["product"] = str(ret["product"])
        ret["user"] = str(ret["user"])
        return ret


class ProductSerializer(ModelSerializer):
    reviews = SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["_id"] = str(ret["_id"])
        ret["user"] = str(ret["user"])
        ret["rating"] = float(ret["rating"])
        return ret

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


class OrderItemSerializer(ModelSerializer):
    product = SerializerMethodField(read_only=True)

    class Meta:
        model = OrderItem
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["_id"] = str(ret["_id"])
        ret["order"] = str(ret["order"])
        return ret

    def get_product(self, obj):
        product = obj.product
        serializer = ProductSerializer(product, many=False)
        return serializer.data


class OrderSerializer(ModelSerializer):
    orderItems = SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["_id"] = str(ret["_id"])
        ret["user"] = str(ret["user"])
        ret["sessionId"] = str(ret["sessionId"])
        return ret

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data
