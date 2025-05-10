from dataclasses import dataclass, field
from typing import Optional, List, Dict


@dataclass
class ChatRequest:
    prompt: str
    model: Optional[str] = None
    system_prompt: Optional[str] = "You are a helpful assistant that provides accurate, well-structured answer. If user didn't ask for detailed or long answer give a concise answer."
    # conversation history
    history: Optional[List[Dict[str, str]]] = field(default_factory=list)
    # settings
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
