from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import argparse

app = Flask(__name__)
CORS(app)  # Enable CORS for development

# Parse command line arguments
parser = argparse.ArgumentParser(description='Python Backend API')
parser.add_argument('--port', type=int, default=5000, help='Port to run the server on')
parser.add_argument('--debug', action='store_true', help='Run in debug mode')

# Parse only known args when running as script
# and ignore arguments when running via PyInstaller
if __name__ == "__main__":
    if getattr(sys, 'frozen', False):
        # Running as PyInstaller bundle
        args, _ = parser.parse_known_args()
    else:
        # Running as script
        args = parser.parse_args()
else:
    # Running as imported module (e.g., for testing)
    args = parser.parse_args([])

# Set port from arguments or environment variable
port = int(os.environ.get("PORT", args.port))
debug = os.environ.get("DEBUG", "False").lower() == "true" or args.debug

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "running", "port": port})

@app.route('/api/process', methods=['POST'])
def process_data():
    data = request.json
    # Process data with your Python logic
    result = {"processed": data["input"] + " (processed by Python backend)"}
    return jsonify(result)

if __name__ == "__main__":
    print(f"Starting Python backend on port {port}, debug mode: {debug}")
    
    if debug:
        # Use Flask's development server for debugging
        app.run(host='127.0.0.1', port=port, debug=True)
    else:
        # Use waitress for better performance
        from waitress import serve
        serve(app, host='127.0.0.1', port=port)