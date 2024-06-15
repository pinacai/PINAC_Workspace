import os
from dotenv import load_dotenv
from ai_models.__init__ import prepareDataset
from langchain_openai import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser


# Loading API Keys
load_dotenv(dotenv_path="backend/user data/.env")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# output parser
output_parser = StrOutputParser()

# Datasets
TCC_Dataset = prepareDataset("backend/server/ai_models/dataset/TCC_Dataset.csv")
CAIT_Dataset = prepareDataset("backend/server/ai_models/dataset/CAIT_Dataset.csv")
TNR_Dataset = prepareDataset("backend/server/ai_models/dataset/TNR_Dataset.csv")


class ChatGPT:
    def __init__(self) -> None:
        self.taskClassificationPrompt = ChatPromptTemplate.from_messages(TCC_Dataset)
        self.generalAssistantPrompt = ChatPromptTemplate.from_messages(CAIT_Dataset)
        self.nameRecognitionPrompt = ChatPromptTemplate.from_messages(TNR_Dataset)

    def chainInitializer(self, llm):
        self.taskClassificationChain = (
            self.taskClassificationPrompt | llm | output_parser
        )
        self.generalAssistantChain = self.generalAssistantPrompt | llm | output_parser
        self.nameRecognitionChain = self.nameRecognitionPrompt | llm | output_parser

    # For classifying the user query into specific task category
    def classifyTaskCategory(self, user_input):
        try:
            aiResponse = self.taskClassificationChain.invoke({"text": user_input})
            response = {"error_occurred": False, "category": aiResponse, "error": None}
        except Exception as e:
            response = {"error_occurred": True, "category": None, "error": str(e)}
        return response

    # General & specialised task assistance
    def generalAssistant(self, user_input, chatHistory):
        try:
            # Extend the chat prompt with the previous chat history
            self.generalAssistantPrompt.extend(chatHistory)
            # Append the current query to the chat prompt
            self.generalAssistantPrompt.append(user_input)
            aiResponse = self.generalAssistantChain.invoke({"text": user_input})
            response = {"error_occurred": False, "response": aiResponse, "error": None}

        except Exception as e:
            response = {"error_occurred": True, "response": None, "error": str(e)}

        return response

    # For Google contact automation, we need to extract and return names from the query
    def findName(self, user_input):
        try:
            aiResponse = self.nameRecognitionChain.invoke({"text": user_input})
            response = {"error_occurred": False, "response": aiResponse, "error": None}
        except Exception as e:
            response = {"error_occurred": True, "response": None, "error": str(e)}
        return response


class ChatGPT_3_5:
    def __init__(self):
        self.llm = ChatOpenAI(
            openai_api_key=OPENAI_API_KEY, temperature=0.5, model_name="gpt-3.5-turbo"
        )
        self.chatGPT = ChatGPT()
        self.chatGPT.chainInitializer(self.llm)

    def classifyTaskCategory(self, user_input):
        return self.chatGPT.classifyTaskCategory(user_input)

    def generalAssistant(self, user_input, chatHistory):
        return self.chatGPT.generalAssistant(user_input, chatHistory)

    def findName(self, user_input):
        return self.chatGPT.findName(user_input)
