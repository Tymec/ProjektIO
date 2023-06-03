from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.reverse import reverse


# Create your views here.
class UsersViewSet(viewsets.ViewSet):
    """
    Users root view.
    """

    def get_view_name(self):
        return "Users"

    def list(self, request, format=None):
        return Response(
            {
                "token": reverse("token_obtain_pair", request=request, format=format),
                "refresh": reverse("token_refresh", request=request, format=format),
                "verify": reverse("token_verify", request=request, format=format),
            }
        )
