from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_db
from app.models.models import Agent, Run
from app.schemas.schemas import AgentCreate, AgentResponse, AgentUpdate, RunCreate, RunResponse
from app.workers.celery_app import celery_app
import uuid

router = APIRouter()

@router.post("/", response_model=AgentResponse)
async def create_agent(agent: AgentCreate, db: AsyncSession = Depends(get_db)):
    new_agent = Agent(
        name=agent.name,
        description=agent.description,
        graph=agent.graph
    )
    db.add(new_agent)
    await db.commit()
    await db.refresh(new_agent)
    return new_agent

@router.get("/", response_model=list[AgentResponse])
async def list_agents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent))
    agents = result.scalars().all()
    return agents

@router.get("/{id}", response_model=AgentResponse)
async def get_agent(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.id == id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.patch("/{id}", response_model=AgentResponse)
async def update_agent(id: str, agent_update: AgentUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.id == id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    if agent_update.name:
        agent.name = agent_update.name
    if agent_update.description:
        agent.description = agent_update.description
    if agent_update.graph:
        agent.graph = agent_update.graph
        
    await db.commit()
    await db.refresh(agent)
    return agent

@router.post("/{id}/run", response_model=RunResponse)
async def run_agent(id: str, run_input: RunCreate, db: AsyncSession = Depends(get_db)):
    # Verify agent exists
    result = await db.execute(select(Agent).where(Agent.id == id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    new_run = Run(
        id=str(uuid.uuid4()),
        agent_id=id,
        status="pending",
        input_data=run_input.input_data
    )
    db.add(new_run)
    await db.commit()
    await db.refresh(new_run)

    # Trigger Celery Task
    # Note: Import loop avoidance - string reference often used but here we import task
    from app.workers.execute_agent import execute_agent_task
    execute_agent_task.delay(run_id=new_run.id, agent_graph=agent.graph, input_data=run_input.input_data)

    return new_run
