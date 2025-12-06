from app.workers.celery_app import celery_app
from app.services.langgraph_engine import LangGraphEngine
from app.db import AsyncSessionLocal
from app.models.models import Run
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
import asyncio
import mlflow
import os
import datetime

MLFLOW_TRACKING_URI = os.getenv("MLFLOW_TRACKING_URI", "http://mlflow:5000")
mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)

async def run_agent_async(run_id: str, agent_graph: dict, input_data: dict):
    # Setup MLflow
    mlflow.set_experiment("agent_runs")
    
    async with AsyncSessionLocal() as db:
        run_record = None
        try:
            with mlflow.start_run(run_name=f"run_{run_id}") as mlrun:
                # Update status to running
                await db.execute(
                    update(Run).where(Run.id == run_id).values(status="running")
                )
                await db.commit()
                
                # Build Engine
                engine = LangGraphEngine(agent_graph)
                app = engine.build()
                
                # Execute
                user_input = input_data.get("input", "")
                result = await app.ainvoke({"input": user_input, "intermediate_steps": []})
                
                # Parse output
                output_data = {"result": result.get("output", ""), "state": str(result)}
                
                # Log to MLflow
                mlflow.log_param("input", user_input)
                mlflow.log_param("status", "completed")
                mlflow.log_dict(output_data, "output.json")
                
                # Update DB
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
            print(f"Error executing agent: {e}")
            await db.execute(
                update(Run).where(Run.id == run_id).values(
                    status="failed",
                    logs=[str(e)],
                    completed_at=datetime.datetime.now(datetime.timezone.utc)
                )
            )
            await db.commit()


@celery_app.task(name="app.workers.execute_agent.execute_agent_task")
def execute_agent_task(run_id, agent_graph, input_data):
    # Bridge sync Celery to key pieces of async code
    loop = asyncio.get_event_loop()
    if loop.is_closed():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    loop.run_until_complete(run_agent_async(run_id, agent_graph, input_data))
    return f"Run {run_id} finished"
