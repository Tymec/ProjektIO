from django.contrib import admin

from .models import Order, OrderItem, Product, Review

# Register models for admin panel
admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
