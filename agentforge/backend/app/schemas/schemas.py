from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class AgentBase(BaseModel):
    name: str
    description: Optional[str] = None
    graph: Dict[str, Any]

class AgentCreate(AgentBase):
    pass

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    graph: Optional[Dict[str, Any]] = None

class AgentResponse(AgentBase):
    id: str
    org_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class RunBase(BaseModel):
    input_data: Optional[Dict[str, Any]] = None

class RunCreate(RunBase):
    pass

class RunResponse(RunBase):
    id: str
    agent_id: str
    status: str
    output_data: Optional[Dict[str, Any]] = None
    logs: Optional[Any] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
