# Deployment Guide

AgentForge-XT supports both local development and cloud-native deployment.

## 1. Local Development (Docker Compose)

The easiest way to run the full stack:

```bash
# In the root 'agentforge' directory
docker-compose up --build
```

**Services Started:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Ollama: `http://localhost:11434`
- MLflow: `http://localhost:5000`
- Grafana: `http://localhost:3001`

---

## 2. Kubernetes Deployment (Production)

We generally recommend a GitOps approach using ArgoCD, but you can also deploy manually using Helm.

### Prerequisites
- A Kubernetes Cluster (EKS, GKE, or local Minikube)
- `kubectl` configured
- `helm` installed

### Using Helm

1.  **Package/Lint the Chart**:
    ```bash
    helm lint helm/agentforge
    ```

2.  **Install/Upgrade**:
    ```bash
    helm upgrade --install agentforge helm/agentforge \
        --namespace agentforge --create-namespace \
        --set postgres.password=YOUR_SECURE_PASSWORD
    ```

3.  **Verify**:
    ```bash
    kubectl get pods -n agentforge
    ```

### Infrastructure as Code (Terraform)

If you need to provision the cluster itself (e.g., on AWS), navigate to `terraform/`:

1.  **Init**: `terraform init`
2.  **Plan**: `terraform plan`
3.  **Apply**: `terraform apply`

*Note: The provided Terraform config is a minimal coherent starter. You will need to configure your AWS credentials and potentially adjust region/vpc settings.*
