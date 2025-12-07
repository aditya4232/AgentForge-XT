"""
LangGraph Engine
Compiles JSON graph definitions into executable LangGraph state machines.

This is the core of AgentForge-XT's execution model. It takes the visual
graph from the frontend and turns it into something that actually runs.
"""
from typing import Dict, Any, TypedDict, Annotated
import operator
from langgraph.graph import StateGraph, END
from app.services.ollama_client import OllamaClient
from app.services.tool_executor import ToolExecutor


class AgentState(TypedDict):
    """
    State that flows through the agent graph.
    LangGraph uses this to track what's happening at each step.
    """
    input: str
    intermediate_steps: Annotated[list, operator.add]  # Accumulates across nodes
    output: str


class LangGraphEngine:
    """
    Takes a JSON graph (from the visual builder) and compiles it 
    into a runnable LangGraph workflow.
    
    Example:
        engine = LangGraphEngine(graph_json)
        app = engine.build()
        result = await app.ainvoke({"input": "hello", "intermediate_steps": []})
    """
    
    def __init__(self, graph_json: Dict[str, Any]):
        self.graph_json = graph_json
        self.nodes = graph_json.get("nodes", [])
        self.edges = graph_json.get("edges", [])
        self.ollama = OllamaClient()
        self.tools = ToolExecutor()
    
    def build(self):
        """
        Build the LangGraph state machine from the JSON definition.
        Returns a compiled workflow that can be invoked.
        """
        workflow = StateGraph(AgentState)
        
        # Add each node from the JSON
        for node in self.nodes:
            node_id = node["id"]
            
            # Important: capture node in closure with default arg
            async def _node_fn(state: AgentState, _node=node):
                return await self.execute_node(_node, state)
            
            workflow.add_node(node_id, _node_fn)
        
        # Wire up the edges (React Flow format: {source, target})
        for edge in self.edges:
            workflow.add_edge(edge["source"], edge["target"])
        
        # Find the entry point (usually the "input" node)
        start_node = next(
            (n for n in self.nodes if n.get("type") == "input"),
            self.nodes[0] if self.nodes else None
        )
        if start_node:
            workflow.set_entry_point(start_node["id"])
        
        return workflow.compile()
    
    async def execute_node(self, node: Dict[str, Any], state: AgentState) -> Dict[str, Any]:
        """
        Execute a single node based on its type.
        Returns a partial state update.
        """
        node_type = node.get("type")
        data = node.get("data", {})
        node_id = node.get("id", "unknown")
        
        if node_type == "input":
            # Input nodes just pass through
            return {}
        
        elif node_type == "llm":
            # Call the LLM with a prompt template
            prompt_template = data.get("prompt", "Process this: {input}")
            user_input = state.get("input", "")
            prompt = prompt_template.replace("{input}", user_input)
            
            response = await self.ollama.generate(prompt)
            
            # Truncate for logging, keep full for output
            log_preview = response[:50] + "..." if len(response) > 50 else response
            return {
                "output": response,
                "intermediate_steps": [f"[{node_id}] LLM: {log_preview}"]
            }
        
        elif node_type == "tool":
            # Run a tool (code executor, web fetch, etc.)
            tool_name = data.get("toolName", "code_executor")
            input_val = state.get("output") or state.get("input")
            
            result = await self.tools.execute(tool_name, {
                "code": input_val,
                "url": input_val
            })
            
            return {
                "output": str(result),
                "intermediate_steps": [f"[{node_id}] Tool ({tool_name}): {result}"]
            }
        
        elif node_type == "output":
            # Output nodes don't modify state
            return {}
        
        else:
            # Unknown node type - log and continue
            return {
                "intermediate_steps": [f"[{node_id}] Unknown type: {node_type}"]
            }
