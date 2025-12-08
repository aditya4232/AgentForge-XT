/**
 * n8n API Client
 * Integrates AgentForge-XT with n8n automation engine
 */

const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

export interface N8nWorkflow {
    id: string;
    name: string;
    active: boolean;
    nodes: N8nNode[];
    connections: Record<string, any>;
    settings?: Record<string, any>;
    staticData?: Record<string, any>;
}

export interface N8nNode {
    id: string;
    name: string;
    type: string;
    typeVersion: number;
    position: [number, number];
    parameters: Record<string, any>;
}

export interface N8nExecution {
    id: string;
    finished: boolean;
    mode: string;
    retryOf?: string;
    retrySuccessId?: string;
    startedAt: Date;
    stoppedAt?: Date;
    workflowId: string;
    workflowData?: N8nWorkflow;
}

export interface N8nExecutionData {
    resultData: {
        runData: Record<string, any>;
        error?: {
            message: string;
            stack?: string;
        };
    };
    executionData?: {
        contextData: Record<string, any>;
        nodeExecutionStack: any[];
        waitingExecution: Record<string, any>;
    };
}

class N8nClient {
    private baseUrl: string;
    private apiKey: string;
    private headers: HeadersInit;

    constructor() {
        this.baseUrl = N8N_BASE_URL;
        this.apiKey = N8N_API_KEY;
        this.headers = {
            'Content-Type': 'application/json',
            ...(this.apiKey && { 'X-N8N-API-KEY': this.apiKey }),
        };
    }

    /**
     * Check if n8n is configured and accessible
     */
    async isConfigured(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/healthz`, {
                method: 'GET',
            });
            return response.ok;
        } catch (error) {
            console.error('n8n health check failed:', error);
            return false;
        }
    }

    /**
     * Get all workflows from n8n
     */
    async getWorkflows(): Promise<N8nWorkflow[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
                method: 'GET',
                headers: this.headers,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch workflows: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching n8n workflows:', error);
            return [];
        }
    }

    /**
     * Get a specific workflow by ID
     */
    async getWorkflow(id: string): Promise<N8nWorkflow | null> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/workflows/${id}`, {
                method: 'GET',
                headers: this.headers,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch workflow: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching n8n workflow ${id}:`, error);
            return null;
        }
    }

    /**
     * Create a new workflow in n8n
     */
    async createWorkflow(workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow | null> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(workflow),
            });

            if (!response.ok) {
                throw new Error(`Failed to create workflow: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating n8n workflow:', error);
            return null;
        }
    }

    /**
     * Update an existing workflow in n8n
     */
    async updateWorkflow(id: string, workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow | null> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/workflows/${id}`, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify(workflow),
            });

            if (!response.ok) {
                throw new Error(`Failed to update workflow: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error updating n8n workflow ${id}:`, error);
            return null;
        }
    }

    /**
     * Delete a workflow from n8n
     */
    async deleteWorkflow(id: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/workflows/${id}`, {
                method: 'DELETE',
                headers: this.headers,
            });

            return response.ok;
        } catch (error) {
            console.error(`Error deleting n8n workflow ${id}:`, error);
            return false;
        }
    }

    /**
     * Activate/deactivate a workflow
     */
    async setWorkflowActive(id: string, active: boolean): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/workflows/${id}/${active ? 'activate' : 'deactivate'}`, {
                method: 'PATCH',
                headers: this.headers,
            });

            return response.ok;
        } catch (error) {
            console.error(`Error ${active ? 'activating' : 'deactivating'} workflow ${id}:`, error);
            return false;
        }
    }

    /**
     * Execute a workflow manually
     */
    async executeWorkflow(id: string, data?: Record<string, any>): Promise<N8nExecution | null> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/workflows/${id}/execute`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ data }),
            });

            if (!response.ok) {
                throw new Error(`Failed to execute workflow: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error executing workflow ${id}:`, error);
            return null;
        }
    }

    /**
     * Get executions for a workflow
     */
    async getExecutions(workflowId?: string, limit: number = 20): Promise<N8nExecution[]> {
        try {
            const params = new URLSearchParams({
                limit: limit.toString(),
                ...(workflowId && { workflowId }),
            });

            const response = await fetch(`${this.baseUrl}/api/v1/executions?${params}`, {
                method: 'GET',
                headers: this.headers,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch executions: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching executions:', error);
            return [];
        }
    }

    /**
     * Get execution details
     */
    async getExecution(id: string): Promise<N8nExecutionData | null> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/executions/${id}`, {
                method: 'GET',
                headers: this.headers,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch execution: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching execution ${id}:`, error);
            return null;
        }
    }

    /**
     * Delete an execution
     */
    async deleteExecution(id: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/executions/${id}`, {
                method: 'DELETE',
                headers: this.headers,
            });

            return response.ok;
        } catch (error) {
            console.error(`Error deleting execution ${id}:`, error);
            return false;
        }
    }

    /**
     * Convert AgentForge workflow to n8n format
     */
    convertToN8nWorkflow(agentForgeWorkflow: any): Partial<N8nWorkflow> {
        const nodes: N8nNode[] = agentForgeWorkflow.nodes.map((node: any) => ({
            id: node.id,
            name: node.data.label || node.id,
            type: this.mapNodeType(node.data.type || node.type),
            typeVersion: 1,
            position: [node.position.x, node.position.y],
            parameters: node.data.config || {},
        }));

        const connections: Record<string, any> = {};
        agentForgeWorkflow.edges.forEach((edge: any) => {
            if (!connections[edge.source]) {
                connections[edge.source] = { main: [[]] };
            }
            connections[edge.source].main[0].push({
                node: edge.target,
                type: 'main',
                index: 0,
            });
        });

        return {
            name: agentForgeWorkflow.name,
            active: agentForgeWorkflow.is_active || false,
            nodes,
            connections,
        };
    }

    /**
     * Map AgentForge node types to n8n node types
     */
    private mapNodeType(type: string): string {
        const typeMap: Record<string, string> = {
            'webhook': 'n8n-nodes-base.webhook',
            'http': 'n8n-nodes-base.httpRequest',
            'code': 'n8n-nodes-base.code',
            'condition': 'n8n-nodes-base.if',
            'slack': 'n8n-nodes-base.slack',
            'email': 'n8n-nodes-base.emailSend',
            'schedule': 'n8n-nodes-base.cron',
            'ai': 'n8n-nodes-base.openAi',
            'transform': 'n8n-nodes-base.set',
        };

        return typeMap[type] || 'n8n-nodes-base.noOp';
    }
}

// Export singleton instance
export const n8nClient = new N8nClient();

// Export class for testing
export { N8nClient };
