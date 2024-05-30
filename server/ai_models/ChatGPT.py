import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Datasets
from ai_models.dataset.dataset1 import CAIT_Dataset
from ai_models.dataset.dataset2 import TCC_Dataset
from ai_models.dataset.dataset3 import TNR_Dataset


# Loading API Keys
load_dotenv(dotenv_path="server/configs/.env")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

output_parser = StrOutputParser()


class ChatGPT:

    def __init__(self) -> None:
        self.taskClassificationPrompt = ChatPromptTemplate.from_messages(TCC_Dataset)
        self.generalAssistantPrompt = ChatPromptTemplate.from_messages(CAIT_Dataset)
        self.nameRecognitionPrompt = ChatPromptTemplate.from_messages(TNR_Dataset)

    def chainInitializer(self, llm):
        self.taskClassificationChain = self.taskClassificationPrompt | llm | output_parser
        self.generalAssistantChain = self.generalAssistantPrompt | llm | output_parser
        self.nameRecognitionChain = self.nameRecognitionPrompt | llm | output_parser

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


class ChatGPT_3_5:

    def __init__(self):
        self.llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, temperature=0.5, model_name="gpt-3.5-turbo")
        self.chatGPT = ChatGPT()
        self.chatGPT.chainInitializer(self.llm)

    def classifyTaskCategory(self, user_input):
        return self.chatGPT.classifyTaskCategory(user_input)

    def generalAssistant(self, user_input, chatHistory):
        return self.chatGPT.generalAssistant(user_input, chatHistory)

    def findName(self, user_input):
        return self.chatGPT.findName(user_input)
