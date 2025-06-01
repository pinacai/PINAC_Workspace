import json
from custom_types import ChatRequest
from utils.api_client import APIClient


class DefaultChatModel:
    """A default chat model that uses a custom API for chat completions."""

    def __init__(self):
        self.api_endpoint = "https://api-gateway-r5japgvg7a-ew.a.run.app/api/ai"
        self.api_client = APIClient()

    @property
    def _llm_type(self) -> str:
        """Return type of chat model."""
        return "default_chat_model"

    def _generate(self, chat_request: ChatRequest, id_token: str = None):
        """Generate a chat completion using the custom API.

        Returns:
            For non-streaming requests: A string containing the complete response
            For streaming requests: A generator yielding response chunks
        """
        request_body = {
            "messages": chat_request.messages,
            "stream": chat_request.stream,
        }

        response = self.api_client.make_authenticated_request(
            self.api_endpoint, request_body, stream=chat_request.stream
        )

        try:
            if chat_request.stream:

                def generate():
                    for line in response.iter_lines():
                        if not line:
                            continue

                        try:
                            decoded_line = line.decode("utf-8")
                        except UnicodeDecodeError:
                            continue

                        if decoded_line.strip() == "[DONE]":
                            yield 'data: {"done": true}\n\n'
                            break

                        # Handle SSE format - lines start with "data: "
                        if decoded_line.startswith("data:"):
                            try:
                                # Remove the "data: " prefix and parse JSON
                                json_str = decoded_line[5:].strip()
                                chunk = json.loads(json_str)

                                # Extract and format response for the frontend
                                response_text = chunk.get("response", "")
                                if response_text:
                                    result = json.dumps(
                                        {"content": response_text, "done": False}
                                    )
                                    yield f"data: {result}\n\n"

                            except json.JSONDecodeError:
                                continue
                        else:
                            try:
                                # Try to parse as non-SSE JSON
                                chunk = json.loads(decoded_line)
                                response_text = chunk.get("response", "")
                                if response_text:
                                    result = json.dumps(
                                        {"content": response_text, "done": False}
                                    )
                                    yield f"data: {result}\n\n"

                            except json.JSONDecodeError:
                                continue

                return generate()
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
