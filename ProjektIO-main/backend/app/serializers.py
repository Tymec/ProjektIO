from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer

from .models import Order, OrderItem, Product, Review, ShippingAddress


# Create your serializers here.
class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"


class OrderItemSerializer(ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"


class ShippingAddressSerializer(ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = "__all__"
