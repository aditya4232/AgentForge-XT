from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import agents, runs, metrics
from app.db import engine, Base
from contextlib import asynccontextmanager

# Simple lifecycle manager to create tables (for dev)
# In prod, rely on Alembic
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="AgentForge-XT API", version="1.0.0", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(agents.router, prefix="/api/v1/agents", tags=["agents"])
app.include_router(runs.router, prefix="/api/v1/runs", tags=["runs"])
app.include_router(metrics.router, tags=["metrics"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
