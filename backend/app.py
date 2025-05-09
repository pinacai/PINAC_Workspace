"""
NOTE
In the backend files, normal `print("some text")` will not work.
Use `print("some text", flush=True)` instead.
"""

from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import os
import sys
import argparse
from custom_types import ChatRequest
from web_scraper.duckDuckGo_search import duckDuckGo_search
from rag.default_embedder import (
    DefaultRAG,
    check_embedding_model,
    download_embedding_model,
)
from models.useOllama import (
    generate_response_stream,
    model_list,
    ensure_ollama_running,
)

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


@app.route("/api/rag/default-embedder", methods=["POST"])
def default_embedder():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400

        data = request.get_json()
        chat_request = ChatRequest.from_json(data)
        rag = DefaultRAG()
        rag.process_pdf(chat_request.documents_path)
        contexts = rag.similarity_search(chat_request.prompt)
        return jsonify("\n\n".join(contexts))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/web/search/quick-search", methods=["POST"])
def quick_search_result():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400

        data = request.get_json()
        chat_request = ChatRequest.from_json(data)
        return jsonify(duckDuckGo_search(chat_request.prompt))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/chat/ollama/stream", methods=["POST"])
def stream_ollama():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400

        data = request.get_json()
        chat_request = ChatRequest.from_json(data)
        return Response(
            generate_response_stream(chat_request), mimetype="text/event-stream"
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/ollama/models", methods=["GET"])
def list_models():
    try:
        ollama = model_list()
        models = [model.model for model in ollama.models]
        return jsonify(models)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    ensure_ollama_running()

    if debug:
        # Use Flask's development server for debugging
        app.run(host="127.0.0.1", port=port, debug=True)
    else:
        # Use waitress for better performance
        from waitress import serve

        serve(app, host="127.0.0.1", port=port)
