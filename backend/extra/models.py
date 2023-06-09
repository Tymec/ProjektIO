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