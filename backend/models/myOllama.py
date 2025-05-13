import ollama
import json
import subprocess
import platform
from custom_types import ChatRequest
from rag.default_embedder import DefaultRAG
from web_search.duckDuckGo_search import duckDuckGo_search


def generate_response_stream(chat_request: ChatRequest):
    try:
        # Check for RAG
        if chat_request.rag:
            rag = DefaultRAG()
            rag.process_pdf(chat_request.documents_path)
            contexts = rag.similarity_search(chat_request.prompt)
            chat_request.prompt = f"User query: {chat_request.prompt}\n\nAnswer the following question based on the provided context. If you cannot answer the question based on the context, say so.\n\nContext:\n{'\n\n'.join(contexts)}"

        # Check for quick web search
        elif chat_request.web_search and chat_request.quick_search:
            search_result = duckDuckGo_search(chat_request.prompt)
            chat_request.prompt = f"User query: {chat_request.prompt}\n\nI've searched the web for information to help answer this query. Here are the search results:\n\n{search_result}\n\nBased on these search results, please provide a comprehensive and accurate answer to the user's query. If the search results don't contain enough information, please say so and provide the best answer based on your knowledge."

        messages = chat_request.history

        # Add system prompt if provided
        if chat_request.system_prompt:
            messages.insert(
                0, {"role": "system", "content": chat_request.system_prompt}
            )

        # Add the current user prompt
        messages.append({"role": "user", "content": chat_request.prompt})

        # Configure the stream parameters
        stream_config = {
            "model": chat_request.model,
            "messages": messages,
            "stream": True,
            "options": {
                "temperature": chat_request.temperature,
                "top_p": chat_request.top_p,
                "top_k": chat_request.top_k,
                "num_predict": chat_request.max_tokens,
            },
        }

        # Stream the response
        for chunk in ollama.chat(**stream_config):
            if "message" in chunk:
                response_chunk = {
                    "content": chunk["message"]["content"],
                    "done": chunk.get("done", False),
                }
                # Yield the chunk as a Server-Sent Event
                yield f"data: {json.dumps(response_chunk)}\n\n"

    except Exception as e:
        error_response = {"error": str(e), "done": True}
        yield f"data: {json.dumps(error_response)}\n\n"


def generate_response(chat_request: ChatRequest):
    try:
        response = ollama.chat(
            model=chat_request.model,
            messages=[
                {
                    "role": "user",
                    "content": chat_request.prompt,
                },
            ],
        )
        return response["message"]["content"]

    except Exception as e:
        return f"error {str(e)}"


def model_list():
    models = ollama.list()
    return models


def ensure_ollama_running():
    try:
        # Try to list models - this will fail if Ollama is not running
        model_list()
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
                model_list()
                return True
            except Exception:
                print("Failed to start Ollama")
                return False

        except Exception as e:
            print(f"Error starting Ollama: {str(e)}")
            return False
