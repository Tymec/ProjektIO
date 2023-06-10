from django.contrib import admin

from .models import ChatConversationContext, ImageGeneration, NewsletterUser

# Register models for the admin panel
admin.site.register(ImageGeneration)
admin.site.register(NewsletterUser)
admin.site.register(ChatConversationContext)
