from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.routers import APIRootView

from .models import Order, OrderItem, Product, Review, ShippingAddress
from .serializers import (
    OrderItemSerializer,
    OrderSerializer,
    ProductSerializer,
    ReviewSerializer,
    ShippingAddressSerializer,
)


# Create your views here.
class APIRootView(APIRootView):
    """
    API root view.
    """

    def get_view_name(self):
        return "API"


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows products to be viewed or edited.
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "brand", "category", "description"]
    ordering_fields = [
        "createdAt",
        "price",
        "rating",
        "name",
        "numReviews",
        "countInStock",
    ]
    ordering = ["createdAt", "name"]

    def get_view_name(self):
        return "Products"

    def get_queryset(self):
        queryset = Product.objects.all()
        ids = self.request.query_params.get("ids")
        if ids and ids != "":
            ids = ids.split(",")
            queryset = queryset.filter(_id__in=ids)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows reviews to be viewed or edited.
    """

    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "comment", "product__name", "user__username"]
    ordering_fields = ["name", "rating", "createdAt"]
    ordering = ["createdAt", "name"]

    def get_view_name(self):
        return "Reviews"

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["GET"])
    def me(self, request, pk=None):
        reviews = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows orders to be viewed or edited.
    """

    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_view_name(self):
        return "Orders"

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["GET"])
    def me(self, request, pk=None):
        orders = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)


class OrderItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows order items to be viewed or edited.
    """

    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_view_name(self):
        return "Order Items"


class ShippingAddressViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows shipping addresses to be viewed or edited.
    """

    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_view_name(self):
        return "Shipping Addresses"
