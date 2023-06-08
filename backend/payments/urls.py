from django.urls import path

from .views import CustomerView, StripeCheckoutView, StripeWebhookView

urlpatterns = [
    path("customers/", CustomerView.as_view(), name="customer"),
    path(
        "create-checkout-session/",
        StripeCheckoutView.as_view(),
        name="stripe-checkout",
    ),
    path("webhook/", StripeWebhookView.as_view(), name="stripe-webhook"),
]
