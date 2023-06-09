from datetime import datetime, timezone

from rest_framework import filters, permissions, status, viewsets
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


class ShippingAddressViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows shipping addresses to be viewed or edited.
    """

    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_view_name(self):
        return "Shipping Addresses"


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

    @action(detail=True, methods=["GET"])
    def hasUserBought(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({"hasBought": False}, status=status.HTTP_200_OK)

        product = self.get_object()
        orders = Order.objects.filter(user=request.user)
        orderItems = OrderItem.objects.filter(order__in=orders, product=product)
        hasBought = orderItems.count() > 0
        return Response({"hasBought": hasBought}, status=status.HTTP_200_OK)


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
    permission_classes = [permissions.IsAuthenticated]

    def get_view_name(self):
        return "Orders"

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["GET"])
    def me(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response(
                {"message": "You are not authorized to perform this action"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        orders = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["PUT"])
    def deliver(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {"message": "You are not authorized to perform this action"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        order = self.get_object()
        order.isDelivered = True
        order.deliveredAt = datetime.now(tz=timezone.utc)
        order.save()
        return Response({"message": "Order was delivered"}, status=status.HTTP_200_OK)


class OrderItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows order items to be viewed or edited.
    """

    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_view_name(self):
        return "Order Items"
