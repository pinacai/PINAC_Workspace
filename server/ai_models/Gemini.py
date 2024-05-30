import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts.chat import ChatPromptTemplate
from langchain.schema import BaseOutputParser
from langchain.schema import SystemMessage, HumanMessage

# Datasets
from ai_models.dataset.dataset1 import CAIT_Dataset
from ai_models.dataset.dataset2 import TCC_Dataset
from ai_models.dataset.dataset3 import TNR_Dataset


# Loading API Keys
load_dotenv(dotenv_path="server/configs/.env")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


class MyOutputParser(BaseOutputParser):
    def parse(self, text: str) -> str:
        return text

# Since Google AI lacks support for SystemMessage, we are
# transforming it into HumanMessage instead.
def filterDataset(dataset):
    filtered_dataset = []
    for message in dataset:
        if isinstance(message, SystemMessage):
            message = HumanMessage(content=message.content)
        filtered_dataset.append(message)
    return filtered_dataset


class Gemini:

    def __init__(self):
        self.taskClassificationPrompt = ChatPromptTemplate.from_messages(filterDataset(TCC_Dataset))
        self.generalAssistantPrompt = ChatPromptTemplate.from_messages(filterDataset(CAIT_Dataset))
        self.nameRecognitionPrompt = ChatPromptTemplate.from_messages(filterDataset(TNR_Dataset))

    def chainInitializer(self, llm):
        self.taskClassificationChain = self.taskClassificationPrompt | llm | MyOutputParser()
        self.generalAssistantChain = self.generalAssistantPrompt | llm | MyOutputParser()
        self.nameRecognitionChain = self.nameRecognitionPrompt | llm | MyOutputParser()

    # For classifying the user query into specific task category
    def classifyTaskCategory(self, user_input):
        response = self.taskClassificationChain.invoke({"text": user_input})
        return response

    # General & specialised task assistance
    def generalAssistant(self, user_input, chatHistory):
        # Extend the chat prompt with the previous chat history
        self.generalAssistantPrompt.extend(chatHistory)
        # Append the current query to the chat prompt
        self.generalAssistantPrompt.append(user_input) 
        response = self.generalAssistantChain.invoke({"text": user_input})
        return response

    # For Google contact automation, we need to extract and return names from the query
    def findName(self, user_input):
        response = self.nameRecognitionChain.invoke({"text": user_input})
        return response


# Text, Img & Video Input
# >>>   Most Capable Gemini: Complex reasoning tasks such as code and text generation,
#       -------------------  text editing, problem solving, data extraction and generation
class Gemini_1_5_Pro:

    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", api_key=GOOGLE_API_KEY)
        self.Gemini = Gemini()
        self.Gemini.chainInitializer(self.llm)

    def classifyTaskCategory(self, user_input):
        return self.Gemini.classifyTaskCategory(user_input)

    def generalAssistant(self, user_input, chatHistory):
        return self.Gemini.generalAssistant(user_input, chatHistory)

    def findName(self, user_input):
        return self.Gemini.findName(user_input)


# Only text input
# >>>   Natural language tasks, multi-turn text and code chat, and code generation
class Gemini_1_Pro:

    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(model="gemini-1.0-pro", api_key=GOOGLE_API_KEY)
        self.Gemini = Gemini()
        self.Gemini.chainInitializer(self.llm)

    def classifyTaskCategory(self, user_input):
        return self.Gemini.classifyTaskCategory(user_input)

    def generalAssistant(self, user_input, chatHistory):
        return self.Gemini.generalAssistant(user_input, chatHistory)

    def findName(self, user_input):
        return self.Gemini.findName(user_input)


# Text, Img & Video Input
# >>>   Fastest Gemini: Fast and versatile performance across a diverse variety of tasks
#       --------------
class Gemini_1_5_Flash:

    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest", api_key=GOOGLE_API_KEY)
        self.Gemini = Gemini()
        self.Gemini.chainInitializer(self.llm)

    def classifyTaskCategory(self, user_input):
        return self.Gemini.classifyTaskCategory(user_input)

    def generalAssistant(self, user_input, chatHistory):
        return self.Gemini.generalAssistant(user_input, chatHistory)

    def findName(self, user_input):
        return self.Gemini.findName(user_input)



# Text, Img & Video Input
# >>>   Expert in Vision: Visual-related tasks, like generating image descriptions or identifying objects in images
#       ----------------
class Gemini_Pro_Vision:

    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro-vision", api_key=GOOGLE_API_KEY)
        self.Gemini = Gemini()
        self.Gemini.chainInitializer(self.llm)

    def classifyTaskCategory(self, user_input):
        return self.Gemini.classifyTaskCategory(user_input)

    def generalAssistant(self, user_input, chatHistory):
        return self.Gemini.generalAssistant(user_input, chatHistory)

    def findName(self, user_input):
        return self.Gemini.findName(user_input)
