import os
import uuid


def upload_to(instance, filename):
    name, ext = os.path.splitext(filename)
    return f"{uuid.uuid4()}{ext}"
