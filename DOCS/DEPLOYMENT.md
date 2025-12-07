# Deployment Guide

> Getting AgentForge-XT running — from laptop to cloud

---

## Option 1: Docker Compose (Easiest)

This spins up everything locally. Perfect for development and demos.

```bash
docker-compose up --build
```

First run downloads a bunch of images, so give it 5-10 minutes. After that, you're good:

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:3000 | The main UI |
| Backend | http://localhost:8000/docs | Swagger API docs |
| Grafana | http://localhost:3001 | Login: admin/admin |
| MLflow | http://localhost:5000 | Experiment tracking |
| Prometheus | http://localhost:9090 | Raw metrics |

To stop everything: `docker-compose down`

To nuke volumes and start fresh: `docker-compose down -v`

---

## Option 2: Local Dev (No Docker)

Sometimes you want to iterate faster without rebuilding containers.

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install deps
pip install -r requirements.txt

# Run with hot reload
uvicorn app.main:app --reload --port 8000
```

You'll need PostgreSQL and Redis running separately. Either use Docker for just those:

```bash
docker run -d -p 5432:5432 -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=agentforge postgres:15
docker run -d -p 6379:6379 redis:7
```

Or install them locally (I'm not gonna tell you how, there are a million guides).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:3000. Edit `.env.local` if your backend is somewhere else:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Option 3: Kubernetes (Production)

For real deployments. I've included Helm charts that work.

### Prerequisites

- A K8s cluster (EKS, GKE, AKS, or even Minikube)
- `kubectl` pointed at your cluster
- `helm` v3+

### Deploy

```bash
# Check the chart is valid
helm lint helm/agentforge

# Install it
helm upgrade --install agentforge helm/agentforge \
  --namespace agentforge \
  --create-namespace \
  --set postgres.password=changethispassword

# Check pods are running
kubectl get pods -n agentforge
```

### Customize

Edit `helm/agentforge/values.yaml` or pass `--set` flags:

```yaml
backend:
  replicas: 2
  image: your-registry/agentforge-backend:v0.5

frontend:
  replicas: 2

postgres:
  password: actuallysecurepassword
```

### Ingress

The charts don't include ingress by default. You'll want to add that for real domains. Something like:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: agentforge-ingress
spec:
  rules:
  - host: agentforge.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: agentforge-frontend
            port:
              number: 3000
```

---

## Option 4: Terraform (Cloud Infra)

If you need to provision a cluster, there's a basic AWS setup in `terraform/`.

```bash
cd terraform

# First time setup
terraform init

# See what it'll create
terraform plan

# Actually create it
terraform apply
```

Heads up: this creates real AWS resources that cost money. The config is minimal — you'll probably want to customize VPC, node sizes, etc.

---

## Environment Variables

The backend reads these (defaults shown):

```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/agentforge
REDIS_URL=redis://localhost:6379/0
OLLAMA_BASE_URL=http://localhost:11434
MLFLOW_TRACKING_URI=http://localhost:5000
```

In Docker Compose, these are set automatically. For local dev, create a `.env` file in the backend folder.

---

## Troubleshooting

**Container won't start**  
Check logs: `docker-compose logs backend`

**Database connection refused**  
Is PostgreSQL actually running? `docker ps` to check.

**Ollama not responding**  
You need to pull a model first: `ollama pull llama2`

**Frontend shows "Failed to fetch"**  
CORS issue or backend not running. Check `NEXT_PUBLIC_API_URL`.

**Tests failing**  
Make sure you're in the venv: `venv\Scripts\activate`

---

## What I'd Do for Production

1. Put it behind a real load balancer with SSL
2. Use managed PostgreSQL (RDS, Cloud SQL, etc.)
3. Set up proper secrets management (Vault, AWS Secrets Manager)
4. Configure Grafana alerts for error rates
5. Actually implement auth (coming in v0.6, I promise)
