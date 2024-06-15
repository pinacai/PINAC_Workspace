from flask import Flask
from flask_socketio import SocketIO
from functools import cache
from ai_models.ChatGPT import ChatGPT_3_5
from ai_models.Gemini import Gemini_1_5_Pro, Gemini_1_Pro, Gemini_1_5_Flash
from langchain.schema import HumanMessage, AIMessage


# Initializing AI Models
chatgpt_3_5 = ChatGPT_3_5()
gemini_1_5_pro = Gemini_1_5_Pro()
gemini_1_pro = Gemini_1_Pro()
gemini_1_5_flash = Gemini_1_5_Flash()


# Function to decode the email body and subject from the raw email text
def decodeEmail(text):
    lines = text.split("\n")
    subject_index = next(
        (i for i, line in enumerate(lines) if "Subject:" in line), None
    )
    body = "\n".join(lines[subject_index + 2 :]) if subject_index is not None else text
    subject = next(
        (line.replace("Subject: ", "") for line in lines if "Subject" in line), None
    )
    return body, subject


# Initialize the chat history
chatHistory = []


# Clearing chat history
def clearHistory():
    chatHistory.clear()


@cache
def giveAiResponseArray(AiModel, query):
    chatHistory.append(HumanMessage(content=query))
    ai_response = AiModel.classifyTaskCategory(query)

    if not ai_response["error_occurred"]:
        if ai_response["category"] == "compose formal email":
            email_template = AiModel.generalAssistant(query, chatHistory)

            if not email_template["error_occurred"]:
                body, subject = decodeEmail(email_template["response"])
                response = {
                    "error_occurred": False,
                    "response": {
                        "type": "email",
                        "email_subject": subject,
                        "email_body": body,
                    },
                    "error": None,
                }
                chatHistory.append(AIMessage(content=email_template["response"]))
            else:
                response = email_template

        elif ai_response["category"] == "compose informal email":
            email_template = AiModel.generalAssistant(query, chatHistory)

            if not email_template["error_occurred"]:
                body, subject = decodeEmail(email_template["response"])
                response = {
                    "error_occurred": False,
                    "response": {
                        "type": "email",
                        "email_subject": subject,
                        "email_body": body,
                    },
                    "error": None,
                }
                chatHistory.append(AIMessage(content=email_template["response"]))
            else:
                response = email_template

        else:
            ai_response = AiModel.generalAssistant(query, chatHistory)
            if not ai_response["error_occurred"]:
                response = {
                    "error_occurred": False,
                    "response": {"type": "others", "content": ai_response["response"]},
                    "error": None,
                }
                chatHistory.append(AIMessage(content=ai_response["response"]))
            else:
                response = ai_response

    else:
        response = {}

    return response


def processClientRequest(request: dict):
    if request["request_type"] == "user-input":
        if request["preferred_model"] == "ChatGPT-3.5 turbo":
            response = giveAiResponseArray(chatgpt_3_5, request["user_query"])
        elif request["preferred_model"] == "Gemini 1.5 Pro":
            response = giveAiResponseArray(gemini_1_5_pro, request["user_query"])
        elif request["preferred_model"] == "Gemini 1.0 Pro":
            response = giveAiResponseArray(gemini_1_pro, request["user_query"])
        elif request["preferred_model"] == "Gemini Flash 1.5":
            response = giveAiResponseArray(gemini_1_5_flash, request["user_query"])

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
