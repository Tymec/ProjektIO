from django.contrib import admin

from .models import ChatConversationContext, ImageGeneration, NewsletterUser

admin.site.register(ImageGeneration)
admin.site.register(NewsletterUser)
admin.site.register(ChatConversationContext)
