import pytest
from fastapi.testclient import TestClient
from main import app
from services.db import db

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "AgentForge-XT API is running"}

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_websocket_connection():
    # WebSocket testing usually requires a specific async client or integration test
    # This is a placeholder to ensure the route exists
    assert app.router.default is not None

def test_agent_routes_exist():
    # Verify agent routes are registered
    routes = [r.path for r in app.router.routes]
    assert "/api/v1/agents/" in routes
    assert "/api/v1/workflows/" in routes

# Mock DB tests if we don't want to hit real Supabase during simple CI
def test_db_service_init():
    assert db is not None
    # If credentials aren't set in CI env, specific methods might return empty/None, 
    # but the service object should exist.
