import os
import json
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import appdirs


class SecureTokenManager:
    def __init__(self, master_key: str = "your-secret-master-key"):
        self.app_name = "pinac-workspace"
        self.data_dir = appdirs.user_data_dir(self.app_name)
        os.makedirs(self.data_dir, exist_ok=True)

        # Generate encryption key from master key
        key = self._derive_key(master_key)
        self.cipher = Fernet(key)

        self.token_file = os.path.join(self.data_dir, "secure-tokens.json")
        self._ensure_token_file()

    def _derive_key(self, master_key: str) -> bytes:
        """Derive encryption key from master key"""
        salt = b"fixed-salt-for-consistency"
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(master_key.encode()))
        return key

    def _ensure_token_file(self):
        """Ensure token file exists"""
        if not os.path.exists(self.token_file):
            with open(self.token_file, "w") as f:
                json.dump({}, f)

    def _load_tokens(self) -> dict:
        """Load encrypted tokens from file"""
        try:
            with open(self.token_file, "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}

    def _save_tokens(self, tokens: dict):
        """Save encrypted tokens to file"""
        with open(self.token_file, "w") as f:
            json.dump(tokens, f)

    def store_token(self, token_type: str, token: str):
        """Store a token securely"""
        try:
            encrypted_token = self.cipher.encrypt(token.encode()).decode()
            tokens = self._load_tokens()
            tokens[token_type] = encrypted_token
            self._save_tokens(tokens)
        except Exception as e:
            raise Exception(f"Failed to store {token_type}: {str(e)}")

    def retrieve_token(self, token_type: str) -> str | None:
        """Retrieve a stored token"""
        try:
            tokens = self._load_tokens()
            encrypted_token = tokens.get(token_type)

            if not encrypted_token:
                return None

            decrypted_token = self.cipher.decrypt(encrypted_token.encode()).decode()
            return decrypted_token
        except Exception as e:
            print(f"Error retrieving {token_type}: {str(e)}", flush=True)
            return None

    def delete_token(self, token_type: str):
        """Delete a specific token"""
        try:
            tokens = self._load_tokens()
            if token_type in tokens:
                del tokens[token_type]
                self._save_tokens(tokens)
        except Exception as e:
            raise Exception(f"Failed to delete {token_type}: {str(e)}")

    def clear_all_tokens(self):
        """Clear all stored tokens"""
        try:
            self._save_tokens({})
        except Exception as e:
            raise Exception(f"Failed to clear all tokens: {str(e)}")

    def has_token(self, token_type: str) -> bool:
        """Check if a token exists"""
        tokens = self._load_tokens()
        return token_type in tokens

    def get_stored_token_types(self) -> list:
        """Get all stored token types"""
        tokens = self._load_tokens()
        return list(tokens.keys())
