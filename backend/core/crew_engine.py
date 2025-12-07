"""
CrewAI Engine - Multi-Agent Orchestration
Manages agent creation, workflow execution, and collaboration
"""

from crewai import Agent, Task, Crew, Process
from typing import List, Dict, Any, Optional
from config import settings
from core.llm_provider import LLMProvider
import asyncio

class CrewAIEngine:
    """CrewAI orchestration engine"""
    
    def __init__(self):
        self.default_llm_model = settings.DEFAULT_LLM_MODEL
        
    async def execute_workflow(
        self,
        workflow_data: Dict[str, Any],
        user_id: str,
        execution_id: str
    ) -> Dict[str, Any]:
        """Execute a multi-agent workflow"""
        try:
            # Initialize LLM with User Context
            llm = LLMProvider.get_llm(user_id=user_id)
            
            # Create Agents
            agents = []
            agent_map = {}
            for agent_data in workflow_data.get("agents", []):
                agent = Agent(
                    role=agent_data["role"],
                    goal=agent_data["goal"],
                    backstory=agent_data["backstory"],
                    verbose=True,
                    allow_delegation=True,
                    llm=llm
                )
                agents.append(agent)
                agent_map[agent_data["id"]] = agent
            
            # Create Tasks
            tasks = []
            for task_data in workflow_data.get("tasks", []):
                task = Task(
                    description=task_data["description"],
                    agent=agent_map.get(task_data["agent_id"]),
                    expected_output=task_data.get("expected_output", "A detailed report"),
                )
                tasks.append(task)
            
            # Create Crew
            crew = Crew(
                agents=agents,
                tasks=tasks,
                verbose=True,
                process=Process.sequential
            )
            
            # Run crew in executor to avoid blocking
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, crew.kickoff)
            
            return {
                "status": "completed",
                "result": str(result),
                "error": None,
            }
        except Exception as e:
            print(f"Workflow Execution Error: {e}")
            return {
                "status": "failed",
                "result": None,
                "error": str(e),
            }


# Global engine instance
crew_engine = CrewAIEngine()
