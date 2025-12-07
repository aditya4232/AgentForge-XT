# API Reference

> AgentForge-XT v0.5 Beta

Base URL: `http://localhost:8000`

Interactive docs at `/docs` (Swagger) or `/redoc` (ReDoc).

---

## Quick Reference

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | `/health` | Is the server alive? |
| GET | `/metrics` | Prometheus metrics |
| GET | `/api/v1/agents/` | List all agents |
| POST | `/api/v1/agents/` | Create an agent |
| GET | `/api/v1/agents/{id}` | Get one agent |
| PATCH | `/api/v1/agents/{id}` | Update an agent |
| DELETE | `/api/v1/agents/{id}` | Delete an agent |
| POST | `/api/v1/agents/{id}/run` | Run an agent |
| GET | `/api/v1/runs/{id}` | Get run status |

---

## Endpoints

### Health Check

```
GET /health
```

Returns `{"status": "ok"}` if the server's up. That's it.

---

### Create Agent

```
POST /api/v1/agents/
Content-Type: application/json
```

Body:
```json
{
  "name": "My First Agent",
  "description": "Does something cool",
  "graph": {
    "nodes": [
      {"id": "1", "type": "input"},
      {"id": "2", "type": "llm", "data": {"prompt": "Summarize this: {input}"}},
      {"id": "3", "type": "output"}
    ],
    "edges": [
      {"source": "1", "target": "2"},
      {"source": "2", "target": "3"}
    ]
  }
}
```

Response (200):
```json
{
  "id": "abc123-uuid",
  "name": "My First Agent",
  "description": "Does something cool",
  "graph": {...},
  "created_at": "2025-12-07T...",
  "updated_at": "2025-12-07T..."
}
```

---

### List Agents

```
GET /api/v1/agents/
```

Returns an array of all agents. No pagination yet (TODO).

---

### Get Agent

```
GET /api/v1/agents/{agent_id}
```

Returns the agent with that ID, or 404 if it doesn't exist.

---

### Update Agent

```
PATCH /api/v1/agents/{agent_id}
Content-Type: application/json
```

Body (only include fields you want to change):
```json
{
  "name": "New Name",
  "graph": {...}
}
```

---

### Delete Agent

```
DELETE /api/v1/agents/{agent_id}
```

Returns 204 No Content. Gone forever.

---

### Run Agent

```
POST /api/v1/agents/{agent_id}/run
Content-Type: application/json
```

Body:
```json
{
  "input_data": {
    "input": "The text you want the agent to process"
  }
}
```

Response (200):
```json
{
  "id": "run-uuid-123",
  "agent_id": "abc123-uuid",
  "status": "pending",
  "input_data": {"input": "..."},
  "created_at": "2025-12-07T..."
}
```

The run starts immediately (async). Poll the status endpoint to track progress.

---

### Get Run Status

```
GET /api/v1/runs/{run_id}
```

Response:
```json
{
  "id": "run-uuid-123",
  "agent_id": "abc123-uuid",
  "status": "completed",
  "input_data": {"input": "..."},
  "output_data": {"result": "Here's the summary..."},
  "logs": [
    "Processing input...",
    "Calling LLM...",
    "Done"
  ],
  "created_at": "...",
  "completed_at": "..."
}
```

Status values:
- `pending` — In the queue, hasn't started
- `running` — Currently executing
- `completed` — Finished successfully
- `failed` — Something went wrong (check logs)

---

## Node Types

When building graphs, use these node types:

| Type | Purpose | Data fields |
|------|---------|-------------|
| `input` | Entry point | None |
| `llm` | Call an LLM | `prompt` — template with `{input}` placeholder |
| `tool` | Run a tool | `toolName` — e.g., "code_executor" |
| `output` | Final result | None |

More node types coming in future versions.

---

## Errors

Errors look like:
```json
{
  "detail": "Agent not found"
}
```

Status codes:
- 400 — Bad request (missing/invalid fields)
- 404 — Not found
- 422 — Validation error (Pydantic caught something)
- 500 — Server error (my fault, check logs)

---

## Tips

- The Swagger UI at `/docs` lets you test everything interactively
- For long-running agents, poll `/runs/{id}` every 2 seconds
- Graphs are stored as-is — make sure the frontend sends valid JSON
