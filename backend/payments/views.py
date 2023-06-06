import stripe
from app.models import Product
from django.conf import settings
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

stripe.api_key = settings.STRIPE_SK


class StripeCheckoutView(APIView):
    def post(self, request, *args, **kwargs):
        success_url = request.data.get("successUrl")
        cancel_url = request.data.get("cancelUrl")

        try:
            product_id = self.kwargs["pk"]
            product = Product.objects.get(_id=product_id)
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        "price_data": {
                            "currency": "usd",
                            "unit_amount": int(product.price) * 100,
                            "product_data": {
                                "name": product.name,
                                "description": product.description
                                or f"{product.category}, {product.brand}",
                                "images": [product.image],
                            },
                        },
                        "quantity": 1,
                    }
                ],
                payment_method_types=["card"],
                mode="payment",
                metadata={"product_id": product_id},
                success_url=f"{success_url}?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{cancel_url}?canceled=true",
            )
        except Exception as e:
            return Response(data={"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return redirect(checkout_session.url, code=303)
