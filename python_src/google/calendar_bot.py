# importing
from src.google.__init__ import createService
import datetime


class GoogleCalendarManager:
    """
    Manages calendar using Google Calendar API and provides user-friendly functions.
    """

    def __init__(self):
        """
        Initializes the CalendarManager and creates a Google API service object.

        Raises:
            Exception: If an error occurs during Google API service creation.
        """
        try:
            self.service = createService('calendar', 'v3')
        except Exception as e:
            return e
    

    def upcomingEvent(self, amount=10):
        """
        Retrieve upcoming events from the calendar.

        Args:
            amount (int): The number of upcoming events to retrieve.

        Returns:
            dict: A dictionary containing the upcoming event IDs as keys and their start time and summary as values.
            Returns None if no events are found.
        """
        now = datetime.datetime.utcnow().isoformat() + "Z"
        events_result = self.service.events().list(calendarId="primary", timeMin=now, maxResults=amount, singleEvents=True, orderBy="startTime",).execute()
        events = events_result.get("items", [])
        event_list = []
        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            event_list.append([str(event["id"]), start, event["summary"]])

        return event_list


    def todaysEvent(self):
        """
        Retrieve today's events from the calendar and return a dictionary containing 
        event IDs as keys and their start time and summary as values.
        """
        now = datetime.datetime.utcnow().isoformat() + "Z"
        end = str(now).split("T")[0] + "T23:59:59.00" + "Z"
        events_result = (self.service.events().list(calendarId="primary", timeMin=now, maxResults=10, timeMax=end, singleEvents=True, orderBy="startTime").execute())
        events = events_result.get("items", [])
        event_list = []
        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            event_list.append([str(event["id"]), start, event["summary"]])

        return event_list
        
