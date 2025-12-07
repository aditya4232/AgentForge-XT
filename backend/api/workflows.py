from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
from services.db import db
from auth import get_current_user  # You'd need a simple dependency here

router = APIRouter()

class WorkflowCreate(BaseModel):
    name: str
    description: str = None
    graph_data: dict = {}
    config: dict = {}

@router.get("/", response_model=List[dict])
async def get_workflows(user_id: str = "demo-user"):
    """Get all workflows for the current user"""
    # In a real app, user_id comes from auth dependency
    return db.get_user_workflows(user_id)

@router.post("/", response_model=dict)
async def create_workflow(workflow: WorkflowCreate, user_id: str = "demo-user"):
    """Create a new workflow"""
    return db.create_workflow(user_id, workflow.model_dump())

@router.get("/{workflow_id}", response_model=dict)
async def get_workflow(workflow_id: str):
    """Get a specific workflow"""
    wf = db.get_workflow(workflow_id)
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return wf
