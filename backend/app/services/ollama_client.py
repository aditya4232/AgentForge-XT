import httpx
import os
import json

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://ollama:11434")

class OllamaClient:
    def __init__(self, model="llama3.2"):
        self.model = model
        self.base_url = f"{OLLAMA_BASE_URL}/api/generate"

    async def generate(self, prompt: str, system_prompt: str = None) -> str:
        # Simple client for now.
        # Fallback to 'llama2' or whatever is available if 3.2 is not found?
        # For MVP we assume model exists.
        full_prompt = prompt
        if system_prompt:
            full_prompt = f"System: {system_prompt}\nUser: {prompt}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.base_url, 
                    json={"model": self.model, "prompt": full_prompt, "stream": False},
                    timeout=60.0 # Increased timeout for CPU inference
                )
                response.raise_for_status()
                data = response.json()
                return data.get("response", "")
            except Exception as e:
                print(f"Ollama Error: {e}")
                return f"Error calling AI: {e}"
