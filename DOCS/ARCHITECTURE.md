# How AgentForge-XT Works

> v0.5 Beta — The nerdy details

This doc explains how all the pieces connect. If you just want to use it, check the [Deployment Guide](DEPLOYMENT.md) instead.

---

## The Big Picture

AgentForge-XT is basically three things talking to each other:

1. **A UI** where you draw agent workflows
2. **An API** that stores those workflows and kicks off runs
3. **Workers** that actually execute the agents (call LLMs, run tools, etc.)

Everything else (databases, queues, monitoring) supports these three.

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   You       │ ──▶  │   Next.js   │ ──▶  │   FastAPI   │
│   (Browser) │      │   Frontend  │      │   Backend   │
└─────────────┘      └─────────────┘      └──────┬──────┘
                                                  │
                     ┌────────────────────────────┼────────────────────────────┐
                     │                            │                            │
                     ▼                            ▼                            ▼
              ┌─────────────┐             ┌─────────────┐             ┌─────────────┐
              │  PostgreSQL │             │    Redis    │             │   Celery    │
              │  (storage)  │             │   (queue)   │             │  (workers)  │
              └─────────────┘             └─────────────┘             └──────┬──────┘
                                                                              │
                                                                              ▼
                                                                       ┌─────────────┐
                                                                       │   Ollama    │
                                                                       │   (LLMs)    │
                                                                       └─────────────┘
```

---

## Component Breakdown

### Frontend (Next.js 15)

This is what you see in your browser. Built with:
- **React Flow** for the drag-and-drop canvas
- **TanStack Query** for data fetching (way better than raw fetch)
- **Tailwind** for styling

When you save an agent, it sends the graph as JSON to the backend. That's it — the frontend doesn't know anything about LLMs or execution.

### Backend (FastAPI)

The API server. Handles:
- CRUD for agents (create, read, update, delete)
- Triggering runs (puts a task in Redis)
- Serving metrics for Prometheus

It uses async SQLAlchemy, so database calls don't block. When you trigger a run, it immediately returns a run ID — actual execution happens in the workers.

### Workers (Celery + LangGraph)

This is where the magic happens. When a task shows up in Redis:

1. Worker pulls the agent definition from the database
2. Compiles it into a LangGraph state machine
3. Executes node by node (input → LLM → tool → output)
4. Updates the run status in the database
5. Logs everything to MLflow

The cool part: because it's Celery, you can scale horizontally. Need more throughput? Add more workers.

### LangGraph Engine

I wrote a compiler that takes the JSON graph from the canvas and turns it into a LangGraph `StateGraph`. Each node type maps to a function:

- `input` — Takes the initial user input
- `llm` — Calls Ollama with a prompt template
- `tool` — Runs a tool (code executor, web fetch, etc.)
- `output` — Returns the final result

The edges define execution order. No conditionals yet (coming in v0.6), but the foundation is there.

---

## Data Flow (Step by Step)

1. You drag nodes around in the canvas, connect them with edges
2. Click "Save" — frontend POSTs the graph JSON to `/api/v1/agents`
3. Backend validates with Pydantic, stores in PostgreSQL
4. You click "Run" with some input data
5. Backend creates a Run record (status: pending), pushes task to Redis
6. Immediately returns the run ID to the frontend
7. Celery worker picks up the task
8. Worker loads the agent, builds LangGraph, executes
9. Each step updates the Run record (status: running, logs: [...])
10. When done, sets status to completed (or failed)
11. Frontend polls `/api/v1/runs/{id}` to show progress

---

## Where Data Lives

| What | Where | Why |
|------|-------|-----|
| Agent definitions | PostgreSQL | Structured, queryable |
| Run history | PostgreSQL | Need to persist results |
| Task queue | Redis | Fast, ephemeral |
| LLM traces | MLflow | Specialized for ML experiments |
| Metrics | Prometheus | Time-series, alerting |

---

## Scaling Notes

Right now this is sized for local dev / small deployments. To scale:

- **More workers**: Just add Celery container replicas
- **Database**: Add PostgreSQL read replicas
- **LLMs**: Multiple Ollama instances, or swap to cloud APIs
- **Caching**: Redis can cache hot agent configs

The architecture supports it — I just haven't battle-tested at scale yet (that's what v1.0 is for).

---

## Security (TODO)

Being honest: auth isn't implemented yet. It's on the roadmap for v0.6:
- JWT tokens
- User-scoped agents
- API rate limiting
- Secrets management

For now, don't expose this to the internet. Local or VPN only.
