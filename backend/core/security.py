"""
Security Utils
Encryption and Rate Limiting
"""
from cryptography.fernet import Fernet
from config import settings
import base64
import os

# Ensure we have a valid key for encryption. 
# In prod, this should be static in .env. Here we generate one if missing (dev only).
def get_encryption_key():
    key = os.getenv("ENCRYPTION_KEY")
    if not key:
        # Fallback for dev - creates a new key every restart (data won't decrypt)
        # User MUST set ENCRYPTION_KEY in .env for persistence
        return Fernet.generate_key()
    return key.encode() if isinstance(key, str) else key

cipher = Fernet(get_encryption_key())

def encrypt_key(plain_text: str) -> str:
    if not plain_text: return None
    return cipher.encrypt(plain_text.encode()).decode()

def decrypt_key(cipher_text: str) -> str:
    if not cipher_text: return None
    try:
        return cipher.decrypt(cipher_text.encode()).decode()
    except:
        return None
