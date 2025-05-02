import requests
from bs4 import BeautifulSoup
import html2text
import time
from urllib.parse import urlparse


def extract_content_from_url(url, timeout=10):
    """
    Extract and clean content from a given URL
    """
    try:
        # Add a user agent to avoid getting blocked
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

        # Make the request
        response = requests.get(url, headers=headers, timeout=timeout)
        response.raise_for_status()  # Raise exception for HTTP errors

        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(response.text, "html.parser")

        # Remove unwanted elements
        for element in soup(
            ["script", "style", "nav", "footer", "header", "aside", "iframe", "form"]
        ):
            element.decompose()

        # Use html2text to convert to markdown
        converter = html2text.HTML2Text()
        converter.ignore_links = False
        converter.ignore_images = True
        converter.ignore_tables = False

        # Extract main content
        main_content = (
            soup.find("main")
            or soup.find("article")
            or soup.find("div", {"id": "content"})
            or soup.body
        )

        if main_content:
            text_content = converter.handle(str(main_content))
        else:
            text_content = converter.handle(str(soup))

        # Clean up the text
        text_content = clean_text(text_content)

        return {
            "url": url,
            "content": text_content,
            "title": soup.title.string if soup.title else urlparse(url).netloc,
            "success": True,
        }

    except Exception as e:
        return {
            "url": url,
            "content": "",
            "title": urlparse(url).netloc,
            "success": False,
            "error": str(e),
        }


def clean_text(text):
    """Clean extracted text by removing extra whitespace, etc."""
    import re

    # Remove multiple newlines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Remove extra whitespace
    text = re.sub(r" {2,}", " ", text)

    # Other cleanups as needed

    return text.strip()


def get_contents_from_search_results(search_results, max_pages=3):
    """
    Extract content from the top search results
    """
    contents = []

    for i, result in enumerate(search_results[:max_pages]):
        url = result["link"]  # Adjust based on your search API response format
        content_data = extract_content_from_url(url)

        if content_data["success"]:
            contents.append(
                {
                    "url": url,
                    "title": content_data["title"],
                    "content": content_data["content"],
                }
            )

        # Be nice to servers - add some delay between requests
        if i < len(search_results) - 1:
            time.sleep(1)

    return contents


if __name__ == "__main__":
    # Example usage
    url = "https://python.langchain.com/docs/integrations/providers/huggingface/"
    result = extract_content_from_url(url)
    print(result)
