import datetime
from flask import Flask
from flask_socketio import SocketIO
from functools import cache
from email_validator import validate_email
from ai_models.ChatGPT import ChatGPT_3_5
from ai_models.Gemini import Gemini_1_5_Pro, Gemini_1_Pro, Gemini_1_5_Flash
from google_apps.gmail_bot import GoogleGmailManager
from google_apps.calendar_bot import GoogleCalendarManager
from google_apps.contact_bot import GoogleContactManager
from google_apps.task_bot import GoogleTaskManager
from langchain.schema import HumanMessage, AIMessage

# Initializing AI Models
chatgpt_3_5 = ChatGPT_3_5()
gemini_1_5_pro = Gemini_1_5_Pro()
gemini_1_pro = Gemini_1_Pro()
gemini_1_5_flash = Gemini_1_5_Flash()

# Function to validate email address
def validateEmail(emailId):
    try:
        validate_email(emailId)
        return True
    except:
        return False


# Function to send an email
def sendInstEmail(recipient_email, subject, body):
    try:
        gmail = GoogleGmailManager()
        gmail.sendEmail(recipient_email, subject, body)
        return True
    except:
        return False


# Function to create a draft email
def createDraftEmail(subject, body, recipient_email=None):
    try:
        gmail = GoogleGmailManager()
        if recipient_email != None:
            gmail.createDraft(
                body=body, recipient_email=recipient_email, subject=subject
            )
        else:
            gmail.createDraft(body=body, subject=subject)
        return True
    except:
        return False


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


# Function to get the ordinal suffix for a day number (e.g., 1st, 2nd, 3rd, 4th)
def get_ordinal_suffix(day):  # This function helps determine the ordinal suffix for a day number.
    if 4 <= day % 100 <= 20:
        suffix = "th"
    else:
        suffix = ("st", "nd", "rd")[day % 10 if day % 10 < 4 else 0]
    return suffix


# Function to format the date and time from a timestamp
def formatDatetime(timestamp: str):
    timestamp = timestamp[:16]
    if "T" not in timestamp:
        parsed_date = datetime.datetime.strptime(timestamp, "%Y-%m-%d")
        formatted_time = "whole day"

    elif "T" in timestamp:
        parsed_date = datetime.datetime.strptime(timestamp, "%Y-%m-%dT%H:%M")
        formatted_time = parsed_date.strftime(
            "%I:%M %p"
        )  # %I for 12-hour format, %p for AM/PM
        timestamp = timestamp.split("T")[0]
        parsed_date = datetime.datetime.strptime(timestamp, "%Y-%m-%d")

    try:
        # Get the day, month name, and day name
        day = parsed_date.day
        day_with_suffix = f"{day}{get_ordinal_suffix(day)}"
        month_name = parsed_date.strftime("%b")
        day_name = parsed_date.strftime("%A")  # Full day name (Monday, Tuesday, etc.)

        # Format the date with all desired components
        formatted_date = (
            f"{day_name}, {month_name} {day_with_suffix}, {parsed_date.year}"
        )

    except:
        formatted_date, formatted_time = "...", "..."
    return formatted_date, formatted_time


# Initialize the chat history
chatHistory = []


