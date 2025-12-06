import httpx

class ToolExecutor:
    async def execute(self, tool_name: str, params: dict) -> dict:
        if tool_name == "api_caller":
            return await self._api_caller(params)
        elif tool_name == "code_executor":
            return self._code_executor(params)
        else:
            return {"error": f"Tool {tool_name} not found"}

    async def _api_caller(self, params: dict):
        url = params.get("url")
        method = params.get("method", "GET")
        if not url:
            return {"error": "Missing URL"}
        
        async with httpx.AsyncClient() as client:
            try:
                if method == "GET":
                    resp = await client.get(url)
                else:
                    resp = await client.post(url, json=params.get("body"))
                return {"status": resp.status_code, "data": resp.text[:1000]} # Truncate for safety
            except Exception as e:
                return {"error": str(e)}

    def _code_executor(self, params: dict):
        code = params.get("code")
        # SECURITY WARNING: Executing arbitrary code.
        # For MVP/Demo only. 
        # In real prod, this needs a sandbox (e.g., separate docker container).
        try:
            # Stub execution
            return {"output": "Code execution stub. Echo: " + str(code)[:50]}
        except Exception as e:
            return {"error": str(e)}
