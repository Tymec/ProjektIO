from django.contrib import admin

from .models import Order, OrderItem, Product, Review

# Register your models here.
admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
