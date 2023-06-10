from django.conf import settings
from django.db import models


class ImageGeneration(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    image = models.ImageField(upload_to="extra/%Y/%m/%d", blank=True, null=True)
    prompt = models.TextField(blank=False, max_length=1000)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.prompt


class NewsletterUser(models.Model):
    email = models.EmailField(blank=False, null=False, unique=True)
    active = models.BooleanField(default=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{'ACTIVE' if self.active else 'INACTIVE'}] {self.email}"


class ChatConversationContext(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    init_message = models.TextField(max_length=1000, blank=False)
    context = models.JSONField(default=dict)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.init_message
