/**
 * n8n API Client
 * Integrates AgentForge-XT with n8n automation engine
 * 
 * n8n is an open-source workflow automation tool that can be:
 * - Self-hosted via Docker (recommended)
 * - Used via n8n Cloud
 * 
 * @see https://n8n.io
 * @see https://github.com/n8n-io/n8n
 */

// Environment configuration
const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

export interface N8nClientConfig {
    baseUrl?: string;
    apiKey?: string;
}

export interface N8nWorkflow {
    id: string;
    name: string;
    active: boolean;
    nodes: N8nNode[];
    connections: Record<string, N8nConnection>;
    settings?: N8nWorkflowSettings;
    staticData?: Record<string, unknown>;
    tags?: N8nTag[];
    createdAt?: string;
    updatedAt?: string;
}

export interface N8nNode {
    id: string;
    name: string;
    type: string;
    typeVersion: number;
    position: [number, number];
    parameters: Record<string, unknown>;
    credentials?: Record<string, { id: string; name: string }>;
}

export interface N8nConnection {
    main: Array<Array<{
        node: string;
        type: string;
        index: number;
    }>>;
}

export interface N8nWorkflowSettings {
    saveDataErrorExecution?: 'all' | 'none';
    saveDataSuccessExecution?: 'all' | 'none';
    saveManualExecutions?: boolean;
    callerPolicy?: 'any' | 'none' | 'workflowsFromSameOwner';
    timezone?: string;
}

export interface N8nTag {
    id: string;
    name: string;
}

export interface N8nExecution {
    id: string;
    finished: boolean;
    mode: 'trigger' | 'webhook' | 'manual' | 'integrated';
    retryOf?: string;
    retrySuccessId?: string;
    startedAt: string;
    stoppedAt?: string;
    workflowId: string;
    workflowData?: N8nWorkflow;
    status?: 'running' | 'success' | 'failed' | 'waiting';
}

export interface N8nExecutionData {
    id: string;
    finished: boolean;
    mode: string;
    startedAt: string;
    stoppedAt?: string;
    workflowId: string;
    status: string;
    data: {
        resultData: {
            runData: Record<string, N8nNodeExecutionData[]>;
            error?: {
                message: string;
                stack?: string;
            };
        };
    };
}

export interface N8nNodeExecutionData {
    startTime: number;
    executionTime: number;
    data: {
        main: Array<Array<{ json: Record<string, unknown> }>>;
    };
    source: Array<{ previousNode: string }>;
}

export interface N8nCredential {
    id: string;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}

class N8nClient {
    private baseUrl: string;
    private apiKey: string;
    private headers: HeadersInit;

    constructor(config?: N8nClientConfig) {
        this.baseUrl = config?.baseUrl || N8N_BASE_URL;
        this.apiKey = config?.apiKey || N8N_API_KEY;
        this.updateHeaders();
    }

    private updateHeaders(): void {
        this.headers = {
            'Content-Type': 'application/json',
            ...(this.apiKey && { 'X-N8N-API-KEY': this.apiKey }),
        };
    }

    /**
     * Update client configuration
     */
    updateConfig(config: N8nClientConfig): void {
        if (config.baseUrl) {
            this.baseUrl = config.baseUrl.replace(/\/+$/, '');
        }
        if (config.apiKey !== undefined) {
            this.apiKey = config.apiKey;
        }
        this.updateHeaders();
    }

    /**
     * Get current configuration
     */
    getConfig(): { baseUrl: string; hasApiKey: boolean } {
        return {
            baseUrl: this.baseUrl,
            hasApiKey: Boolean(this.apiKey),
        };
    }

