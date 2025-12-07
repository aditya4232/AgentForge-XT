/**
 * API Client
 * Centralized API communication with the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class APIClient {
    private baseURL: string

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }))
            throw new Error(error.message || 'API request failed')
        }

        return response.json()
    }

    // Agents
    async getAgents() {
        return this.request('/api/v1/agents')
    }

    async createAgent(data: any) {
        return this.request('/api/v1/agents', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    async getAgent(id: string) {
        return this.request(`/api/v1/agents/${id}`)
    }

    async updateAgent(id: string, data: any) {
        return this.request(`/api/v1/agents/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    }

    async deleteAgent(id: string) {
        return this.request(`/api/v1/agents/${id}`, {
            method: 'DELETE',
        })
    }

    // Workflows
    async getWorkflows() {
        return this.request('/api/v1/workflows')
    }

    async createWorkflow(data: any) {
        return this.request('/api/v1/workflows', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    async getWorkflow(id: string) {
        return this.request(`/api/v1/workflows/${id}`)
    }

    async updateWorkflow(id: string, data: any) {
        return this.request(`/api/v1/workflows/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    }

    async deleteWorkflow(id: string) {
        return this.request(`/api/v1/workflows/${id}`, {
            method: 'DELETE',
        })
    }

    // Executions
    async getExecutions(workflowId?: string) {
        const query = workflowId ? `?workflow_id=${workflowId}` : ''
        return this.request(`/api/v1/executions${query}`)
    }

    async createExecution(data: any) {
        return this.request('/api/v1/executions', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    async getExecution(id: string) {
        return this.request(`/api/v1/executions/${id}`)
    }

    async cancelExecution(id: string) {
        return this.request(`/api/v1/executions/${id}/cancel`, {
            method: 'POST',
        })
    }

    // Templates
    async getTemplates(category?: string) {
        const query = category ? `?category=${category}` : ''
        return this.request(`/api/v1/templates${query}`)
    }

    async getTemplate(id: string) {
        return this.request(`/api/v1/templates/${id}`)
    }

    async cloneTemplate(id: string) {
        return this.request(`/api/v1/templates/${id}/clone`, {
            method: 'POST',
        })
    }
}

export const apiClient = new APIClient(API_URL)
