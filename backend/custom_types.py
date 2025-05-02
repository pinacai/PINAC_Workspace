from dataclasses import dataclass
from typing import Optional


@dataclass
class ChatRequest:
    prompt: str
    model: str
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
        return cls(
            prompt=data.get("prompt"),
            model=data.get("model"),
            system_prompt=data.get("system_prompt"),
            temperature=data.get("temperature", 0.7),
            top_p=data.get("top_p", 0.95),
            top_k=data.get("top_k", 40),
            max_tokens=data.get("max_tokens", 4000),
            rag=data.get("rag", False),
            documents_path=data.get("documents_path", None),
            web_search=data.get("web_search", False),
            quick_search=data.get("quick_search", False),
            better_search=data.get("better_search", False),
        )
