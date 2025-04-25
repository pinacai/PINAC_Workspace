from webscout import DeepFind

# Initialize the search provider
ai = DeepFind()


def generate_ai_web_search(query: str, stream: bool = False, raw: bool = False):
    """Generate web search results with proper streaming format"""
    try:
        accumulated_text = ""
        for chunk in ai.search(query, stream=True):
            if chunk and isinstance(chunk, str):
                # Clean and format the chunk
                clean_chunk = chunk.strip()
                if clean_chunk:
                    accumulated_text += clean_chunk
                    # Yield the chunk with proper formatting
                    yield f"{clean_chunk}\n"

        # If no content was yielded, yield an error message
        if not accumulated_text:
            yield "No results found for the query."

    except Exception as e:
        yield f"Error during web search: {str(e)}"
