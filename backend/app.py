"""
NOTE
In the backend files, normal `print("some text")` will not work.
Use `print("some text", flush=True)` instead.
"""

import os
import sys
import argparse
from datetime import datetime
from requests import post
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from custom_types import ChatRequest
from rag.functions import check_embedding_model, download_embedding_model
from rag.default_embedder import DefaultRAG
from models.defaultModel import DefaultChatModel
from models.ollamaModel import OllamaChatModel

app = Flask(__name__)
CORS(app)

# Parse command line arguments
parser = argparse.ArgumentParser(description="Python Backend API")
parser.add_argument("--port", type=int, default=5000, help="Port to run the server on")
parser.add_argument("--debug", action="store_true", help="Run in debug mode")

# Parse only known args when running as script
# and ignore arguments when running via PyInstaller
if __name__ == "__main__":
    if getattr(sys, "frozen", False):
        # Running as PyInstaller bundle
        args, _ = parser.parse_known_args()
    else:
        # Running as script
        args = parser.parse_args()
else:
    args = parser.parse_args([])

port = int(os.environ.get("PORT", args.port))
debug = os.environ.get("DEBUG", "False").lower() == "true" or args.debug

# Initializing the chat model
default_model = DefaultChatModel()
ollama_model = OllamaChatModel()


@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({"status": "running", "port": port})


@app.route("/api/rag/default-embedder/status", methods=["GET"])
def default_embedder_status():
    status = check_embedding_model()
    return jsonify({"status": status})


@app.route("/api/rag/default-embedder/download", methods=["GET"])
def default_embedder_download():
    status = download_embedding_model()
    return jsonify(status)


@app.route("/api/chat/pinac-cloud/stream", methods=["POST"])
def stream_pinac_cloud():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400

        data = request.get_json()
        chat_request = ChatRequest.from_json(data)

        if chat_request.web_search:
            current_date = datetime.now().strftime("%B %d, %Y")
            response = post(
                "http://pinac-oracle.pinacai.workers.dev",
                headers={"Content-Type": "application/json"},
                json={
                    "messages": chat_request.messages,
                    "prompt": chat_request.prompt,
                    "date": current_date,
                },
            )
            final_prompt = response.json()
            chat_request.messages.extend(final_prompt)
            return Response(
                default_model._generate(chat_request), mimetype="text/event-stream"
            )

        elif chat_request.rag:
            rag = DefaultRAG()
            rag.process_pdf(chat_request.documents_path)
            context_chunk = rag.similarity_search(chat_request.prompt)
            context = "\n---\n".join(context_chunk)
            chat_request.messages.append(
                {
                    "role": "system",
                    "content": (
                        "You are an expert assistant. Use ONLY the following context to give a clear, structured, comprehensive yet concise answer. "
                        "If the answer is not present, reply: 'I couldn't find any relevant information.'\n\n"
                        f'Context:\n"""\n{context}\n"""'
                    ),
                }
            )
            chat_request.messages.append(
                {
                    "role": "user",
                    "content": chat_request.prompt,
                }
            )
            return Response(
                default_model._generate(chat_request), mimetype="text/event-stream"
            )

        chat_request.messages.append({"role": "user", "content": chat_request.prompt})
        return Response(
            default_model._generate(chat_request), mimetype="text/event-stream"
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/chat/ollama/stream", methods=["POST"])
def stream_ollama():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400

        data = request.get_json()
        chat_request = ChatRequest.from_json(data)

        if chat_request.web_search:
            current_date = datetime.now().strftime("%B %d, %Y")
            response = post(
                "http://pinac-oracle.pinacai.workers.dev",
                headers={"Content-Type": "application/json"},
                json={
                    "messages": chat_request.messages,
                    "prompt": chat_request.prompt,
                    "date": current_date,
                },
            )
            final_prompt = response.json()
            chat_request.messages.extend(final_prompt)
            return Response(
                ollama_model._generate(chat_request), mimetype="text/event-stream"
            )

        elif chat_request.rag:
            rag = DefaultRAG()
            rag.process_pdf(chat_request.documents_path)
            context_chunk = rag.similarity_search(chat_request.prompt)
            context = "\n---\n".join(context_chunk)
            chat_request.messages.append(
                {
                    "role": "system",
                    "content": (
                        "You are an expert assistant. Use ONLY the following context to give a clear, structured, comprehensive yet concise answer. "
                        "If the answer is not present, reply: 'I couldn't find any relevant information.'\n\n"
                        f'Context:\n"""\n{context}\n"""'
                    ),
                }
            )
            chat_request.messages.append(
                {
                    "role": "user",
                    "content": chat_request.prompt,
                }
            )
            return Response(
                ollama_model._generate(chat_request), mimetype="text/event-stream"
            )

        chat_request.messages.append({"role": "user", "content": chat_request.prompt})
        return Response(
            ollama_model._generate(chat_request), mimetype="text/event-stream"
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/ollama/models", methods=["GET"])
def list_models():
    try:
        ollama = ollama_model.list_available_models()
        models = [model.model for model in ollama.models]
        return jsonify(models)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    ollama_model.ensure_ollama_running()

    if debug:
        # Use Flask's development server for debugging
        app.run(host="127.0.0.1", port=port, debug=True)
    else:
        # Use waitress for better performance
        from waitress import serve

        serve(app, host="127.0.0.1", port=port)
