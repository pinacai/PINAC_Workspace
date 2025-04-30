import PyPDF2
from langchain.text_splitter import CharacterTextSplitter


def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text


def split_text_to_chunks(text, chunk_size=1000, chunk_overlap=100):
    text_splitter = CharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    chunks = text_splitter.split_text(text)
    return chunks


def keyword_search(query, documents, top_k=3):
    query_tokens = set(query.lower().split())
    scored_docs = []
    for doc in documents:
        doc_tokens = set(doc.lower().split())
        common_tokens = query_tokens.intersection(doc_tokens)
        score = len(common_tokens)
        if score > 0:
            scored_docs.append((score, doc))
    scored_docs.sort(reverse=True, key=lambda x: x[0])
    return [doc for _, doc in scored_docs[:top_k]]


def search_pdf_for_keywords(pdf_path, query, top_k=3, chunk_size=1000, chunk_overlap=100):
    text = extract_text_from_pdf(pdf_path)
    chunks = split_text_to_chunks(text, chunk_size, chunk_overlap)
    return keyword_search(query, chunks, top_k)