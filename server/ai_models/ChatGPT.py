import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate
from langchain.schema import BaseOutputParser
from ai_models.data.training_data import dataset, findNameDataset


load_dotenv(dotenv_path="server/configs/.env")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


class MyOutputParser(BaseOutputParser):
    def parse(self, text: str) -> str:
        return text


llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY, temperature=0.7, model_name="gpt-3.5-turbo"
)

chat_prompt = ChatPromptTemplate.from_messages(dataset)
chain = chat_prompt | llm | MyOutputParser()

namePrompt = ChatPromptTemplate.from_messages(findNameDataset)
nameChain = namePrompt | llm | MyOutputParser()

print("chain created")


def askAI(query: str, chatHistory: list):
    # Extend the chat prompt with the previous chat history
    # chat_prompt.extend(chatHistory)

    # Append the current query to the chat prompt
    # chat_prompt.append(query)

    # Invoke the AI model with the query to generate a response
    response = chain.invoke({"text": query})

    # Return the AI-generated response
    return response


def findName(user_input):
    # Invoke the nameChain with the user input to find a name
    response = nameChain.invoke({"text": user_input})
    return response
