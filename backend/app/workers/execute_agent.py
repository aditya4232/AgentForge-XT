"""
Agent Execution Worker
Runs agent workflows asynchronously via Celery.
"""
import asyncio
import datetime
import os

import mlflow
from sqlalchemy import update

from app.db import AsyncSessionLocal
from app.models.models import Run
from app.services.langgraph_engine import LangGraphEngine
from app.workers.celery_app import celery_app

# MLflow setup for experiment tracking
MLFLOW_TRACKING_URI = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000")
mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)


async def run_agent_async(run_id: str, agent_graph: dict, input_data: dict):
    """
    Actually execute an agent graph. This is the async core that does the work.
    
    Steps:
    1. Mark run as "running" in DB
    2. Build LangGraph from JSON definition
    3. Execute the graph with user input
    4. Save results and update status
    5. Log everything to MLflow
    """
    mlflow.set_experiment("agentforge_runs")
    
    async with AsyncSessionLocal() as db:
        try:
            with mlflow.start_run(run_name=f"run_{run_id[:8]}"):
                # Mark as running
                await db.execute(
                    update(Run).where(Run.id == run_id).values(status="running")
                )
                await db.commit()
                
                # Build the graph
                engine = LangGraphEngine(agent_graph)
                app = engine.build()
                
                # Run it
                user_input = input_data.get("input", "")
                result = await app.ainvoke({
                    "input": user_input,
                    "intermediate_steps": []
                })
                
                # Package the output
                output_data = {
                    "result": result.get("output", ""),
                    "steps": result.get("intermediate_steps", [])
                }
                
                # Log to MLflow for later analysis
                mlflow.log_param("input", user_input[:500])  # Truncate long inputs
                mlflow.log_param("status", "completed")
                mlflow.log_dict(output_data, "output.json")
                
                # Update DB with success
                await db.execute(
                    update(Run).where(Run.id == run_id).values(
                        status="completed",
                        output_data=output_data,
                        completed_at=datetime.datetime.now(datetime.timezone.utc),
                        logs=result.get("intermediate_steps", [])
                    )
                )
                await db.commit()
                
        except Exception as e:
            # Something went wrong - log it and mark as failed
            error_msg = str(e)
            print(f"Agent execution failed: {error_msg}")
            
            await db.execute(
                update(Run).where(Run.id == run_id).values(
                    status="failed",
                    logs=[f"Error: {error_msg}"],
                    completed_at=datetime.datetime.now(datetime.timezone.utc)
                )
            )
            await db.commit()


@celery_app.task(name="app.workers.execute_agent.execute_agent_task")
def execute_agent_task(run_id: str, agent_graph: dict, input_data: dict):
    """
    Celery task wrapper. Celery is sync, so we bridge to async here.
    """
    # Get or create event loop
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            raise RuntimeError("Loop closed")
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    # Run the async function
    loop.run_until_complete(run_agent_async(run_id, agent_graph, input_data))
    
    return f"Run {run_id} complete"
