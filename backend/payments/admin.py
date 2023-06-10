from django.contrib import admin

from .models import Customer

# Register models for the admin panel
admin.site.register(Customer)
