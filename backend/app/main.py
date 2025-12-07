"""
AgentForge-XT Backend
v0.5 Beta

Main FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api import agents, runs, metrics
from app.db import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handle startup/shutdown.
    Creates DB tables on startup (dev mode only - use Alembic in prod).
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="AgentForge-XT",
    description="API for designing, running, and monitoring AI agents",
    version="0.5.0-beta",
    lifespan=lifespan
)

# Allow frontend to talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wire up the routes
app.include_router(agents.router, prefix="/api/v1/agents", tags=["Agents"])
app.include_router(runs.router, prefix="/api/v1/runs", tags=["Runs"])
app.include_router(metrics.router, tags=["Metrics"])


@app.get("/health", tags=["Health"])
def health_check():
    """Simple health check - returns ok if the server's alive."""
    return {"status": "ok"}
