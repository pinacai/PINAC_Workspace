from langchain_community.tools import DuckDuckGoSearchRun

search = DuckDuckGoSearchRun()

def duckDuckGo_search(query):
    try:
        results = search.invoke(query)
        return results
    except Exception:
        return None
