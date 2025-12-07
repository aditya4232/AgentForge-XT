from crewai import Agent, Task, Crew, Process
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from langchain_community.llms import HuggingFaceHub
from config import settings
from services.db import db
from core.security import decrypt_key
import os

class LLMProvider:
    @staticmethod
    def get_llm(user_id: str = "demo-user", model_name: str = None):
        """
        Get LLM instance based on user settings or fallback to system defaults.
        Prioritizes user's stored keys to save system quota.
        """
        # Fetch user settings
        user_settings = db.get_user_settings(user_id)
        
        # Determine model to use
        selected_model = model_name or user_settings.get("model_preference") or "groq/llama3-70b-8192"
        
        provider, model_id = selected_model.split("/", 1) if "/" in selected_model else ("groq", selected_model)

        # 1. Groq (Llama 3, Mixtral)
        if provider == "groq":
            api_key = None
            # Try user key first
            if user_settings.get("groq_key"):
                api_key = decrypt_key(user_settings.get("groq_key"))
            
            # Fallback to system key
            if not api_key:
                api_key = settings.GROQ_API_KEY
                
            if not api_key:
                raise ValueError("Groq API Key not found in user settings or system config")
                
            return ChatGroq(
                temperature=0,
                model_name=model_id,
                api_key=api_key
            )

        # 2. OpenAI (GPT-4)
        elif provider == "openai":
            api_key = None
            if user_settings.get("openai_key"):
                api_key = decrypt_key(user_settings.get("openai_key"))
                
            if not api_key:
                # Fallback only if configured in system (usually not for cost reasons)
                # But here we assume we might have a system key
                api_key = os.getenv("OPENAI_API_KEY") 
                
            if not api_key:
                raise ValueError("OpenAI API Key not found. Please add it in Settings.")
                
            return ChatOpenAI(
                model_name=model_id,
                api_key=api_key,
                temperature=0.7
            )

        # 3. Together AI (Fallback)
        elif provider == "together":
             return ChatOpenAI(
                base_url="https://api.together.xyz/v1",
                api_key=settings.TOGETHER_API_KEY,
                model=model_id
            )

        # Default fallback
        return ChatGroq(temperature=0, model_name="llama3-70b-8192", api_key=settings.GROQ_API_KEY)
