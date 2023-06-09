from datetime import datetime, timezone

from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.routers import APIRootView

from .models import Order, OrderItem, Product, Review
from .serializers import (
    OrderItemSerializer,
    OrderSerializer,
    ProductSerializer,
    ReviewSerializer,
)


# Create your views here.
class APIRootView(APIRootView):  # pragma: no cover
    """
    API root view.
    """

    def get_view_name(self):
        return "API"


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows products to be viewed or edited.
    """

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

    def get_view_name(self):  # pragma: no cover
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
    search_fields = ["name", "comment", "product__name"]
    ordering_fields = ["name", "rating", "createdAt"]
    ordering = ["createdAt", "name"]

    def get_view_name(self):  # pragma: no cover
        return "Reviews"

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(
                {"message": "You are not authorized to perform this action"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            rating = int(request.data["rating"])
        except ValueError:
            return Response(
                {"message": "Rating must be an integer"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if rating < 1 or rating > 5:
            return Response(
                {"message": "Rating must be between 1 and 5"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.data["comment"].strip() == "":
            return Response(
                {"message": "Comment cannot be empty"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = Product.objects.get(_id=request.data["product"])
        if product:
            product.numReviews = product.numReviews + 1
            product.rating = (
                product.rating * (product.numReviews - 1) + rating
            ) / product.numReviews
            product.save()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["GET"])
    def me(self, request, pk=None):
        reviews = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows orders to be viewed or edited.
    """

    queryset = Order.objects.all().order_by("-createdAt")
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_view_name(self):  # pragma: no cover
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

    queryset = OrderItem.objects.all().order_by("-createdAt")
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_view_name(self):  # pragma: no cover
        return "Order Items"

    def create(self, request, *args, **kwargs):
        data = request.data

        if not request.user.is_authenticated:
            return Response(
                {"message": "You are not authorized to perform this action"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        qty = data.get("qty", None)
        if not qty:
            return Response(
                {"message": "Quantity is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            qty = int(request.data["qty"])
        except ValueError:
            return Response(
                {"message": "Quantity must be an integer"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = data.get("product", None)
        if not product:
            return Response(
                {"message": "Product is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = data.get("order", None)
        if not order:
            return Response(
                {"message": "Order is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = Product.objects.get(_id=product)
        if product:
            product.countInStock = product.countInStock - qty
            product.save()

        order = Order.objects.get(_id=order)
        if not order:
            return Response(
                {"message": "Order not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product, order=order, quantity=qty)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
