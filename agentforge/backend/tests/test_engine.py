import pytest
from app.services.langgraph_engine import LangGraphEngine
from unittest.mock import MagicMock, AsyncMock

@pytest.mark.asyncio
async def test_engine_compilation_and_execution():
    # Define a simple linear graph
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
    
    # Mock Ollama Client
    engine.ollama = MagicMock()
    engine.ollama.generate = AsyncMock(return_value="Hello World")
    
    app = engine.build()
    
    # Test Invocation
    result = await app.ainvoke({"input": "World", "intermediate_steps": []})
    
    # Assertions
    # In LangGraph StateGraph, the output state merges updates
    # Our nodes currently return partial update dicts
    # input node returns {} -> state unchanged
    # llm node returns {output: ...} -> state updated
    
    assert result["output"] == "Hello World"
    engine.ollama.generate.assert_called_once()
