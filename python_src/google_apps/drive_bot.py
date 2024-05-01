import os.path
import io, shutil
from mimetypes import MimeTypes
from __init__ import createService
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload


class GoogleDriveManager:
    """
    Manages Google Drive using Google Drive API and provides user-friendly functions.

    This class simplifies interaction with Google Drive by offering methods for listing, searching, downloading, and uploading files.
    """

    def __init__(self):
        """
        Initializes the GoogleDriveManager and creates a Google API service object.

        Raises:
            Exception: If an error occurs during Google API service creation.
        """
        try:
            self.service = createService('drive', 'v3')
        except Exception as e:
            raise e

    def getFileList(self, amount: int):
        """
        Lists files in your Google Drive.

        This method retrieves a specified number of files from your Drive and prints their names.

        Args:
            amount (int): The maximum number of files to list.
        """
        results = self.service.files().list(pageSize=amount).execute()
        files = results.get('files', [])
        file_list = []
        for file in files:
            file_list.append(file['name'])

        return file_list


    def searchFile(self, file_name: str):
        """
        Searches for files in your Google Drive by name.

        This method searches for files containing the provided name fragment and prints their names and IDs.

        Args:
            file_name (str): The name fragment to search for (case-sensitive).
        """
        query = f"name contains '{file_name}'"
        results = self.service.files().list(pageSize=10, q=query).execute()  # Removed pageSize
        files = results.get('files', [])
        file_list = []
        for file in files:
            file_list.append([file['id'], file['name']])

        return file_list

    
    def downloadFile(self, file_id: str, file_name: str):  # actual file's name with it's file extension
        """
        Downloads a file from your Google Drive by its ID.

        This method downloads a file with the specified ID and saves it with the provided filename.

        Args:
            file_id (str): The ID of the file to download.
            file_name (str): The name and extension to use for the downloaded file.

        Returns:
            bool: True if the download is successful, False otherwise.
        """
        request = self.service.files().get_media(fileId=file_id)
        fh = io.BytesIO()
        # Initialise a downloader object to download the file
        downloader = MediaIoBaseDownload(fh, request, chunksize=204800)
        done = False
        try:
            # Download the data in chunks
            while not done:
                status, done = downloader.next_chunk()
            fh.seek(0)
            # Write the received data to the file
            with open(file_name, 'wb') as f:
                shutil.copyfileobj(fh, f)
            return True
        
        except:
            return False
        

    def uploadFile(self, filepath: str):
        """
        Uploads a file to your Google Drive.

        This method uploads the file at the specified path to your Drive.

        Args:
            filepath (str): The path to the file to upload.

        Raises:
            Exception: If an error occurs during upload. Raises a specific exception for clarity.
        """
        name = filepath.split('/')[-1]
        mimetype = MimeTypes().guess_type(name)[0]
        file_metadata = {'name': name}
        try:
            media = MediaFileUpload(filepath, mimetype=mimetype)
            # Create a new file in the Drive storage
            self.service.files().create(body=file_metadata, media_body=media, fields='id').execute()
            return True

        except:
            return False
