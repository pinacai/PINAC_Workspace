import subprocess
import platform
from ollama import chat, list
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

    def generate_stream(self, ollama_config):
        """
        Generate a chat completion using Ollama with streaming support.
        """
        try:
            stream_ended_properly = False
            for chunk in chat(**ollama_config):
                if chunk.get("error"):
                    # Handle error chunk from Ollama service
                    error_payload = {"error": chunk["error"], "done": True}
                    yield f"data: {dumps(error_payload)}\n\n"
                    stream_ended_properly = True
                    return  # Stop generation on error

                content = ""
                if "message" in chunk and "content" in chunk["message"]:
                    content = chunk["message"]["content"]

                is_done = chunk.get("done", False)

                response_payload = {
                    "content": content,
                    "done": is_done,
                }
                yield f"data: {dumps(response_payload)}\n\n"

                if is_done:
                    stream_ended_properly = True
                    return  # Stop generation

            # If the loop finishes without Ollama signaling 'done' (e.g., stream unexpectedly ends)
            if not stream_ended_properly:
                print(
                    "Ollama stream finished without a final 'done' flag. Sending one now.",
                    flush=True,
                )
                final_done_payload = {"content": "", "done": True}
                yield f"data: {dumps(final_done_payload)}\n\n"

        except Exception as e:
            print(f"Exception in Ollama generate_stream: {str(e)}", flush=True)
            error_payload = {
                "error": f"Ollama stream processing error: {str(e)}",
                "done": True,
            }
            yield f"data: {dumps(error_payload)}\n\n"

    def _generate(self, chat_request: ChatRequest):
        """
        Generate a chat completion using Ollama.
        """
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
                return self.generate_stream(ollama_config)
            else:
                # For non-streaming, return the complete response
                response = chat(**ollama_config)
                return response["message"]["content"]

        except Exception as e:
            raise ValueError(f"Error generating chat completion: {e}", flush=True)

    def list_available_models(self):
        """List available models from Ollama."""
        try:
            models = list()
            return models
        except Exception as e:
            raise ValueError(f"Error listing models: {e}")

    def ensure_ollama_running(self):
        """
        Check if Ollama is running in the background and start it if not.

        Returns:
            bool: True if Ollama is running or was successfully started, False otherwise
        """
        try:
            # Try to list models - this will fail if Ollama is not running
            self.list_available_models()
            return True
        except Exception:
            system = platform.system()

            try:
                if system == "Windows":
                    # Start Ollama on Windows
                    subprocess.Popen(
                        ["ollama", "serve"],
                        creationflags=subprocess.CREATE_NO_WINDOW,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                    )
                elif system == "Darwin" or system == "Linux":
                    # Start Ollama on macOS or Linux
                    subprocess.Popen(
                        ["ollama", "serve"],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        start_new_session=True,
                    )
                else:
                    print(f"Unsupported operating system for Ollama: {system}")
                    return False

                try:
                    self.list_available_models()
                    return True
                except Exception:
                    print("Failed to start Ollama")
                    return False

            except Exception as e:
                print(f"Error starting Ollama: {str(e)}")
                return False
