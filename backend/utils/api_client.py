from requests import post
from auth.auth_manager import AuthManager


class APIClient:
    """Centralized API client with automatic token refresh handling."""

    def __init__(self):
        self.auth_manager = AuthManager()

    def make_authenticated_request(
        self, url: str, json_data: dict, stream: bool = False
    ):
        """
        Make an authenticated request with automatic token refresh.

        Args:
            url: The API endpoint URL
            json_data: Request body data
            stream: Whether to stream the response

        Returns:
            requests.Response object

        Raises:
            ValueError: For authentication errors or API errors
        """
        id_token = self.auth_manager.get_id_token()
        if not id_token:
            raise ValueError("No valid authentication token")

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {id_token}",
        }

        response = post(url, headers=headers, json=json_data, stream=stream)

        if not response.ok:
            if response.status_code == 401:
                error_info = response.json()
                error_type = error_info.get("error", "Unknown error")
                error_message = error_info.get("message", response.text)

                if error_type == "TOKEN_EXPIRED":
                    refresh_result = self.auth_manager.refresh_id_token()
                    if refresh_result.get("success"):
                        # Retry once with new token
                        new_id_token = refresh_result.get("id_token")
                        headers["Authorization"] = f"Bearer {new_id_token}"
                        response = post(
                            url, headers=headers, json=json_data, stream=stream
                        )

                        if not response.ok:
                            raise ValueError(
                                f"API Error [{response.status_code}]: {response.text}"
                            )
                        return response

                    else:
                        raise ValueError(
                            f"Unable to Refresh Token: {refresh_result.get('error')}"
                        )

                elif error_type == "MISSING_TOKEN":
                    raise ValueError(error_message)

                elif error_type == "INVALID_TOKEN":
                    raise ValueError(error_message)

            # Generic error handling
            raise ValueError(f"API Error [{response.status_code}]: {response.text}")

        return response