@cache
def giveResponseArray(ai_model, query):
    """
    A function that takes in an AI model and a query and returns a response array.

    Parameters:
        ai_model (object): The AI model used for task classification and general assistant.
        query (str): The user query.

    Returns:
        list: A response array containing different types of responses based on the task category.
            The response array has the following structure:
            [
                response_type (str): The type of response, such as "email", "calendar event", "contact", etc.
                response_text (str): The actual response text.
            ]
    """
    chatHistory.append(HumanMessage(content=query))
    task_category = ai_model.classifyTaskCategory(query)

    if "composing email" in task_category:
        email_template = ai_model.generalAssistant(query, chatHistory)
        body, subject = decodeEmail(email_template)
        response = ["email", subject, body]
        chatHistory.append(AIMessage(content=email_template))

    elif "upcoming events" in task_category:
        calendar = GoogleCalendarManager()
        amount = 10
        if "amount: " in task_category:
            amount = int(task_category.split("amount: ", 1)[1].split(")", 1)[0])
        event_list = calendar.upcomingEvent(amount)
        if event_list:
            events = []
            for item in event_list:
                events.append({"title": item[2],
                             "start": item[1],
                             "end": item[1],
                             "type": "event"})
            response = ["schedule", events]
        else:
            events = "Unfortunately, the event you are searching for does not appear to be exist"
            response = ["no schedule", events]
        chatHistory.append(AIMessage(content=str(events)))

    elif "today's events" in task_category:
        calendar = GoogleCalendarManager()
        event_list = calendar.todaysEvent()
        if event_list:
            events = []
            for item in event_list:
                events.append({"title": item[2],
                             "start": item[1],
                             "end": item[1],
                             "type": "event"})
            response = ["schedule", events]
        else:
            events = "Unfortunately, the event you are searching for does not appear to be exist"
            response = ["no schedule", events]
        chatHistory.append(AIMessage(content=str(events)))

    elif "contact" in task_category:
        name = ai_model.findName(query)
        contact = GoogleContactManager()
        contact_info = contact.phoneNumber(name)
        if contact_info:
            text = "Sure, here is your contact: \n\n" + "\n".join(
                f"{item[0]} : {item[1]}" for item in contact_info
            )
        else:
            text = "I am unable to locate any contact number you are searching for in Google Contact"
        response = ["contact", text]
        chatHistory.append(AIMessage(content="I have shown contact on screen"))

    elif "task todo" in task_category:
        task = GoogleTaskManager()
        task_list = task.dueTask()
        if task_list:
            tasks = []
            for item in task_list:
                tasks.append({"title": item[0],
                             "start": item[1],
                             "end": item[1],
                             "type": "task"})
            response = ["schedule", tasks]
        else:
            tasks = "Unfortunately, the event you are searching for does not appear to be exist"
            response = ["no schedule", tasks]
        chatHistory.append(AIMessage(content=str(tasks)))

    elif "complete schedule" in task_category:
        text = "Sorry, this feature is still not available, waiting for the next update"
        response = ["calendar all", text]
        chatHistory.append(AIMessage(content=text))

    else:
        ans = ai_model.generalAssistant(query, chatHistory)
        response = ["others", ans]
        chatHistory.append(AIMessage(content=ans))

    return response


app = Flask(__name__)
socketio = SocketIO(app)


@socketio.on("message")
def handle_message(data):
    """
    Handles incoming socket messages and performs actions based on the message data.

    Parameters:
        data (list): The message data received from the client.

    Returns:
        None

    Raises:
        None
    """
    if data[0] == "use-input":
        ai_model = data[1]
        if ai_model == "ChatGPT-3.5 turbo":
            response = giveResponseArray(chatgpt_3_5, data[2])
        elif ai_model == "Gemini 1.5 Pro":
            response = giveResponseArray(gemini_1_5_pro, data[2])
        elif ai_model == "Gemini 1.0 Pro":
            response = giveResponseArray(gemini_1_pro, data[2])
        elif ai_model == "Gemini Flash 1.5":
            response = giveResponseArray(gemini_1_5_flash, data[2])

    elif data[0] == "send-email":
        if validateEmail(data[1]):
            response = sendInstEmail(
                recipient_email=data[1], subject=data[2], body=data[3]
            )
        else:
            response = ["error", "Invalid email id"]

    elif data[0] == "create-draft-with-RE":
        if validateEmail(data[1]):
            response = createDraftEmail(
                recipient_email=data[1], subject=data[2], body=data[3]
            )
        else:
            response = ["error", "Invalid email id"]

    elif data[0] == "create-draft":
        response = createDraftEmail(subject=data[1], body=data[2])

    else:
        response = ["error", "Unknown client request type"]

    socketio.emit("message-reply", response)


if __name__ == "__main__":
    socketio.run(app, allow_unsafe_werkzeug=True, debug=False)
