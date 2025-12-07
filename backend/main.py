"""
AgentForge-XT Backend - Main Application Entry Point
FastAPI server with WebSocket support for real-time agent execution
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import sentry_sdk

from config import settings
from api import agents, workflows, executions, templates, settings as user_settings
from core.websocket import socket_app

# Initialize Sentry for error tracking
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        traces_sample_rate=1.0,
        environment=settings.ENVIRONMENT,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print(f"🚀 AgentForge-XT Backend starting in {settings.ENVIRONMENT} mode...")
    yield
    # Shutdown
    print("👋 AgentForge-XT Backend shutting down...")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Visual Multi-Agent Workflow Builder API",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(agents.router, prefix=f"{settings.API_V1_PREFIX}/agents", tags=["agents"])
app.include_router(workflows.router, prefix=f"{settings.API_V1_PREFIX}/workflows", tags=["workflows"])
app.include_router(executions.router, prefix=f"{settings.API_V1_PREFIX}/executions", tags=["executions"])
app.include_router(templates.router, prefix=f"{settings.API_V1_PREFIX}/templates", tags=["templates"])
app.include_router(user_settings.router, prefix=f"{settings.API_V1_PREFIX}/settings", tags=["settings"])

# Mount Socket.IO for WebSocket support
app.mount("/ws", socket_app)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.VERSION,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
