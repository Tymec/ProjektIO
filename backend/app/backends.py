from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from storages.backends.s3boto3 import S3Boto3Storage


class StaticStorageBackend(S3Boto3Storage):
    location = "static"
    default_acl = "public-read"


class MediaStorageBackend(S3Boto3Storage):
    location = "media"
    default_acl = "public-read"
    file_overwrite = False


class NumberedPaginationBackend(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "pagination": {
                    "count": self.page.paginator.count,
                    "page": self.page.number,
                    "pages": self.page.paginator.num_pages,
                    "per_page": self.page_size,
                },
                "results": data,
            }
        )
