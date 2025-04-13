from dataclasses import dataclass
from typing import Optional


@dataclass
class ChatRequest:
    prompt: str
    model: str
    system_prompt: Optional[str] = None
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.95

    @classmethod
    def from_json(cls, data):
        return cls(
            prompt=data.get("prompt"),
            model=data.get("model"),
            system_prompt=data.get("system_prompt"),
            temperature=data.get("temperature", 0.7),
            top_p=data.get("top_p", 0.95),
        )
