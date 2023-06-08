from django.conf import settings
from django.db import models
from djmoney.models.fields import MoneyField

from .utils import upload_to


class Product(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )

    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=200)
    category = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    numReviews = models.IntegerField(default=0)
    price = MoneyField(
        max_digits=19, decimal_places=4, default_currency=settings.DEFAULT_CURRENCY
    )
    countInStock = models.IntegerField(default=0)
    image = models.ImageField(
        null=True, blank=True, default="placeholder.png", upload_to=upload_to
    )

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    name = models.CharField(max_length=200)
    rating = models.IntegerField(default=5)
    comment = models.TextField(blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.rating)


class ShippingAddress(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    fullName = models.CharField(max_length=200, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    state = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return str(self._id)


class Order(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    sessionId = models.CharField(max_length=200, null=True)

    taxPrice = MoneyField(
        max_digits=19,
        decimal_places=4,
        default_currency=settings.DEFAULT_CURRENCY,
        null=True,
    )
    shippingPrice = MoneyField(
        max_digits=19,
        decimal_places=4,
        default_currency=settings.DEFAULT_CURRENCY,
        null=True,
    )
    totalPrice = MoneyField(
        max_digits=19,
        decimal_places=4,
        default_currency=settings.DEFAULT_CURRENCY,
        null=True,
    )

    shippingAddress = models.ForeignKey(
        ShippingAddress, on_delete=models.SET_NULL, null=True, blank=True
    )
    paymentIntentId = models.CharField(
        max_length=200, null=True, blank=True, db_index=True
    )
    invoiceId = models.CharField(max_length=200, null=True, blank=True, db_index=True)

    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)

    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self._id)


class OrderItem(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(default=0)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self._id)
