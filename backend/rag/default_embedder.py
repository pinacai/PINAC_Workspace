import os
import PyPDF2
import hashlib
from pathlib import Path
from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from huggingface_hub import snapshot_download


class DefaultRAG:
    def __init__(self, embedding_model="sentence-transformers/all-MiniLM-L6-v2"):
        self.vector_store = None
        self.embedding_model = embedding_model
        # currently only cpu is supported
        self.embeddings = HuggingFaceEmbeddings(
            model_name=self.embedding_model,
            model_kwargs={"device": "cpu"},
        )
        self.last_processed_pdf_path = None
        self.vector_store_dir = "vector_stores"
        os.makedirs(self.vector_store_dir, exist_ok=True)

    def _get_vector_store_path(self, pdf_path: str) -> str:
        # Sanitize or hash the pdf_path to create a valid filename
        pdf_filename = os.path.basename(pdf_path)
        path_hash = hashlib.md5(pdf_path.encode()).hexdigest()
        store_filename = f"{os.path.splitext(pdf_filename)[0]}_{path_hash}.faiss"
        return os.path.join(self.vector_store_dir, store_filename)

    def extract_text_from_pdf(self, pdf_path: str) -> str:
        text = ""
        with open(pdf_path, "rb") as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text

    def split_text(
        self, text: str, chunk_size: int = 1000, chunk_overlap: int = 200
    ) -> List[str]:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap, length_function=len
        )
        chunks = text_splitter.split_text(text)
        return chunks

    def create_vector_store(self, chunks: List[str]) -> None:
        self.vector_store = FAISS.from_texts(chunks, self.embeddings)

    def process_pdf(
        self, pdf_path: str, chunk_size: int = 1000, chunk_overlap: int = 200
    ) -> None:
        store_path = self._get_vector_store_path(pdf_path)

        if self.last_processed_pdf_path == pdf_path and self.vector_store is not None:
            return

        if os.path.exists(store_path):
            try:
                self.vector_store = FAISS.load_local(
                    store_path, self.embeddings, allow_dangerous_deserialization=True
                )
                self.last_processed_pdf_path = pdf_path
                return
            except Exception as e:
                print(
                    f"Error loading vector store from {store_path}: {e}. Reprocessing.",
                    flush=True,
                )

        text = self.extract_text_from_pdf(pdf_path)
        chunks = self.split_text(text, chunk_size, chunk_overlap)
        self.create_vector_store(chunks)

        try:
            self.vector_store.save_local(store_path)
        except Exception as e:
            print(f"Error saving vector store to {store_path}: {e}", flush=True)

        self.last_processed_pdf_path = pdf_path

    def process_multiple_pdfs(
        self, pdf_paths: List[str], chunk_size: int = 1000, chunk_overlap: int = 200
    ) -> None:
        all_chunks = []
        for path in pdf_paths:
            text = self.extract_text_from_pdf(path)
            chunks = self.split_text(text, chunk_size, chunk_overlap)
            all_chunks.extend(chunks)

        self.create_vector_store(all_chunks)
        self.last_processed_pdf_path = None

    def similarity_search(self, query: str, k: int = 3) -> List[str]:
        if not self.vector_store:
            raise ValueError("Vector store not initialized. Process a PDF first.")

        documents = self.vector_store.similarity_search(query, k=k)
        return [doc.page_content for doc in documents]


# Check if the embedding model is downloaded
def check_embedding_model(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
):
    home = Path.home()
    cache_dir = str(home / ".cache" / "huggingface" / "hub")
    try:
        snapshot_download(
            repo_id=model_name,
            local_dir=None,  # Use default cache location
            local_dir_use_symlinks=False,
            revision="main",
            repo_type="model",
            cache_dir=cache_dir,
            local_files_only=True,  # Only check local files, don't download
        )
        return True
    except Exception:
        return False


# Download the embedding model
def download_embedding_model(model_name="sentence-transformers/all-MiniLM-L6-v2"):
    if check_embedding_model(model_name):
        return {"status": "success"}
    try:
        HuggingFaceEmbeddings(
            model_name=model_name,
            model_kwargs={"device": "cpu"},
        )
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
