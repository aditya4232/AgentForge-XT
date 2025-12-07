from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from services.db import db
from core.security import encrypt_key, decrypt_key
from typing import Optional

router = APIRouter()

class UserSettings(BaseModel):
    groq_key: Optional[str] = None
    openai_key: Optional[str] = None
    model_preference: Optional[str] = "groq/llama3-70b-8192"

@router.get("/settings", response_model=UserSettings)
async def get_settings(user_id: str = "demo-user"):
    """Get user settings (keys are masked)"""
    # fetch from db
    data = db.get_user_settings(user_id)
    if not data:
        return UserSettings()
    
    # Return masked keys so frontend knows they exist but can't see them
    return UserSettings(
        groq_key="********" if data.get("groq_key") else None,
        openai_key="********" if data.get("openai_key") else None,
        model_preference=data.get("model_preference")
    )

@router.post("/settings")
async def update_settings(settings: UserSettings, user_id: str = "demo-user"):
    """Update user settings with encryption"""
    payload = {
        "model_preference": settings.model_preference
    }
    
    # Only update keys if provided (and not masked)
    if settings.groq_key and settings.groq_key != "********":
        payload["groq_key"] = encrypt_key(settings.groq_key)
    
    if settings.openai_key and settings.openai_key != "********":
        payload["openai_key"] = encrypt_key(settings.openai_key)
        
    db.upsert_user_settings(user_id, payload)
    return {"status": "success"}
