from pathlib import Path
from langchain_huggingface import HuggingFaceEmbeddings
from huggingface_hub import snapshot_download


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
