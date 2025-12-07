"""
Ollama Client
Talks to a local Ollama instance for LLM inference.
"""
import httpx
import os

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")


class OllamaClient:
    """
    Simple async client for Ollama's generate API.
    
    Usage:
        client = OllamaClient(model="llama3.2")
        response = await client.generate("What is 2+2?")
    """
    
    def __init__(self, model: str = "llama3.2"):
        self.model = model
        self.base_url = f"{OLLAMA_BASE_URL}/api/generate"
    
    async def generate(self, prompt: str, system_prompt: str = None) -> str:
        """
        Generate a response from the LLM.
        
        Args:
            prompt: The user's input
            system_prompt: Optional system instructions
            
        Returns:
            The LLM's response text, or an error message if something went wrong
        """
        full_prompt = prompt
        if system_prompt:
            full_prompt = f"System: {system_prompt}\nUser: {prompt}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.base_url,
                    json={
                        "model": self.model,
                        "prompt": full_prompt,
                        "stream": False
                    },
                    timeout=120.0  # LLMs can be slow, especially on CPU
                )
                response.raise_for_status()
                data = response.json()
                return data.get("response", "")
                
            except httpx.TimeoutException:
                return "Error: LLM request timed out. Try a shorter prompt or faster model."
            except httpx.HTTPStatusError as e:
                return f"Error: Ollama returned {e.response.status_code}. Is the model pulled?"
            except Exception as e:
                return f"Error calling LLM: {e}"
