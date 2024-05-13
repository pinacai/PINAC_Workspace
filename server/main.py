import datetime
from flask import Flask
from flask_socketio import SocketIO
from functools import cache
from email_validator import validate_email
from ai_models import ChatGPT
from google_apps.__init__ import createService
from google_apps.gmail_bot import GoogleGmailManager
from google_apps.calendar_bot import GoogleCalendarManager
from google_apps.contact_bot import GoogleContactManager
from google_apps.task_bot import GoogleTaskManager
from langchain.schema import HumanMessage, AIMessage


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
def get_ordinal_suffix(
    day,
):  # This function helps determine the ordinal suffix for a day number.
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
def giveResponseArray(query: str):
    """
    A function that takes a query string and returns a response array based on the query.
    
    Parameters:
        query (str): The query string entered by the user.
        
    Returns:
        response (list): A response array containing different types of responses based on the query. The response array can have the following formats:
            - ["email", subject, body]: If the query contains the order to compose an email, the response array contains the subject and body of the email.
            - ["calendar event", text]: If the query contains the order to fetch upcoming events from the calendar, the response array contains the text describing the upcoming events.
            - ["calendar today's events", text]: If the query contains the order to fetch today's events from the calendar, the response array contains the text describing the events for today.
            - ["contact", text]: If the query contains the order to fetch contact information, the response array contains the text describing the contact information.
            - ["calendar task", text]: If the query contains the order to fetch tasks from the calendar, the response array contains the text describing the due tasks.
            - ["calendar all", text]: If the query contains the order to fetch today's event and task from the calendar, the response array contains the text indicating that this feature is not available.
            - ["others", task_category]: If none of the above conditions are met, the response array contains the raw response from the ChatGPT model.
    """
    # try:
    # print(chatHistory)
    # chatHistory.append(HumanMessage(content=query))
    task_category = ChatGPT.classifyTask(query)

    if "order is composing email" in task_category:
        email_template = ChatGPT.generalAssistant(query)
        body, subject = decodeEmail(email_template)
        response = ["email", subject, body]
        chatHistory.append(AIMessage(content=task_category))

    elif "order is to fetch upcoming events from Calendar" in task_category:
        calendar = GoogleCalendarManager()
        amount = 10
        chatHistory.append(
            AIMessage(content="order is to fetch upcoming events from Calendar")
        )
        if "order is to fetch upcoming events from Calendar (amount: " in task_category:
            amount = int(task_category.split("amount: ", 1)[1].split(")", 1)[0])
        event_list = calendar.upcomingEvent(amount)
        if event_list:
            text = "Sure, here are your upcoming events: \n\n" + "\n".join(
                f"{formatDatetime(item[1])[0]}, {formatDatetime(item[1])[1]} : {item[2]}"
                for item in event_list
            )
        else:
            text = "Unfortunately, the event you are searching for does not appear to be exist"
        response = ["calendar event", text]
        chatHistory.append(AIMessage(content=text))

    elif "order is to fetch today's events from Calendar" in task_category:
        calendar = GoogleCalendarManager()
        event_list = calendar.todaysEvent()
        chatHistory.append(
            AIMessage(content="order is to fetch today's events from Calendar")
        )
        if event_list:
            text = "Sure, here are your upcoming events for today: \n\n" + "\n".join(
                f"{formatDatetime(item[1])[0]}, {formatDatetime(item[1])[1]} - {item[2]}"
                for item in event_list
            )
        else:
            text = "I am unable to locate any event for today in Google Calendar"
        response = ["calendar today's events", text]
        chatHistory.append(AIMessage(content=text))

    elif "order is fetching contact from Contact" in task_category:
        name = ChatGPT.findName(query)
        contact = GoogleContactManager()
        contact_info = contact.phoneNumber(name)
        chatHistory.append(AIMessage(content="order is fetching contact from Contact"))
        if contact_info:
            text = "Sure, here is your contact: \n\n" + "\n".join(
                f"{item[0]} : {item[1]}" for item in contact_info
            )
        else:
            text = "I am unable to locate any contact number you are searching for in Google Contact"
        response = ["contact", text]
        chatHistory.append(AIMessage(content=text))

    elif "order is to fetch task from Calendar" in task_category:
        task = GoogleTaskManager()
        task_list = task.dueTask()
        chatHistory.append(AIMessage(content="order is to fetch task from Calendar"))
        if task_list:
            text = "Sure, here are your due tasks: \n\n" + "\n".join(
                f"{formatDatetime(item[1])[0]}, {formatDatetime(item[1])[1]} - {item[0]}"
                for item in task_list
            )
        else:
            text = "Hooray! 🎉 you don't have any due tasks !"
        response = ["calendar task", text]
        chatHistory.append(AIMessage(content=text))

    elif "order is fetching today's event and task from Calendar" in task_category:
        text = "Sorry, this feature is still not available, waiting for the next update"
        response = ["calendar all", text]
        chatHistory.append(
            AIMessage(content="order is fetching today's event and task from Calendar")
        )

    else:
        response = ["others", task_category]
        chatHistory.append(AIMessage(content=task_category))

    # except:
    #     response = "Sorry something went wrong, please try again"
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
        response = giveResponseArray(data[1])

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
