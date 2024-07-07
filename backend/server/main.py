from flask import Flask
from flask_socketio import SocketIO
from functools import cache
from langchain.schema import HumanMessage, AIMessage


# Initializing AI Models
try:
    from ai_models.ChatGPT import ChatGPT_3_5

    chatgpt_3_5 = ChatGPT_3_5()
except:
    chatgpt_3_5 = None

try:
    from ai_models.Gemini import Gemini_1_5_Pro, Gemini_1_Pro, Gemini_1_5_Flash

    gemini_1_5_pro = Gemini_1_5_Pro()
    gemini_1_pro = Gemini_1_Pro()
    gemini_1_5_flash = Gemini_1_5_Flash()
except:
    gemini_1_5_pro = gemini_1_pro = gemini_1_5_flash = None


# Initialize the chat history
chatHistory = []


@cache
def createResponse(AiModel, query):
    ai_response = AiModel.generalAssistant(query, chatHistory)
    if not ai_response["error_occurred"]:
        chatHistory.append(AIMessage(content=ai_response["response"]))
        return {
            "error_occurred": False,
            "response": {
                "type": "others",
                "content": ai_response["response"],
            },
            "error": None,
        }
    else:
        return ai_response


def processClientRequest(request: dict):
    response = None
    if request["request_type"] == "user-input":
        # appending history
        chatHistory.append(HumanMessage(content=request["user_query"]))
        #
        if request["preferred_model"] == "ChatGPT-3.5 turbo":
            response = createResponse(chatgpt_3_5, request["user_query"])
        elif request["preferred_model"] == "Gemini 1.5 Pro":
            response = createResponse(gemini_1_5_pro, request["user_query"])
        elif request["preferred_model"] == "Gemini 1.0 Pro":
            response = createResponse(gemini_1_pro, request["user_query"])
        elif request["preferred_model"] == "Gemini Flash 1.5":
            response = createResponse(gemini_1_5_flash, request["user_query"])

    else:
        response = {
            "error_occurred": True,
            "response": None,
            "error": "Got unknown 'request-type'",
        }

    return response


app = Flask(__name__)
socketio = SocketIO(app)


@socketio.on("message")
def handle_message(requestData):
    serverResponse = processClientRequest(dict(requestData))
    socketio.emit("message-reply", serverResponse)


if __name__ == "__main__":
    socketio.run(app, allow_unsafe_werkzeug=True, debug=False)
