from django.contrib import admin

from .models import Order, OrderItem, Product, Review, ShippingAddress

# Register your models here.
admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
