import os
from requests import post, Response
from dotenv import load_dotenv
from custom_types import ChatRequest


class DefaultChatModel:
    """A default chat model that uses a custom API for chat completions."""

    def __init__(self):
        load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))
        self.api_endpoint = os.environ.get("DEVELOPMENT_SERVER")
        self.headers = {"Content-Type": "application/json"}

    @property
    def _llm_type(self) -> str:
        """Return type of chat model."""
        return "default_chat_model"

    def _process_streaming_response(self, response: Response):
        """Process a streaming response and yield chunks as they arrive."""

        for line in response.iter_lines():
            if line:
                # Decode the line and yield it
                chunk = line.decode("utf-8")
                if chunk.strip():
                    yield chunk

    def _generate(self, chat_request: ChatRequest):
        """Generate a chat completion using the custom API.

        Returns:
            For non-streaming requests: A string containing the complete response
            For streaming requests: A generator yielding response chunks
        """
        request_body = {
            "messages": chat_request.messages,
            "stream": chat_request.stream,
        }

        response = post(self.api_endpoint, headers=self.headers, json=request_body)
        if response.status_code != 200:
            raise ValueError(f"Error from custom chat API: {response.text}")

        try:
            if chat_request.stream:
                return self._process_streaming_response(response)
            else:
                result = response.json()
                assistant_message = result.get("response", "")

                return assistant_message

        except Exception as e:
            error_msg = str(e)
            if "<!DOCTYPE html>" in error_msg:
                raise ValueError(
                    "API returned HTML instead of JSON. The server may be down or experiencing issues."
                )
            else:
                raise ValueError(f"Error generating chat completion: {e}")
