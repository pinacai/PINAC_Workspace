import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate
from langchain.schema import BaseOutputParser
from ai_models.dataset.training_data import taskClassification_dataset, findName_dataset
from ai_models.dataset.assistant_dataset import dataset


load_dotenv(dotenv_path="server/configs/.env")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


class MyOutputParser(BaseOutputParser):
    def parse(self, text: str) -> str:
        return text


llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY, temperature=0.5, model_name="gpt-3.5-turbo"
)

taskClassify_prompt = ChatPromptTemplate.from_messages(taskClassification_dataset)
taskClassificationChain = taskClassify_prompt | llm | MyOutputParser()

assistantPrompt = ChatPromptTemplate.from_messages(dataset)
assistantChain = assistantPrompt | llm | MyOutputParser()

findNamePrompt = ChatPromptTemplate.from_messages(findName_dataset)
findNameChain = findNamePrompt | llm | MyOutputParser()

print("chain created")


# For classifying the user query into specific category
def classifyTask(query: str):
    response = taskClassificationChain.invoke({"text": query})
    return response


# For normal conversation and email writing
# with chat history
def generalAssistant(user_input, chatHistory):
    assistantPrompt.extend(
        chatHistory
    )  # Extend the chat prompt with the previous chat history
    assistantPrompt.append(user_input)  # Append the current query to the chat prompt
    response = assistantChain.invoke({"text": user_input})
    return response


# To facilitate the Google contact automation process, it is
# necessary to extract and return any names included in the query.
def findName(user_input):
    response = findNameChain.invoke({"text": user_input})
    return response
