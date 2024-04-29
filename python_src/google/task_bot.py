# import
from src.google.__init__ import createService


class GoogleTaskManager:
    """
    Manages tasks using Google Task API and provides user-friendly functions.
    """
        
    def __init__(self):
        """
        Initializes the GoogleTaskManager and creates a Google Task API service object.

        Raises:
            Exception: If an error occurs during Google Task API service creation.
        """
        try: self.service = createService('tasks', 'v1')
        except Exception as e: return e

    def dueTask(self):
        results = self.service.tasks().list(tasklist='@default', maxResults=10).execute()
        items = results.get('items', [])
        if items:
            task = []
            for item in items:
                task.append([item['title'], str(item['due'])])
        else: task = None

        return task
