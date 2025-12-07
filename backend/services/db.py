"""
Supabase Database Service
Handles all database interactions
"""

from supabase import create_client, Client
from config import settings
from typing import Dict, Any, List, Optional
import uuid

class DatabaseService:
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_KEY
        self.supabase: Optional[Client] = None
        
        if self.url and self.key and "http" in self.url:
            try:
                self.supabase = create_client(self.url, self.key)
            except Exception as e:
                print(f"Warning: Failed to initialize Supabase client: {e}")
        else:
            print("Warning: Supabase credentials not found or invalid. Database features will be disabled.")

    def create_workflow(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a new workflow"""
        if not self.supabase: return {}
        
        payload = {
            "user_id": user_id,
            "name": data.get("name"),
            "description": data.get("description"),
            "graph_data": data.get("graph_data", {}),
            "config": data.get("config", {})
        }
        
        response = self.supabase.table("workflows").insert(payload).execute()
        return response.data[0] if response.data else {}

    def get_user_workflows(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all workflows for a user"""
        if not self.supabase: return []
        
        response = self.supabase.table("workflows").select("*").eq("user_id", user_id).execute()
        return response.data

    def get_workflow(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific workflow"""
        if not self.supabase: return None
        
        response = self.supabase.table("workflows").select("*").eq("id", workflow_id).execute()
        return response.data[0] if response.data else None

    def create_execution(self, workflow_id: str, user_id: str, input_data: Dict[str, Any]) -> str:
        """Create a new execution record"""
        if not self.supabase: return str(uuid.uuid4())
        
        payload = {
            "workflow_id": workflow_id,
            "user_id": user_id,
            "status": "pending",
            "input_data": input_data
        }
        
        response = self.supabase.table("executions").insert(payload).execute()
        return response.data[0]["id"] if response.data else str(uuid.uuid4())

    def update_execution_status(self, execution_id: str, status: str, result: Dict[str, Any] = None, error: str = None):
        """Update execution status"""
        if not self.supabase: return
        
        payload = {"status": status}
        if result:
            payload["result_data"] = result
            payload["completed_at"] = "now()"
        if error:
            payload["error_message"] = error
            
        self.supabase.table("executions").update(payload).eq("id", execution_id).execute()

    def get_user_settings(self, user_id: str) -> Dict[str, Any]:
        """Get user settings"""
        if not self.supabase: return {}
        response = self.supabase.table("user_settings").select("*").eq("user_id", user_id).execute()
        return response.data[0] if response.data else {}

    def upsert_user_settings(self, user_id: str, data: Dict[str, Any]):
        """Update or insert user settings"""
        if not self.supabase: return
        data["user_id"] = user_id
        # Supabase upsert
        self.supabase.table("user_settings").upsert(data).execute()

# Global DB instance
db = DatabaseService()
