import requests
from bs4 import BeautifulSoup


search_query = "python"
google_search_url = f"https://www.google.com/search?q={search_query}"

response = requests.get(google_search_url)
print(response)
html_content = response.content
soup = BeautifulSoup(html_content, "html.parser")

search_results = []

for result in soup.find_all("div", class_="g"):
    title = result.find("h3").text
    link = result.find("a")["href"]
    snippet = result.find("div", class_="s").text
    search_results.append({"title": title, "link": link, "snippet": snippet})

# Print the search results
for result in search_results:
    print("Title:", result["title"])
    print("Link:", result["link"])
    print("Snippet:", result["snippet"])
    print()

# Save the search results to a file
with open("google_search_results.txt", "w", encoding="utf-8") as file:
    for result in search_results:
        file.write("Title: " + result["title"] + "\n")
        file.write("Link: " + result["link"] + "\n")
        file.write("Snippet: " + result["snippet"] + "\n")
        file.write("\n")
