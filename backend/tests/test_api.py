"""
AgentForge-XT API Tests
v0.5 Beta - Async API endpoint tests
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
import logging

# Disable heavy logging during tests
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


@pytest.mark.asyncio
async def test_health_check(override_get_db):
    """Test the health endpoint returns OK."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_create_agent(override_get_db):
    """Test creating a new agent via API."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        graph_payload = {
            "nodes": [
                {"id": "1", "type": "input"},
                {"id": "2", "type": "llm", "data": {"prompt": "Hello {input}"}},
                {"id": "3", "type": "output"}
            ],
            "edges": [
                {"source": "1", "target": "2"},
                {"source": "2", "target": "3"}
            ]
        }
        response = await ac.post("/api/v1/agents/", json={
            "name": "Test Agent",
            "description": "A unit test agent",
            "graph": graph_payload
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Agent"
        assert "id" in data


@pytest.mark.asyncio
async def test_get_agent(override_get_db):
    """Test retrieving an agent by ID."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # First create an agent
        create_resp = await ac.post("/api/v1/agents/", json={
            "name": "Fetch Agent",
            "graph": {"nodes": [], "edges": []}
        })
        agent_id = create_resp.json()["id"]
        
        # Then fetch it
        get_resp = await ac.get(f"/api/v1/agents/{agent_id}")
        assert get_resp.status_code == 200
        assert get_resp.json()["id"] == agent_id
        assert get_resp.json()["name"] == "Fetch Agent"


@pytest.mark.asyncio
async def test_list_agents(override_get_db):
    """Test listing all agents."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Create a couple of agents
        await ac.post("/api/v1/agents/", json={"name": "Agent 1", "graph": {}})
        await ac.post("/api/v1/agents/", json={"name": "Agent 2", "graph": {}})
        
        # List all agents
        response = await ac.get("/api/v1/agents/")
        assert response.status_code == 200
        agents = response.json()
        assert len(agents) >= 2


@pytest.mark.asyncio
async def test_run_agent(override_get_db):
    """Test triggering an agent run (mocked Celery)."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Create agent first
        create_resp = await ac.post("/api/v1/agents/", json={
            "name": "Runner Agent",
            "graph": {"nodes": [{"id": "1", "type": "input"}], "edges": []}
        })
        agent_id = create_resp.json()["id"]
        
        # Mock Celery task
        from app.workers.execute_agent import execute_agent_task
        original_delay = execute_agent_task.delay
        
        class MockTask:
            id = "mock-task-id"
        
        try:
            execute_agent_task.delay = lambda *args, **kwargs: MockTask()
            
            run_resp = await ac.post(
                f"/api/v1/agents/{agent_id}/run",
                json={"input_data": {"input": "test"}}
            )
            assert run_resp.status_code == 200
            assert run_resp.json()["status"] == "pending"
        finally:
            execute_agent_task.delay = original_delay


@pytest.mark.asyncio
async def test_metrics_endpoint(override_get_db):
    """Test the Prometheus metrics endpoint."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/metrics")
        assert response.status_code == 200
        # Prometheus metrics are plain text
        assert "agentforge" in response.text.lower() or "http" in response.text.lower() or response.text != ""
