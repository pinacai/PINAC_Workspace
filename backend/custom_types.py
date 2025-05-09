from dataclasses import dataclass
from typing import Optional


@dataclass
class ChatRequest:
    prompt: str
    model: Optional[str] = None
    system_prompt: Optional[str] = None
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.95
    top_k: Optional[int] = 40
    max_tokens: Optional[int] = 4000
    # extra contexts
    rag: Optional[bool] = False
    documents_path: Optional[str] = None
    web_search: Optional[bool] = False
    quick_search: Optional[bool] = False
    better_search: Optional[bool] = False

    @classmethod
    def from_json(cls, data):
        if "prompt" not in data or not data["prompt"]:
            raise ValueError("Missing or empty 'prompt' in request data")
        return cls(**data)
