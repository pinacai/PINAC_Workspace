import json
from requests import post
from custom_types import ChatRequest


class DefaultChatModel:
    """A default chat model that uses a custom API for chat completions."""

    def __init__(self):
        self.api_endpoint = "https://pinac-nexus.pinacai.workers.dev"

    @property
    def _llm_type(self) -> str:
        """Return type of chat model."""
        return "default_chat_model"

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

        # Add Authorization header with Bearer token if available
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {chat_request.id_token}",
        }

        response = post(
            self.api_endpoint,
            headers=headers,
            json=request_body,
            stream=chat_request.stream,
        )
        if not response.ok:
            if response.status_code == 403:
                response_text = response.text
                if 'Unauthorized: "exp" claim timestamp check failed' in response_text:
                    raise ValueError("TOKEN_EXPIRED")

                raise ValueError(response_text)
            raise ValueError(f"Error from custom chat API: {response.text}")

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
