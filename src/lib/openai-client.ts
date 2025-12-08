/**
 * OpenAI API Client
 * Provides AI capabilities for AgentForge-XT
 * Supports OpenAI and OpenAI-compatible APIs (Azure, Ollama, LocalAI, OpenRouter, etc.)
 */

// Environment configuration with fallbacks
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_DEFAULT_MODEL = process.env.OPENAI_DEFAULT_MODEL || 'gpt-4-turbo-preview';

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant' | 'function';
    content: string;
    name?: string;
    function_call?: {
        name: string;
        arguments: string;
    };
}

export interface ChatCompletionOptions {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    stop?: string | string[];
    functions?: FunctionDefinition[];
    function_call?: 'auto' | 'none' | { name: string };
}

export interface FunctionDefinition {
    name: string;
    description?: string;
    parameters: {
        type: 'object';
        properties: Record<string, unknown>;
        required?: string[];
    };
}

export interface EmbeddingOptions {
    model?: string;
    encoding_format?: 'float' | 'base64';
}

export interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: ChatMessage;
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface EmbeddingResponse {
    object: string;
    data: {
        object: string;
        embedding: number[];
        index: number;
    }[];
    model: string;
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
}

export interface OpenAIClientConfig {
    apiKey?: string;
    baseUrl?: string;
    defaultModel?: string;
}

class OpenAIClient {
    private apiKey: string;
    private baseUrl: string;
    private defaultModel: string;
    private headers: HeadersInit;

    constructor(config?: OpenAIClientConfig) {
        this.apiKey = config?.apiKey || OPENAI_API_KEY;
        this.baseUrl = this.normalizeBaseUrl(config?.baseUrl || OPENAI_BASE_URL);
        this.defaultModel = config?.defaultModel || OPENAI_DEFAULT_MODEL;
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
        };
    }

    /**
     * Normalize base URL (remove trailing slash)
     */
    private normalizeBaseUrl(url: string): string {
        return url.replace(/\/+$/, '');
    }

    /**
     * Update client configuration dynamically
     */
    updateConfig(config: Partial<OpenAIClientConfig>): void {
        if (config.apiKey) {
            this.apiKey = config.apiKey;
            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            };
        }
        if (config.baseUrl) {
            this.baseUrl = this.normalizeBaseUrl(config.baseUrl);
        }
        if (config.defaultModel) {
            this.defaultModel = config.defaultModel;
        }
    }

    /**
     * Check if OpenAI is configured
     */
    isConfigured(): boolean {
        // Support multiple API key formats (OpenAI sk-, Anthropic sk-, custom keys)
        return Boolean(this.apiKey && this.apiKey.length > 10);
    }

    /**
     * Get current configuration (for display, masks API key)
     */
    getConfig(): { baseUrl: string; model: string; configured: boolean } {
        return {
            baseUrl: this.baseUrl,
            model: this.defaultModel,
            configured: this.isConfigured(),
        };
    }

    /**
     * Test API connection
     */
    async testConnection(): Promise<{ success: boolean; error?: string; models?: string[] }> {
        if (!this.isConfigured()) {
            return { success: false, error: 'API key is not configured' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                method: 'GET',
                headers: this.headers,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
                return {
                    success: false,
                    error: error.error?.message || `HTTP ${response.status}: ${response.statusText}`
                };
            }

            const data = await response.json();
            const models = data.data?.map((m: { id: string }) => m.id) || [];
            return { success: true, models };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Connection failed'
            };
        }
    }

    /**
     * Create a chat completion
     */
    async createChatCompletion(
        messages: ChatMessage[],
        options: ChatCompletionOptions = {}
    ): Promise<ChatCompletionResponse | null> {
        if (!this.isConfigured()) {
            console.error('OpenAI API key is not configured');
            return null;
        }

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    model: options.model || this.defaultModel,
                    messages,
                    temperature: options.temperature ?? 0.7,
                    max_tokens: options.max_tokens,
                    top_p: options.top_p,
                    frequency_penalty: options.frequency_penalty,
                    presence_penalty: options.presence_penalty,
                    stop: options.stop,
                    functions: options.functions,
                    function_call: options.function_call,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating chat completion:', error);
            return null;
        }
    }

    /**
     * Create embeddings for text
     */
    async createEmbedding(
        input: string | string[],
        options: EmbeddingOptions = {}
    ): Promise<EmbeddingResponse | null> {
        if (!this.isConfigured()) {
            console.error('OpenAI API key is not configured');
            return null;
        }

        try {
            const response = await fetch(`${this.baseUrl}/embeddings`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    model: options.model || 'text-embedding-3-small',
                    input,
                    encoding_format: options.encoding_format || 'float',
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating embedding:', error);
            return null;
        }
    }

    /**
     * Simple chat - convenience method
     */
    async chat(
        userMessage: string,
        systemPrompt?: string,
        options: ChatCompletionOptions = {}
    ): Promise<string | null> {
        const messages: ChatMessage[] = [];

        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt,
            });
        }

        messages.push({
            role: 'user',
            content: userMessage,
        });

        const response = await this.createChatCompletion(messages, options);
        return response?.choices[0]?.message?.content || null;
    }

    /**
     * Generate text with streaming
     */
    async *streamChatCompletion(
        messages: ChatMessage[],
        options: ChatCompletionOptions = {}
    ): AsyncGenerator<string, void, unknown> {
        if (!this.isConfigured()) {
            console.error('OpenAI API key is not configured');
            return;
        }

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    model: options.model || this.defaultModel,
                    messages,
                    temperature: options.temperature ?? 0.7,
                    max_tokens: options.max_tokens,
                    stream: true,
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Response body is not readable');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content;
                            if (content) {
                                yield content;
                            }
                        } catch {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error streaming chat completion:', error);
        }
    }

    /**
     * Function calling helper
     */
    async callFunction(
        userMessage: string,
        functions: FunctionDefinition[],
        systemPrompt?: string
    ): Promise<{ functionName: string; arguments: Record<string, unknown> } | null> {
        const messages: ChatMessage[] = [];

        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt,
            });
        }

        messages.push({
            role: 'user',
            content: userMessage,
        });

        const response = await this.createChatCompletion(messages, {
            functions,
            function_call: 'auto',
        });

        const functionCall = response?.choices[0]?.message?.function_call;
        if (!functionCall) {
            return null;
        }

        return {
            functionName: functionCall.name,
            arguments: JSON.parse(functionCall.arguments),
        };
    }
}

// Export singleton instance (uses environment variables)
export const openAIClient = new OpenAIClient();

// Export class for testing and custom instances
export { OpenAIClient };

// Export helper to create client with user settings
export function createOpenAIClient(config: OpenAIClientConfig): OpenAIClient {
    return new OpenAIClient(config);
}
