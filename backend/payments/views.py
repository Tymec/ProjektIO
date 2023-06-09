from datetime import datetime, timezone

import stripe
from django.conf import settings
from requests.models import PreparedRequest
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.models import Order, OrderItem, Product, ShippingAddress

from .models import Customer
from .serializers import CustomerSerializer

stripe.api_key = settings.STRIPE_SK


class CustomerView(APIView):
    """
    API endpoint that allows customers to be created and viewed.
    """

    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_view_name(self):
        return "Customers"

    def get(self, request, format=None):
        # get Customer by user foreign key
        customer = Customer.objects.get(user=request.user)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    def post(self, request, format=None):
        # create Customer
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors)


class StripeCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # get cart and redirect url from request
        try:
            cart = request.data["cart"]
            redirect_url = request.data["redirectUrl"]
        except KeyError:
            return Response(
                data={"message": "Missing parameters"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # fetch products
        try:
            products = Product.objects.filter(_id__in=[item["id"] for item in cart])
            product_quantity = {item["id"]: item["qty"] for item in cart}
        except Product.DoesNotExist:
            return Response(
                data={"message": "Product does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except KeyError:
            return Response(
                data={"message": "Invalid cart data"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # create order
        order = Order.objects.create(user=request.user)

        # create order item for each product
        order_items = []
        for product in products:
            order_item = OrderItem.objects.create(
                product=product,
                order=order,
                quantity=product_quantity[str(product._id)],
            )
            order_items.append(order_item)

        # create redirect urls
        redirect = PreparedRequest()
        redirect.prepare_url(redirect_url, {"success": "true", "order": order._id})
        success_url = redirect.url
        redirect.prepare_url(redirect_url, {"success": "false"})
        cancel_url = redirect.url

        # get customer
        try:
            customer = Customer.objects.get(user=request.user)
        except Customer.DoesNotExist:
            customer = None

        try:
            # create checkout session
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        "quantity": product_quantity[str(product._id)],
                        "price_data": {
                            "currency": product.price.currency,
                            "unit_amount": int(product.price.amount * 100),
                            "product_data": {
                                "name": product.name,
                                "description": product.description
                                or f"{product.category}, {product.brand}",
                                "images": [product.image.url],
                            },
                        },
                    }
                    for product in products
                ],
                client_reference_id=order._id,
                shipping_address_collection={"allowed_countries": ["PL"]},
                invoice_creation={"enabled": True},
                customer_email=request.user.email if not customer else None,
                customer=customer.stripeCustomerId if customer else None,
                mode="payment",
                payment_intent_data={
                    "receipt_email": request.user.email,
                    "setup_future_usage": "off_session",
                },
                payment_method_types=["card"],
                success_url=success_url,
                cancel_url=cancel_url,
            )

            order.sessionId = checkout_session.id
            order.save()

            return Response(
                data={"url": checkout_session.url},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            # delete order and order items
            for order_item in order_items:
                order_item.delete()
            order.delete()

            return Response(data={"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class StripeWebhookView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WH
            )
        except ValueError:
            # Invalid payload
            print("Invalid payload")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            # Invalid signature
            print("Invalid signature")
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Handle events
        if event.type == "checkout.session.completed":
            session = event["data"]["object"]

            # Fulfill the purchase...
            try:
                order = Order.objects.get(_id=session["client_reference_id"])
                order.taxPrice = session.total_details.amount_tax
                order.shippingPrice = session.shipping_cost
                order.totalPrice = session.amount_total
                order.isPaid = session.payment_status == "paid"
                order.paidAt = datetime.now(tz=timezone.utc)

                shipping_details = session.shipping_details.address
                address_line = shipping_details.line1
                if shipping_details.line2:
                    address_line += f", {shipping_details.line2}"
                shipping_address = ShippingAddress.objects.create(
                    fullName=session.shipping_details.name,
                    address=address_line,
                    city=shipping_details.city,
                    postalCode=shipping_details.postal_code,
                    country=shipping_details.country,
                )
                shipping_address.save()

                # TODO: prevent from creating multiple shipping addresses

                order.shippingAddress = shipping_address
                order.paymentIntentId = session.payment_intent
                order.invoiceId = session.invoice

                order.save()
            except Order.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            # create customer if not exists
            try:
                customer = Customer.objects.get(user=order.user)
            except Customer.DoesNotExist:
                customer = Customer.objects.create(
                    user=order.user, stripeCustomerId=session.customer
                )
                customer.save()

        return Response(status=status.HTTP_200_OK)
