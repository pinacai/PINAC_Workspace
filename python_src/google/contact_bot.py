# importing
import json
from src.google.__init__ import createService


class GoogleContactManager:
    """
    Manages contacts using Google People API and provides user-friendly functions.
    """

    def __init__(self):
        """
        Initializes the ContactManager and creates a Google People API service object.

        Raises:
            Exception: If an error occurs during Google People API service creation.
        """
        try:
            self.service = createService("people", "v1")
        except Exception as e:
            return e


    def phoneNumber(self, query):
        """
        Searches contacts for a given query and returns the phone number associated with the first match.

        Args:
            query (str): The name or phone number to search for.

        Returns:
            str: The phone number of the first matching contact, or None if no match is found.
        """
        request = self.service.people().searchContacts(pageSize=10, query=query, readMask="names,phoneNumbers").execute()
        results = request.get("results", [])
        contact = []
        for person in range(len(results)):
            name = results[person]['person']['names'][0]['displayName']
            ph_no = results[person]['person']['phoneNumbers'][0]['canonicalForm']
            contact.append([name, ph_no])

        return contact


    def emailAddress(self, query):
        """
        Searches contacts for a given query and returns the email address associated with the first match.

        Args:
            query (str): The name or email address to search for.

        Returns:
            str: The email address of the first matching contact, or None if no match is found.
        """
        request = self.service.people().searchContacts(pageSize=10, query=query, readMask="names,emailAddresses").execute()
        results = request.get("results", [])
        email = []
        for person in range(len(results)):
            name = results[person]['person']['names'][0]['displayName']
            email = results[person]['person']['emailAddresses'][0]['value']
            email.append([name, email])
            
        return email


    def createContact(self, **kwargs):
        """
        Creates a new contact using the provided information and saves it to Google Contacts.

        Args:
            **kwargs: Keyword arguments specifying contact details.
                - first_name (str, required): The first name of the contact.
                - phone_number (str, required): The phone number of the contact.
                - other optional arguments include:
                    - middle_name (str)
                    - last_name (str)
                    - nickname (str)
                    - company (str)
                    - department (str)
                    - job_title (str)
                    - email (str)
                    - website (list)
                    - address (str)
                    - birthday (list)  # Format: [YYYY, MM, DD]
                    - anniversary (list)  # Format: [YYYY, MM, DD]

        Returns:
            bool: True if the contact is created successfully, False otherwise.
        """

        if "first_name" not in kwargs or "phone_number" not in kwargs:
            e = "Both first_name and phone_number are required"
            return e
        
        else:
            data = {
                'names': [
                    {'familyName': kwargs.get("last_name"),
                    'givenName': kwargs.get("first_name"),
                    'middleName': kwargs.get("middle_name")}
                    ],
                "phoneNumbers": [
                    {"type": "HOME",
                    "value": kwargs.get("phone_number")}
                    ],
                'nicknames': [
                    {'value': kwargs.get("nickname")}
                    ],
                'organizations': [
                    {'name': kwargs.get("company"),
                    'department': kwargs.get("department"),
                    'title': kwargs.get("job_title")}
                    ],
                "addresses": [
                    {"formattedValue": kwargs.get("address")}
                    ],
                "urls": [
                    {"type": "WEBSITE",
                    "value": kwargs.get("website")}
                    ],
                "emailAddresses": [
                    {"value": kwargs.get("email ")}
                    ],
            }
            if "birthday" in kwargs:
                for item in kwargs.get("birthday").values():
                    value = {'date': {'year': int(item[0]), 'month': int(item[1]), 'day': int(item[2])}}
                data["birthdays"] = [value]

            if "anniversary" in kwargs:
                for item in kwargs.get("anniversary").values():
                    value = {'date': {'year': int(item[0]), 'month': int(item[1]), 'day': int(item[2])}}
                data["anniversaries"] = [value]

            # preparing the data using json module
            processed_data = json.dumps(data)
            final_data = json.loads(processed_data)
            # print(final_data)
            self.service.people().createContact(body=final_data).execute()  # saving it to google with people API
            return True

