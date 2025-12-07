# AgentForge-XT

> **Aditya Shenvi © 2025-26**

**Tagline:** A cloud-native playground for designing, deploying, and monitoring multi-agent AI systems.

![AgentForge Architecture](https://placehold.co/800x400?text=AgentForge+Architecture)

---

## 👋 Welcome to AgentForge-XT

Hi there! Welcome to **AgentForge-XT**. If you've ever wanted to build complex multi-agent AI systems without getting lost in spaghetti code or managing a dozen different services manually, you're in the right place.

We built AgentForge to be a **robust, production-ready platform** that feels great to use. Whether you're running it on your laptop to experiment with local LLMs (like Llama 3) or deploying it to a Kubernetes cluster for scale, everything is designed to be rigorous yet accessible.

### 🚀 What features do we have?

-   **Visual Agent Builder**: Use our drag-and-drop Canvas to map out how your agents think. Connect inputs to LLMs, tools, and decision nodes visually.
-   **Robust Runtime**: We use **LangGraph** under the hood combined with **Celery** workers. This means your agents run asynchronously and robustly.
-   **Observability**: We've baked in **Prometheus, Grafana, and MLflow**. You can see exactly how long each step takes, what the LLM output was, and track performance over time.
-   **AI Integration**: Native support for **Ollama** (local LLMs) so you don't need expensive API keys to start testing.

---

## 📚 Documentation

We have detailed documentation available in the `docs/` folder:

-   [**Architecture**](docs/ARCHITECTURE.md): Deep dive into the system design, components, and data flow.
-   [**Deployment Guide**](docs/DEPLOYMENT.md): Instructions for Local, Docker, and Kubernetes deployments.
-   [**API Reference**](docs/API.md): Guide to the backend REST API endpoints.
-   [**Performance Report**](docs/performance_report.md): Latest automated benchmark results.

---

## 🛠️ Quick Start

Want to see it in action? Let's get you set up in minutes.

### 1. Installation

We've provided a helper script to get you started quickly on Windows:

```cmd
scripts\install.bat
```

Or manually:
1. `cd backend && python -m venv venv && pip install -r requirements.txt`
2. `cd frontend && npm install`

### 2. Running Local Dev

The entire stack can be launched with Docker Compose:

```bash
docker-compose up --build
```

*Grab a coffee ☕. The first build installs everything.*

### 3. Verification

To run our automated test suite and benchmarks:

```cmd
scripts\run_tests.bat
```

---

## 🔗 Stack Links

Once running, access the services here:

-   **Frontend UI**: [http://localhost:3000](http://localhost:3000)
-   **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs)
-   **Grafana**: [http://localhost:3001](http://localhost:3001)
-   **MLflow**: [http://localhost:5000](http://localhost:5000)

---

**Aditya Shenvi © 2025-26**
*MIT License*
