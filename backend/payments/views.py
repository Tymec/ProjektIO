from datetime import datetime, timezone

import stripe
from app.models import Order, OrderItem, Product
from django.conf import settings
from requests.models import PreparedRequest
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Customer
from .serializers import CustomerSerializer

stripe.api_key = settings.STRIPE_SK


class CustomerView(APIView):
    """API endpoint that allows customers to be created and viewed."""

    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_view_name(self):  # pragma: no cover
        return "Customers"

    def get(self, request, format=None):
        """Get customer associated with the user making the request"""
        customer = Customer.objects.get(user=request.user)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    def post(self, request, format=None):
        """Create a customer and link it to the user making the request"""
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors)


class StripeCheckoutView(APIView):
    """View for creating a Stripe checkout session"""

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """Create a Stripe checkout session"""

        # Get cart and redirect url from request
        try:
            cart = request.data["cart"]
            redirect_url = request.data["redirectUrl"]
        except KeyError:
            return Response(
                data={"message": "Missing parameters"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get products and quantities from cart
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

        # Create an empty order for the current user
        order = Order.objects.create(user=request.user)

        # Create order items for each product in the cart
        order_items = []
        for product in products:
            order_item = OrderItem.objects.create(
                product=product,
                order=order,
                quantity=product_quantity[str(product._id)],
            )
            order_items.append(order_item)

        # Prepare redirect urls
        redirect = PreparedRequest()
        redirect.prepare_url(redirect_url, {"success": "true", "order": order._id})
        success_url = redirect.url
        redirect.prepare_url(redirect_url, {"success": "false"})
        cancel_url = redirect.url

        # Get the customer associated with the user making the request, if any
        try:
            customer = Customer.objects.get(user=request.user)
        except Customer.DoesNotExist:
            customer = None

        try:
            # Create a Stripe checkout session
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
                    "metadata": {"orderId": order._id},
                },
                customer_update={"shipping": "auto"} if customer else None,
                automatic_tax={
                    "enabled": True,
                },
                success_url=success_url,
                cancel_url=cancel_url,
            )

            # Save the session id to the order
            order.sessionId = checkout_session.id
            order.save()

            return Response(
                data={"url": checkout_session.url},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            # If an error occurs, rollback the order and order items
            for order_item in order_items:
                order_item.delete()
            order.delete()

            print(e)

            return Response(data={"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class StripeWebhookView(APIView):
    """View for handling Stripe webhooks"""

    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        """Handle Stripe webhook events"""
        payload = request.body
        sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
        event = None

        # Verify the event by constructing a Stripe event object
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

            # Finish the order
            try:
                # Get the order associated with the session and update it
                order = Order.objects.get(_id=session["client_reference_id"])
                order.taxPrice = session.total_details.amount_tax or 0.0
                order.shippingPrice = session.shipping_cost or 0.0

                # Update the shipping address for the order
                shipping_details = session.shipping_details.address
                order.shippingAddress = {
                    "fullName": session.shipping_details.name,
                    "address": {
                        "line": shipping_details.line1,
                        "line2": shipping_details.line2 or "",
                    },
                    "city": shipping_details.city,
                    "postalCode": shipping_details.postal_code,
                    "country": shipping_details.country,
                    "state": shipping_details.state or "",
                }
                order.invoiceId = session.invoice

                order.save()
            except Order.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            # Create a customer if one does not exist yet
            try:
                customer = Customer.objects.get(user=order.user)
            except Customer.DoesNotExist:
                customer = Customer.objects.create(
                    user=order.user, stripeCustomerId=session.customer
                )
                customer.save()

        if event.type == "charge.succeeded":
            charge = event["data"]["object"]

            # Payment succeeded, update the order
            try:
                # Get the order associated with the payment and update it
                order_id = charge.metadata.orderId
                order = Order.objects.get(_id=order_id)
                order.isPaid = charge.paid
                order.paidAt = datetime.now(tz=timezone.utc)
                order.totalPrice = charge.amount

                # Update the payment method of the order
                if charge.payment_method_details.type == "card":
                    payment_details = charge.payment_method_details.card
                    order.paymentMethod = {
                        "type": charge.payment_method_details.type,
                        "brand": payment_details.brand,
                        "last4": payment_details.last4,
                        "expMonth": payment_details.exp_month,
                        "expYear": payment_details.exp_year,
                    }
                else:
                    order.paymentMethod = {"type": charge.payment_method_details.type}

                order.save()
            except Order.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)
