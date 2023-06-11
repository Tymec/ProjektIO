from app.utils import pretty_json


class DebugRequestsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Print request information
        req_body = request.body or "{}"
        print(f"Request: {request.method} {request.path}")
        print(f"Body:\n{pretty_json(req_body)}")

        response = self.get_response(request)

        # Print response information
        res_body = response.content or "{}"
        print(f"Response: {response.status_code}")
        try:
            print(f"Body:\n {pretty_json(res_body)}")
        except Exception:
            print(f"Body:\n {res_body}")

        return response
