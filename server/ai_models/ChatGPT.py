import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate
from langchain.schema import BaseOutputParser
from ai_models.data.training_data import taskClassification_dataset, assistant_dataset, findName_dataset


load_dotenv(dotenv_path="server/configs/.env")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


class MyOutputParser(BaseOutputParser):
    def parse(self, text: str) -> str:
        return text


llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY, temperature=0.7, model_name="gpt-3.5-turbo"
)

taskClassify_prompt = ChatPromptTemplate.from_messages(taskClassification_dataset)
taskClassificationChain = taskClassify_prompt | llm | MyOutputParser()

assistantPrompt = ChatPromptTemplate.from_messages(assistant_dataset)
assistantChain = assistantPrompt | llm | MyOutputParser()

findNamePrompt = ChatPromptTemplate.from_messages(findName_dataset)
findNameChain = findNamePrompt | llm | MyOutputParser()

print("chain created")


def classifyTask(query: str):
    # Extend the chat prompt with the previous chat history
    # chat_prompt.extend(chatHistory)

    # Append the current query to the chat prompt
    # chat_prompt.append(query)

    # Invoke the AI model with the query to generate a response
    response = taskClassificationChain.invoke({"text": query})
    # Return the AI-generated response
    return response


def generalAssistant(user_input):
    # Invoke the assistantChain with the user input to generate a response
    response = assistantChain.invoke({"text": user_input})
    # Return the response back to the caller
    return response


def findName(user_input):
    # Invoke the nameChain with the user input to find a name
    response = findNameChain.invoke({"text": user_input})
    return response
