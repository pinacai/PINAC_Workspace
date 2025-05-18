from dataclasses import dataclass, field
from typing import Optional, List, Dict


@dataclass
class ChatRequest:
    id_token: Optional[str] = None
    prompt: Optional[str] = None
    messages: Optional[List[Dict[str, str]]] = field(default_factory=list)
    model: Optional[str] = None
    system_prompt: Optional[str] = None
    # settings
    stream: Optional[bool] = False
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
        return cls(**data)