    /**
     * Check if n8n is configured and accessible
     */
    async isConfigured(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/healthz`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000),
            });
            return response.ok;
        } catch (error) {
            console.error('n8n health check failed:', error);
            return false;
        }
    }

    /**
     * Get n8n health status with details
     */
    async getHealth(): Promise<{ status: 'healthy' | 'unhealthy'; version?: string; error?: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/healthz`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000),
            });

            if (!response.ok) {
                return { status: 'unhealthy', error: `HTTP ${response.status}` };
            }

            // Try to get version from response or separate endpoint
            try {
                const versionRes = await fetch(`${this.baseUrl}/api/v1/workflows`, {
                    method: 'GET',
                    headers: this.headers,
                });
                // If we can access API, it's working
                if (versionRes.ok) {
                    return { status: 'healthy' };
                }
            } catch {
                // Version check failed, but health is okay
            }

            return { status: 'healthy' };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Connection failed',
            };
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
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `Failed to create workflow: ${response.statusText}`);
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
            const endpoint = active ? 'activate' : 'deactivate';
            const response = await fetch(`${this.baseUrl}/api/v1/workflows/${id}/${endpoint}`, {
                method: 'POST',
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
    async executeWorkflow(id: string, data?: Record<string, unknown>): Promise<N8nExecution | null> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/workflows/${id}/run`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data ? { data } : {}),
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
    async getExecutions(options?: {
        workflowId?: string;
        status?: 'running' | 'success' | 'failed' | 'waiting';
        limit?: number;
    }): Promise<N8nExecution[]> {
        try {
            const params = new URLSearchParams();
            if (options?.workflowId) params.append('workflowId', options.workflowId);
            if (options?.status) params.append('status', options.status);
            if (options?.limit) params.append('limit', options.limit.toString());

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
     * Stop a running execution
     */
    async stopExecution(id: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/executions/${id}/stop`, {
                method: 'POST',
                headers: this.headers,
            });

            return response.ok;
        } catch (error) {
            console.error(`Error stopping execution ${id}:`, error);
            return false;
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
     * Get credentials (list only, no secrets)
     */
    async getCredentials(): Promise<N8nCredential[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/v1/credentials`, {
                method: 'GET',
                headers: this.headers,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch credentials: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching credentials:', error);
            return [];
        }
    }

    /**
     * Convert AgentForge workflow to n8n format
     */
    convertToN8nWorkflow(agentForgeWorkflow: {
        name: string;
        is_active?: boolean;
        nodes: Array<{
            id: string;
            position: { x: number; y: number };
            type: string;
            data: {
                label?: string;
                type?: string;
                config?: Record<string, unknown>;
            };
        }>;
        edges: Array<{
            id: string;
            source: string;
            target: string;
        }>;
    }): Partial<N8nWorkflow> {
        const nodes: N8nNode[] = agentForgeWorkflow.nodes.map((node) => ({
            id: node.id,
            name: node.data.label || node.id,
            type: this.mapNodeType(node.data.type || node.type),
            typeVersion: 1,
            position: [node.position.x, node.position.y],
            parameters: node.data.config || {},
        }));

        const connections: Record<string, N8nConnection> = {};
        agentForgeWorkflow.edges.forEach((edge) => {
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
            settings: {
                saveDataErrorExecution: 'all',
                saveDataSuccessExecution: 'all',
                saveManualExecutions: true,
            },
        };
    }

    /**
     * Map AgentForge node types to n8n node types
     */
    private mapNodeType(type: string): string {
        const typeMap: Record<string, string> = {
            // Triggers
            'webhook': 'n8n-nodes-base.webhook',
            'schedule': 'n8n-nodes-base.cron',
            'manual': 'n8n-nodes-base.manualTrigger',
            'chat_trigger': 'n8n-nodes-base.chatTrigger',

            // Actions
            'http': 'n8n-nodes-base.httpRequest',
            'http_request': 'n8n-nodes-base.httpRequest',
            'code': 'n8n-nodes-base.code',
            'email': 'n8n-nodes-base.emailSend',
            'slack': 'n8n-nodes-base.slack',
            'discord': 'n8n-nodes-base.discord',

            // Logic
            'condition': 'n8n-nodes-base.if',
            'switch': 'n8n-nodes-base.switch',
            'loop': 'n8n-nodes-base.splitInBatches',
            'wait': 'n8n-nodes-base.wait',
            'delay': 'n8n-nodes-base.wait',

            // Data
            'transform': 'n8n-nodes-base.set',
            'filter': 'n8n-nodes-base.filter',
            'merge': 'n8n-nodes-base.merge',
            'split': 'n8n-nodes-base.itemLists',

            // AI (LangChain)
            'ai': '@n8n/n8n-nodes-langchain.openAi',
            'openai': '@n8n/n8n-nodes-langchain.openAi',
            'agent': '@n8n/n8n-nodes-langchain.agent',
            'chat': '@n8n/n8n-nodes-langchain.chatOpenAi',
            'embedding': '@n8n/n8n-nodes-langchain.embeddingsOpenAi',
            'vector_store': '@n8n/n8n-nodes-langchain.vectorStoreQdrant',
            'rag': '@n8n/n8n-nodes-langchain.chainRetrievalQa',
            'memory': '@n8n/n8n-nodes-langchain.memoryBufferWindow',
        };

        return typeMap[type] || 'n8n-nodes-base.noOp';
    }
}

// Export singleton instance
export const n8nClient = new N8nClient();

// Export class for testing and custom instances
export { N8nClient };

// Export helper to create client with custom config
export function createN8nClient(config: N8nClientConfig): N8nClient {
    return new N8nClient(config);
}
