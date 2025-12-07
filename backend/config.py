"""
AgentForge-XT Backend Configuration
Manages all environment variables and settings using Pydantic
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "AgentForge-XT"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "change-this-in-production-use-openssl-rand-hex-32"
    
    # Database (Supabase)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    DATABASE_URL: str = ""
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Qdrant Vector Database
    QDRANT_URL: str = "https://your-cluster.qdrant.io"
    QDRANT_API_KEY: str = ""
    
    # AI Providers (Free APIs)
    GROQ_API_KEY: str = ""
    TOGETHER_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = ""
    
    # Authentication (Clerk)
    CLERK_SECRET_KEY: str = ""
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # Agent Execution
    MAX_AGENT_EXECUTION_TIME: int = 300  # 5 minutes
    MAX_CONCURRENT_AGENTS: int = 10
    DEFAULT_LLM_MODEL: str = "llama-3.1-70b-versatile"  # Groq model
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    def get_cors_origins(self) -> list[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


# Global settings instance
settings = Settings()
