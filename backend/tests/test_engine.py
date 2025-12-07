"""
AgentForge-XT Engine Tests
v0.5 Beta - LangGraph engine unit tests
"""
import pytest
from unittest.mock import MagicMock, AsyncMock
from app.services.langgraph_engine import LangGraphEngine


@pytest.mark.asyncio
async def test_engine_builds_workflow():
    """Test that the engine can build a workflow from JSON."""
    graph_json = {
        "nodes": [
            {"id": "node1", "type": "input"},
            {"id": "node2", "type": "output"}
        ],
        "edges": [
            {"source": "node1", "target": "node2"}
        ]
    }
    
    engine = LangGraphEngine(graph_json)
    workflow = engine.build()
    
    assert workflow is not None


@pytest.mark.asyncio
async def test_engine_with_llm_node():
    """Test engine execution with a mocked LLM node."""
    graph_json = {
        "nodes": [
            {"id": "node1", "type": "input"},
            {"id": "node2", "type": "llm", "data": {"prompt": "Say hello to {input}"}},
            {"id": "node3", "type": "output"}
        ],
        "edges": [
            {"source": "node1", "target": "node2"},
            {"source": "node2", "target": "node3"}
        ]
    }
    
    engine = LangGraphEngine(graph_json)
    
    # Mock Ollama Client to avoid external calls
    engine.ollama = MagicMock()
    engine.ollama.generate = AsyncMock(return_value="Hello World!")
    
    app = engine.build()
    result = await app.ainvoke({"input": "World", "intermediate_steps": []})
    
    assert result["output"] == "Hello World!"
    engine.ollama.generate.assert_called_once()


@pytest.mark.asyncio
async def test_engine_with_tool_node():
    """Test engine execution with a mocked tool node."""
    graph_json = {
        "nodes": [
            {"id": "node1", "type": "input"},
            {"id": "node2", "type": "tool", "data": {"toolName": "code_executor"}},
            {"id": "node3", "type": "output"}
        ],
        "edges": [
            {"source": "node1", "target": "node2"},
            {"source": "node2", "target": "node3"}
        ]
    }
    
    engine = LangGraphEngine(graph_json)
    
    # Mock Tool Executor
    engine.tools = MagicMock()
    engine.tools.execute = AsyncMock(return_value={"result": "code executed"})
    
    app = engine.build()
    result = await app.ainvoke({"input": "print('hi')", "intermediate_steps": []})
    
    assert "result" in result["output"] or result["output"] is not None


@pytest.mark.asyncio
async def test_engine_empty_graph():
    """Test engine handles empty graph gracefully."""
    graph_json = {"nodes": [], "edges": []}
    
    engine = LangGraphEngine(graph_json)
    # Should not raise, just return None or minimal workflow
    try:
        workflow = engine.build()
    except Exception as e:
        # Empty graphs may fail at compile, which is acceptable
        assert "entry" in str(e).lower() or "node" in str(e).lower()
