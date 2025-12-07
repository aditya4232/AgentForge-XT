from typing import Dict, Any, TypedDict, Annotated
import operator
from langgraph.graph import StateGraph, END
from app.services.ollama_client import OllamaClient
from app.services.tool_executor import ToolExecutor

# Define Agent State
class AgentState(TypedDict):
    input: str
    intermediate_steps: Annotated[list, operator.add]
    output: str

class LangGraphEngine:
    def __init__(self, graph_json: Dict[str, Any]):
        self.graph_json = graph_json
        self.nodes = graph_json.get("nodes", [])
        self.edges = graph_json.get("edges", [])
        self.ollama = OllamaClient()
        self.tools = ToolExecutor()
        
    def build(self):
        workflow = StateGraph(AgentState)
        
        # Build nodes
        for node in self.nodes:
            node_id = node["id"]
            node_type = node.get("type", "default")
            
            # Create a lambda or function for the node logic
            # This captures the node config in the closure
            async def _node_fn(state: AgentState, _node=node):
                return await self.execute_node(_node, state)
                
            workflow.add_node(node_id, _node_fn)

        # Build edges
        # Assume React Flow structure: { source: '1', target: '2', ... }
        for edge in self.edges:
            workflow.add_edge(edge["source"], edge["target"])

        # Set Entry Point (find node without incoming edges or marked as Start)
        # Simplified: Assume first node or explicit 'start' node type
        start_node = next((n for n in self.nodes if n.get("type") == "input"), self.nodes[0] if self.nodes else None)
        if start_node:
            workflow.set_entry_point(start_node["id"])
            
        return workflow.compile()

    async def execute_node(self, node: Dict[str, Any], state: AgentState) -> Dict[str, Any]:
        node_type = node.get("type")
        data = node.get("data", {})
        
        print(f"Executing Node: {node['id']} ({node_type})")
        
        if node_type == "input":
            # Just pass input to next
            return {} 
            
        elif node_type == "llm":
            prompt_template = data.get("prompt", "Analyze this: {input}")
            user_input = state.get("input", "")
            # Simple prompt filling
            prompt = prompt_template.replace("{input}", user_input)
            
            response = await self.ollama.generate(prompt)
            return {"output": response, "intermediate_steps": [f"LLM: {response[:20]}..."]}
            
        elif node_type == "tool":
            tool_name = data.get("toolName", "code_executor")
            # For simplicity, pass state.output or input as param
            input_val = state.get("output") or state.get("input")
            params = {"code": input_val, "url": input_val} 
            
            result = await self.tools.execute(tool_name, params)
            return {"output": str(result), "intermediate_steps": [f"Tool: {result}"]}
            
        elif node_type == "output":
            return {} # Final state usually just holds value
            
        return {"output": "Unknown Node Type"}

# Usage:
# engine = LangGraphEngine(json_graph)
# app = engine.build()
# result = await app.ainvoke({"input": "..."})
