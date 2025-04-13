import ollama
import json
from custom_types import ChatRequest


def generate_stream(chat_request: ChatRequest):
    try:
        # Configure the stream parameters
        stream_config = {
            "model": chat_request.model,
            "messages": [{"role": "user", "content": chat_request.prompt}],
            "stream": True,
            "options": {
                "temperature": chat_request.temperature,
                "top_p": chat_request.top_p,
            },
        }

        # Add system prompt if provided
        if chat_request.system_prompt:
            stream_config["messages"].insert(
                0, {"role": "system", "content": chat_request.system_prompt}
            )

        # Stream the response
        for chunk in ollama.chat(**stream_config):
            if "message" in chunk:
                # Prepare the chunk data
                response_chunk = {
                    "content": chunk["message"]["content"],
                    "done": chunk.get("done", False),
                }
                # Yield the chunk as a Server-Sent Event
                yield f"data: {json.dumps(response_chunk)}\n\n"

    except Exception as e:
        error_response = {"error": str(e), "done": True}
        yield f"data: {json.dumps(error_response)}\n\n"


def modelList():
    models = ollama.list()
    return models
