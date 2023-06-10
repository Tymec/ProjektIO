from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from storages.backends.s3boto3 import S3Boto3Storage


class StaticStorageBackend(S3Boto3Storage):
    location = "static"  # Specifies the storage location for static files
    default_acl = "public-read"  # Sets the default access control (ACL) for static files to public read


class MediaStorageBackend(S3Boto3Storage):
    location = "media"  # Specifies the storage location for media files
    default_acl = "public-read"  # Sets the default access control (ACL) for media files to public read
    file_overwrite = False  # Disables overwriting existing files with the same name


class NumberedPaginationBackend(PageNumberPagination):
    def get_paginated_response(self, data):
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),  # Retrieves the link for the next page of results
                    "previous": self.get_previous_link(),  # Retrieves the link for the previous page of results
                },
                "pagination": {
                    "count": self.page.paginator.count,  # Total count of items across all pages
                    "page": self.page.number,  # Current page number
                    "pages": self.page.paginator.num_pages,  # Total number of pages
                    "per_page": self.page_size,  # Number of items per page
                },
                "results": data,  # Actual data/results for the current page
            }
        )
