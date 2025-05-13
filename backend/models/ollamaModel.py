from ollama import chat
from json import dumps
from custom_types import ChatRequest


class OllamaChatModel:
    """Ollama Chat Model wrapper."""

    def __init__(self):
        pass

    @property
    def _llm_type(self) -> str:
        """Return type of chat model."""
        return "ollama_chat_model"

    def _generate(self, chat_request: ChatRequest):
        """Generate a chat completion using Ollama."""

        ollama_config = {
            "model": chat_request.model,
            "messages": chat_request.messages,
            "stream": chat_request.stream,
            "options": {
                "temperature": chat_request.temperature,
                "top_p": chat_request.top_p,
                "top_k": chat_request.top_k,
                "num_predict": chat_request.max_tokens,
            },
        }

        try:
            if chat_request.stream:
                # Return a generator for streaming responses
                def generate_stream():
                    for chunk in chat(**ollama_config):
                        if "message" in chunk:
                            response_chunk = {
                                "content": chunk["message"]["content"],
                                "done": chunk.get("done", False),
                            }
                    # Yield the chunk as a Server-Sent Event
                    yield f"data: {dumps(response_chunk)}\n\n"

                return generate_stream()
            else:
                # For non-streaming, return the complete response
                response = chat(**ollama_config)
                return response["message"]["content"]

        except Exception as e:
            raise ValueError(f"Error generating chat completion: {e}")
