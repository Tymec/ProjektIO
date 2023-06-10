from django.contrib import admin

from .models import User


# Register models for the admin panel
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass
