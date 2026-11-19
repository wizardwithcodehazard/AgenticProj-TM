from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "Pulse Telecom Loyalty AI"
    DATABASE_URL: str = "sqlite:///./telecom_loyalty.db"
    
    # Local llama.cpp / OpenAI-compatible endpoint
    LOCAL_LLM_URL: str = "http://127.0.0.1:9931/v1"
    LOCAL_LLM_MODEL: str = "openai/Qwen/Qwen2.5-3B-Instruct-GGUF:Q4_K_M"
    USE_LOCAL_LLM: bool = True

    # Cloud LLM Settings (optional fallbacks)
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL_NAME: str = "gpt-4o-mini"
    GEMINI_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
