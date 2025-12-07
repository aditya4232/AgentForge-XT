"""
Search Tools
Enables agents to perform web research using DuckDuckGo (Free) and Serper (Optional)
"""

from langchain_community.tools import DuckDuckGoSearchRun
from langchain_community.utilities import GoogleSerperAPIWrapper
from typing import Optional
import os

class SearchTools:
    
    @staticmethod
    def duckduckgo_search(query: str) -> str:
        """
        Useful for searching the internet for information using DuckDuckGo.
        Completely free and requires no API key.
        """
        search = DuckDuckGoSearchRun()
        return search.run(query)

    @staticmethod
    def serper_search(query: str) -> str:
        """
        Useful for searching the internet using Google Search via Serper.dev.
        Requires SERPER_API_KEY environment variable.
        """
        api_key = os.getenv("SERPER_API_KEY")
        if not api_key:
            return "Error: SERPER_API_KEY not found. Please use DuckDuckGo search or add the key."
        
        search = GoogleSerperAPIWrapper(serper_api_key=api_key)
        return search.run(query)

    @staticmethod
    def get_search_tool():
        """Returns the best available search tool function"""
        # If Serper key exists, use it (better results), otherwise fallback to DuckDuckGo
        if os.getenv("SERPER_API_KEY"):
            return SearchTools.serper_search
        return SearchTools.duckduckgo_search

# Export a list of tools for CrewAI
def get_research_tools():
    tools = []
    # CrewAI expects tools to be decorated or wrapped, but we can pass callable functions
    # For now, we'll return a simple list of tool definitions/functions
    # In a real CrewAI setup, we'd wrap these as LangChain tools or CrewAI native tools
    
    # Returning DuckDuckGo as a default accessible tool
    return [DuckDuckGoSearchRun()]
