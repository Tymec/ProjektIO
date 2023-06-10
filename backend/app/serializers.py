from rest_framework.serializers import (
    ModelSerializer,
    PrimaryKeyRelatedField,
    SerializerMethodField,
)

from .models import Order, OrderItem, Product, Review


class ReviewSerializer(ModelSerializer):
    """Serializer for the Review model"""

    # Fields for the product associated with a review
    product = PrimaryKeyRelatedField(queryset=Product.objects, many=False)

    class Meta:
        model = Review
        fields = "__all__"

    def to_representation(self, instance):
        """Serialize review data"""
        ret = super().to_representation(instance)
        # Cast all ObjectIds to strings
        ret["_id"] = str(ret["_id"])
        ret["product"] = str(ret["product"])
        ret["user"] = str(ret["user"])
        return ret


class ProductSerializer(ModelSerializer):
    """Serializer for the Product model"""

    # Field for all reviews associated with a product
    reviews = SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"

    def to_representation(self, instance):
        """Serialize product data"""
        ret = super().to_representation(instance)
        # Cast all ObjectIds to strings
        ret["_id"] = str(ret["_id"])
        ret["user"] = str(ret["user"])
        ret["rating"] = float(ret["rating"])
        return ret

    def get_reviews(self, obj):
        """Get all reviews for a product"""
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


class OrderItemSerializer(ModelSerializer):
    """Serializer for the OrderItem model"""

    # Field for the product associated with an order item
    product = SerializerMethodField(read_only=True)

    class Meta:
        model = OrderItem
        fields = "__all__"

    def to_representation(self, instance):
        """Serialize order item data"""
        ret = super().to_representation(instance)
        # Cast all ObjectIds to strings
        ret["_id"] = str(ret["_id"])
        ret["order"] = str(ret["order"])
        return ret

    def get_product(self, obj):
        product = obj.product
        serializer = ProductSerializer(product, many=False)
        return serializer.data


class OrderSerializer(ModelSerializer):
    """Serializer for the Order model"""

    # Field for all order items associated with an order
    orderItems = SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = "__all__"

    def to_representation(self, instance):
        """Serialize order data"""
        ret = super().to_representation(instance)
        # Cast all ObjectIds to strings
        ret["_id"] = str(ret["_id"])
        ret["user"] = str(ret["user"])
        ret["sessionId"] = str(ret["sessionId"])
        ret["totalPrice"] = float(ret["totalPrice"] or 0.0)
        ret["shippingPrice"] = float(ret["shippingPrice"] or 0.0)
        ret["taxPrice"] = float(ret["taxPrice"] or 0.0)
        return ret

    def get_orderItems(self, obj):
        """Get all order items for an order"""
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data
