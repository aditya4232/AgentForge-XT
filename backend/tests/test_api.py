import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
import logging

# Disable heavy logging during tests
logging.getLogger("httpx").setLevel(logging.WARNING)

@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@pytest.mark.asyncio
async def test_create_and_get_agent():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Create
        graph_payload = {
            "nodes": [{"id": "1", "type": "input"}, {"id": "2", "type": "output"}],
            "edges": [{"source": "1", "target": "2"}]
        }
        create_resp = await ac.post("/api/v1/agents/", json={
            "name": "Test Agent",
            "description": "A unit test agent",
            "graph": graph_payload
        })
        assert create_resp.status_code == 200
        data = create_resp.json()
        assert data["name"] == "Test Agent"
        agent_id = data["id"]
        
        # Get
        get_resp = await ac.get(f"/api/v1/agents/{agent_id}")
        assert get_resp.status_code == 200
        assert get_resp.json()["id"] == agent_id

@pytest.mark.asyncio
async def test_run_agent_flow():
    # This test might fail if Redis is not running or mock is needed.
    # For now, we mainly test the endpoint response, not the Celery execution.
    # To truly unit test without partial integration, we'd mock Celery.
    # But for "MVP readiness", testing the API contract is good.
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # First create agent
        graph_payload = {
            "nodes": [{"id": "1", "type": "input"}],
            "edges": []
        }
        create_resp = await ac.post("/api/v1/agents/", json={
            "name": "Runner Agent", 
            "graph": graph_payload
        })
        agent_id = create_resp.json()["id"]
        
        # Trigger Run
        # We need to mock the celery task delay to avoid needing redis
        from app.workers.execute_agent import execute_agent_task
        original_delay = execute_agent_task.delay
        
        try:
            class MockTask:
                id = "mock-task-id"
                
            execute_agent_task.delay = lambda *args, **kwargs: MockTask()
            
            run_resp = await ac.post(f"/api/v1/agents/{agent_id}/run", json={"input_data": {"input": "test"}})
            assert run_resp.status_code == 200
            assert run_resp.json()["status"] == "pending"
            
        finally:
            execute_agent_task.delay = original_delay
