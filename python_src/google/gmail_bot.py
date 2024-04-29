# importing
import os
import base64
import mimetypes
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email.mime.audio import MIMEAudio
from src.google.__init__ import createService


class GoogleGmailManager:
    """
    Class for interacting with Gmail API to create and send emails.
    """
    
    def __init__(self):
        """
        Initializes the Gmail object with the sender's email address.

        Args:
            sender_email (str): The email address of the sender.
        """
        self.sender_email = 'me'
        try:
            self.service = createService('gmail', 'v1')  # Connect to Gmail API
        except Exception as e:
            print(e)  # Provide specific error message


    #  (PART 1)---> FOR CREATING AND SENDING EMAILS
    
    def createMessage(self, recipient_email, subject, body, attachment=None):
        """
        Creates a MIME message for sending emails.

        Args:
            recipient_email (str): Email address of the recipient.
            subject (str): Subject line of the email.
            body (str): Plain text body of the email.
            attachment (str, optional): Path to an attachment file. Defaults to None.

        Returns:
            str: The MIME message as a string, ready to be sent.
        """
        message = MIMEMultipart()
        message['From'] = self.sender_email
        message['To'] = recipient_email
        message['Subject'] = subject
    
        text_part = MIMEText(body, 'plain')
        message.attach(text_part)
    
        if attachment:
            with open(attachment, 'rb') as f:
                content = f.read()
            filename = os.path.basename(attachment)
            content_type = os.path.splitext(attachment)[1]
            attachment_part = MIMEApplication(content, content_type)
            attachment_part.add_header('Content-Disposition', 'attachment; filename={}'.format(filename))
            message.attach(attachment_part)
        return message.as_string()

    
    def createDraft(self, body, recipient_email=None, subject=None, attachment=None):
        """
        Creates a draft message in Gmail.

        Args:
            to_address: Email address of the recipient.
            subject: Subject of the email.
            body: Body of the email.
            attachment_path: Path to the attachment file (optional).

        Returns:
            A dictionary containing the draft information.
        """
        message = MIMEMultipart()
        message['to'] = recipient_email
        message['subject'] = subject

        text_part = MIMEText(body)
        message.attach(text_part)

        if attachment:
            with open(attachment, 'rb') as f:
                content = f.read()
            filename = os.path.basename(attachment)
            content_type = os.path.splitext(attachment)[1]
            attachment_part = MIMEApplication(content, content_type)
            attachment_part.add_header('Content-Disposition', 'attachment; filename={}'.format(filename))
            message.attach(attachment_part)

        encoded_message = base64.urlsafe_b64encode(message.as_string().encode('utf-8')).decode()
        draft = self.service.users().drafts().create(userId='me', body={'message': {'raw': encoded_message}}).execute()
        return draft


    # for sending email with above created msg
    def sendEmail(self, recipient_email, subject, body, attachment=None):
        """
        Send an email with optional attachment to the specified recipient email address.

        Args:
            recipient_email (str): The email address of the recipient.
            subject (str): The subject of the email.
            body (str): The body of the email.
            attachment (str, optional): The file path of the attachment, if any. Defaults to None.

        Returns:
            bool or Exception: True if the email was sent successfully, otherwise an Exception object.
        """
        try:
            message = self.createMessage(recipient_email=recipient_email, subject=subject, body=body, attachment=attachment)
            message_encoded = base64.urlsafe_b64encode(message.encode('utf-8')).decode('utf-8')
            self.service.users().messages().send(userId='me', body={'raw': message_encoded}).execute()
            return True
        
        except Exception as e:
            return e


    #  (PART 2)---> FOR FETCHING EMAILS AND EMAILS DATA
