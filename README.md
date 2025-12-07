# AgentForge-XT

> Built by **Aditya Shenvi** | v0.5 Beta

So you want to build AI agents that actually work in production? Same. That's why I built AgentForge-XT.

It's a full-stack platform where you can visually design agent workflows, run them without your API hanging forever, and actually see what's happening under the hood. No more "it works on my machine" nonsense.

---

## Why I Built This

I got tired of:
- Writing spaghetti code to connect agents together
- Having my backend freeze while waiting for LLM responses  
- Not knowing why my agent decided to do something weird
- Paying for API calls just to test basic flows

So I made something that solves all of that.

---

## What You Get

**Visual Builder** — Drag nodes, connect edges, done. Your agent logic is a graph, not a mess of function calls.

**Async Everything** — Celery workers handle execution. Your API stays responsive. Users don't stare at spinners.

**Local LLMs** — Ollama integration out of the box. Test with Llama, Mistral, whatever. Zero API costs during dev.

**See What's Happening** — Prometheus metrics, Grafana dashboards, MLflow traces. When something breaks, you'll know why.

**Actually Deploys** — Docker Compose for local, Helm charts for K8s, Terraform for infra. Not just a demo.

---

## Get It Running

You need Docker. That's basically it.

```bash
docker-compose up --build
```

First build takes a few minutes (grab coffee ☕). Then hit these URLs:

- **UI**: http://localhost:3000  
- **API Docs**: http://localhost:8000/docs  
- **Grafana**: http://localhost:3001 (admin/admin)
- **MLflow**: http://localhost:5000

---

## Project Layout

```
AgentForge-XT/
├── backend/          # FastAPI app + Celery workers
├── frontend/         # Next.js 15 interface
├── helm/             # K8s deployment charts
├── terraform/        # Cloud infra (AWS starter)
├── observability/    # Prometheus/Grafana configs
├── scripts/          # Utility scripts
├── DOCS/             # You're reading these
└── docker-compose.yml
```

---

## Run the Tests

Backend:
```bash
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
pytest tests/ -v
```

Frontend:
```bash
cd frontend
npm install && npm run build
```

---

## The Stack

I picked tools that actually work well together:

- **Backend**: FastAPI + SQLAlchemy + Celery + LangGraph
- **Frontend**: Next.js 15 + React Flow + Tailwind
- **AI**: Ollama for local, extensible to OpenAI/Anthropic
- **Infra**: Docker, K8s, Helm, Terraform
- **Monitoring**: Prometheus, Grafana, MLflow, OpenTelemetry

---

## Docs

| Doc | What's in it |
|-----|--------------|
| [Architecture](DOCS/ARCHITECTURE.md) | How the pieces fit together |
| [Deployment](DOCS/DEPLOYMENT.md) | Getting it running anywhere |
| [API Reference](DOCS/API.md) | Endpoint details |
| [Changelog](DOCS/CHANGELOG.md) | What changed when |

---

## What's Next

This is v0.5 Beta. It works, but there's more coming:
- Auth & multi-tenancy
- Agent versioning
- More tools (web scraping, SQL, etc.)
- Visual debugging right in the canvas

---

## License

MIT. Do what you want with it.

---

**Aditya Shenvi © 2025-26**
