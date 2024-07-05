import pandas as pd
from langchain.schema import HumanMessage, SystemMessage, AIMessage


def prepareDataset(filePath: str):
    raw_dataset = pd.read_csv(filePath)

    dataset = []
    for _, row in raw_dataset.iterrows():
        if row["type"] == "SystemMessage":
            dataset.append(SystemMessage(content=row["content"]))
        elif row["type"] == "HumanMessage":
            dataset.append(HumanMessage(content=row["content"]))
        elif row["type"] == "AIMessage":
            dataset.append(AIMessage(content=row["content"]))
    dataset.append(("human", "{text}"))
    return dataset


def prepareDatasetWithoutSystemMessage(filePath: str):
    raw_dataset = pd.read_csv(filePath)

    dataset = []
    for _, row in raw_dataset.iterrows():
        if row["type"] == "SystemMessage":
            dataset.append(HumanMessage(content=row["content"]))
        elif row["type"] == "HumanMessage":
            dataset.append(HumanMessage(content=row["content"]))
        elif row["type"] == "AIMessage":
            dataset.append(AIMessage(content=row["content"]))
    dataset.append(("human", "{text}"))
    return dataset
