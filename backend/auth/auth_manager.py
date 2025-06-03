import requests
import json
import os
from auth.token_manager import SecureTokenManager


class AuthManager:
    def __init__(self):
        self.token_manager = SecureTokenManager()
        self.user_data_dir = self.token_manager.data_dir
        self.user_info_file = os.path.join(self.user_data_dir, "user-info.json")

    def refresh_id_token(self) -> dict:
        """Refresh the ID token using the stored refresh token"""
        try:
            web_api_key = self.token_manager.retrieve_token("webApiKey")
            refresh_token = self.token_manager.retrieve_token("refreshToken")

            if not web_api_key or not refresh_token:
                return {"success": False, "error": "Missing API key or refresh token"}

            response = requests.post(
                f"https://identitytoolkit.googleapis.com/v1/token?key={web_api_key}",
                headers={"Content-Type": "application/json"},
                json={
                    "grant_type": "refresh_token",
                    "refresh_token": refresh_token,
                },
            )

            if not response.ok:
                return {"success": False, "error": response.text}

            data = response.json()
            self.token_manager.store_token("idToken", data["id_token"])

            return {"success": True, "id_token": data["id_token"]}

        except Exception as e:
            return {"success": False, "error": str(e)}

    def store_auth_data(self, auth_data: dict):
        """Store authentication data from deep link"""
        try:
            # Store user info
            user_info = {
                "displayName": auth_data.get("displayName"),
                "nickname": "",
                "email": auth_data.get("email"),
                "photoURL": auth_data.get("photoUrl"),
            }

            with open(self.user_info_file, "w") as f:
                json.dump(user_info, f)

            # Store tokens
            self.token_manager.store_token("idToken", auth_data["idToken"])
            self.token_manager.store_token("refreshToken", auth_data["refreshToken"])
            self.token_manager.store_token("webApiKey", auth_data["webApiKey"])

            return {"success": True}

        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_user_info(self) -> dict:
        """Get stored user information"""
        try:
            if os.path.exists(self.user_info_file):
                with open(self.user_info_file, "r") as f:
                    return json.load(f)
            return {
                "displayName": None,
                "nickname": None,
                "email": None,
                "photoURL": None,
            }
        except Exception:
            return {
                "displayName": None,
                "nickname": None,
                "email": None,
                "photoURL": None,
            }

    def logout(self):
        """Clear all authentication data"""
        try:
            self.token_manager.clear_all_tokens()
            if os.path.exists(self.user_info_file):
                os.remove(self.user_info_file)
            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def is_authenticated(self) -> bool:
        """Check if user is authenticated"""
        return self.token_manager.has_token("idToken")

    def get_id_token(self) -> str | None:
        """Get current ID token"""
        return self.token_manager.retrieve_token("idToken")
