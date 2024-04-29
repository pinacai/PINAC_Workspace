
"""
----->  UsingLangChanin to get answer from PDF
"""

# from PyPDF2 import PdfReader
# from langchain.embeddings.openai import OpenAIEmbeddings
# from langchain.text_splitter import CharacterTextSplitter
# from langchain_community.vectorstores import FAISS
# from dotenv import load_dotenv
# import os

# load_dotenv()

# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# pdfreader = PdfReader("/home/rajesh/Documents/Hands-On Machine Learning TensorFlow LifeFeeling.pdf")

# from typing_extensions import Concatenate

# # raw_text = ''from langchain_community.llms import HuggingFaceHub
# # for i, page in enumfrom langchain import HuggingFaceHuberate(pdfreader.pages[0:80]):
# #     content = page.extract_text()
# #     if content:
# #         raw_text += content
# # print("Text extraction done.")

# text_splitter = CharacterTextSplitter(
#     separator="\n",
#     chunk_size=800,
#     chunk_overlap=200,
#     length_function=len
# )

# raw_text = "Present Date : 7.4.2024T13:15:40"

# texts = text_splitter.split_text(raw_text)
# len(texts)

# embeddings = OpenAIEmbeddings()
# docsearch = FAISS.from_texts(texts, embeddings)

# from langchain.schema import HumanMessage, SystemMessage, AIMessage
# from langchain.chains.question_answering import load_qa_chain
# from langchain.llms import OpenAI

# chain = load_qa_chain(OpenAI(), chain_type="stuff")

# query = "Hey who are you & whats the time ?"

# docs = docsearch.similarity_search(query)
# ans = chain.run(input_documents=docs, question=query)

# print(ans)


"""
-------->  Using LangChain to Train OpenAI Model to get answer
"""

# from data.training_data import dataset

# from langchain_community.llms import HuggingFaceHub
# from langchain.prompts import PromptTemplate
# from langchain.chains import LLMChain
# from langchain_openai import ChatOpenAI
# from langchain.schema import HumanMessage, SystemMessage, AIMessage
# from langchain.prompts.chat import ChatPromptTemplate
# from langchain.schema import BaseOutputParser
# from dotenv import load_dotenv
# import os


# load_dotenv()
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")

# # llm = HuggingFaceHub(repo_id="mistralai/Mistral-7B-Instruct-v0.2", model_kwargs={"temperature":0.5, "max_tokens":120})
# # print(llm.predict("write python code to get random number between 1 and 6"))


# chat_llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, temperature=0.6, model_name="gpt-3.5-turbo")
# response = chat_llm(dataset)

# # response = chat_llm.predict("write a email to celebrate my friend's achievement on getting into IIT Bombay. Briefly acknowledge his success and express my well wishes.")
# # response = BaseOutputParser(raw_response)
# print()
# print()
# print(response)


"""
------------->  Using G4F to integrate LLM
"""

# def find_name(query):
#     """Find a name in the dataset based on the query."""
#     messages = findName_dataset + [{"role": "user", "content": query}]
#     return g4f.ChatCompletion.create(
#         model=None,
#         provider=g4f.Provider.HuggingFace,  # Model: Llama2, HuggingFace, PerplexityLabs
#         messages=messages
#         )
