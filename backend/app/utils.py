import json
import os
import uuid


def pretty_json(s):
    # Formats and indents a JSON string for printing
    return json.dumps(json.loads(s), indent=2)


def upload_to(instance, filename):
    """Generate unique filenames for media files"""
    name, ext = os.path.splitext(filename)
    return f"{uuid.uuid4()}{ext}"
