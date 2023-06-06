from django.urls import path

from .views import StripeCheckoutView

urlpatterns = [
    path(
        "create-checkout-session/<str:pk>/",
        StripeCheckoutView.as_view(),
        name="stripe-checkout",
    ),
]
