/**
 * Example Workflow Templates
 * Pre-built workflows that users can import and customize
 */

import { Workflow, WorkflowNode, WorkflowEdge } from './supabase';

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    thumbnail?: string;
}

export const workflowTemplates: WorkflowTemplate[] = [
    {
        id: 'slack-notification',
        name: 'Slack Notification Bot',
        description: 'Send automated notifications to Slack channels based on webhook triggers',
        category: 'Notifications',
        difficulty: 'beginner',
        tags: ['slack', 'webhook', 'notifications'],
        nodes: [
            {
                id: '1',
                type: 'webhook',
                position: { x: 100, y: 100 },
                data: {
                    label: 'Webhook Trigger',
                    config: {
                        path: '/webhook/slack-notify',
                        method: 'POST',
                    },
                },
            },
            {
                id: '2',
                type: 'transform',
                position: { x: 300, y: 100 },
                data: {
                    label: 'Format Message',
                    config: {
                        code: `return {
  channel: input.channel || '#general',
  text: input.message,
  username: 'AgentForge Bot',
  icon_emoji: ':robot_face:'
};`,
                    },
                },
            },
            {
                id: '3',
                type: 'slack',
                position: { x: 500, y: 100 },
                data: {
                    label: 'Send to Slack',
                    config: {
                        action: 'postMessage',
                    },
                },
            },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
        ],
    },
    {
        id: 'email-automation',
        name: 'Email Automation',
        description: 'Process incoming emails and send automated responses',
        category: 'Email',
        difficulty: 'intermediate',
        tags: ['email', 'automation', 'response'],
        nodes: [
            {
                id: '1',
                type: 'schedule',
                position: { x: 100, y: 100 },
                data: {
                    label: 'Check Every 5 Minutes',
                    config: {
                        cron: '*/5 * * * *',
                    },
                },
            },
            {
                id: '2',
                type: 'email',
                position: { x: 300, y: 100 },
                data: {
                    label: 'Fetch Emails',
                    config: {
                        action: 'fetch',
                        folder: 'INBOX',
                        unreadOnly: true,
                    },
                },
            },
            {
                id: '3',
                type: 'condition',
                position: { x: 500, y: 100 },
                data: {
                    label: 'Check Subject',
                    config: {
                        condition: 'subject.includes("support")',
                    },
                },
            },
            {
                id: '4',
                type: 'email',
                position: { x: 700, y: 50 },
                data: {
                    label: 'Send Auto-Reply',
                    config: {
                        action: 'send',
                        template: 'support-response',
                    },
                },
            },
            {
                id: '5',
                type: 'slack',
                position: { x: 700, y: 150 },
                data: {
                    label: 'Notify Team',
                    config: {
                        channel: '#support',
                    },
                },
            },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4', sourceHandle: 'true' },
            { id: 'e3-5', source: '3', target: '5', sourceHandle: 'true' },
        ],
    },
    {
        id: 'data-pipeline',
        name: 'Data ETL Pipeline',
        description: 'Extract, transform, and load data from APIs to database',
        category: 'Data Processing',
        difficulty: 'intermediate',
        tags: ['etl', 'api', 'database', 'data'],
        nodes: [
            {
                id: '1',
                type: 'schedule',
                position: { x: 100, y: 100 },
                data: {
                    label: 'Daily at 2 AM',
                    config: {
                        cron: '0 2 * * *',
                    },
                },
            },
            {
                id: '2',
                type: 'http',
                position: { x: 300, y: 100 },
                data: {
                    label: 'Fetch API Data',
                    config: {
                        method: 'GET',
                        url: 'https://api.example.com/data',
                    },
                },
            },
            {
                id: '3',
                type: 'code',
                position: { x: 500, y: 100 },
                data: {
                    label: 'Transform Data',
                    config: {
                        code: `// Transform and clean data
const transformed = input.data.map(item => ({
  id: item.id,
  name: item.name.trim(),
  value: parseFloat(item.value),
  timestamp: new Date(item.date).toISOString()
}));
return transformed;`,
                    },
                },
            },
            {
                id: '4',
                type: 'http',
                position: { x: 700, y: 100 },
                data: {
                    label: 'Save to Database',
                    config: {
                        method: 'POST',
                        url: 'https://api.supabase.co/rest/v1/data',
                    },
                },
            },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
        ],
    },
    {
        id: 'ai-chatbot',
        name: 'AI Q&A Chatbot (RAG)',
        description: 'Intelligent chatbot powered by RAG (Retrieval Augmented Generation)',
        category: 'AI',
        difficulty: 'advanced',
        tags: ['ai', 'rag', 'chatbot', 'openai', 'vector-search'],
        nodes: [
            {
                id: '1',
                type: 'webhook',
                position: { x: 100, y: 100 },
                data: {
                    label: 'Chat Webhook',
                    config: {
                        path: '/webhook/chat',
                        method: 'POST',
                    },
                },
            },
            {
                id: '2',
                type: 'ai',
                position: { x: 300, y: 100 },
                data: {
                    label: 'Generate Embedding',
                    config: {
                        action: 'embedding',
                        model: 'text-embedding-3-small',
                    },
                },
            },
            {
                id: '3',
                type: 'vector-search',
                position: { x: 500, y: 100 },
                data: {
                    label: 'Search Knowledge Base',
                    config: {
                        collection: 'knowledge_base',
                        limit: 5,
                    },
                },
            },
            {
                id: '4',
                type: 'ai',
                position: { x: 700, y: 100 },
                data: {
                    label: 'Generate Response',
                    config: {
                        action: 'chat',
                        model: 'gpt-4-turbo-preview',
                        systemPrompt: 'You are a helpful assistant. Use the provided context to answer questions accurately.',
                    },
                },
            },
            {
                id: '5',
                type: 'http',
                position: { x: 900, y: 100 },
                data: {
                    label: 'Send Response',
                    config: {
                        method: 'POST',
                        responseType: 'json',
                    },
                },
            },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
            { id: 'e4-5', source: '4', target: '5' },
        ],
    },
    {
        id: 'content-generator',
        name: 'AI Content Generator',
        description: 'Generate blog posts, social media content, and more with AI',
        category: 'AI',
        difficulty: 'intermediate',
        tags: ['ai', 'content', 'openai', 'automation'],
        nodes: [
            {
                id: '1',
                type: 'webhook',
                position: { x: 100, y: 100 },
                data: {
                    label: 'Content Request',
                    config: {
                        path: '/webhook/generate-content',
                        method: 'POST',
                    },
                },
            },
            {
                id: '2',
                type: 'ai',
                position: { x: 300, y: 100 },
                data: {
                    label: 'Generate Outline',
                    config: {
                        action: 'chat',
                        model: 'gpt-4-turbo-preview',
                        systemPrompt: 'Generate a detailed outline for the given topic.',
                    },
                },
            },
            {
                id: '3',
                type: 'ai',
                position: { x: 500, y: 100 },
                data: {
                    label: 'Write Content',
                    config: {
                        action: 'chat',
                        model: 'gpt-4-turbo-preview',
                        systemPrompt: 'Write engaging content based on the outline.',
                    },
                },
            },
            {
                id: '4',
                type: 'http',
                position: { x: 700, y: 100 },
                data: {
                    label: 'Save Content',
                    config: {
                        method: 'POST',
                        url: 'https://api.example.com/content',
                    },
                },
            },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
        ],
    },
    {
        id: 'api-orchestration',
        name: 'Multi-API Orchestration',
        description: 'Coordinate multiple API calls with error handling and retries',
        category: 'Integration',
        difficulty: 'advanced',
        tags: ['api', 'integration', 'orchestration', 'error-handling'],
        nodes: [
            {
                id: '1',
                type: 'webhook',
                position: { x: 100, y: 200 },
                data: {
                    label: 'Trigger',
                    config: {
                        path: '/webhook/orchestrate',
                        method: 'POST',
                    },
                },
            },
            {
                id: '2',
                type: 'http',
                position: { x: 300, y: 100 },
                data: {
                    label: 'API Call 1',
                    config: {
                        method: 'GET',
                        url: 'https://api1.example.com/data',
                        retry: 3,
                    },
                },
            },
            {
                id: '3',
                type: 'http',
                position: { x: 300, y: 200 },
                data: {
                    label: 'API Call 2',
                    config: {
                        method: 'GET',
                        url: 'https://api2.example.com/data',
                        retry: 3,
                    },
                },
            },
            {
                id: '4',
                type: 'http',
                position: { x: 300, y: 300 },
                data: {
                    label: 'API Call 3',
                    config: {
                        method: 'GET',
                        url: 'https://api3.example.com/data',
                        retry: 3,
                    },
                },
            },
            {
                id: '5',
                type: 'code',
                position: { x: 500, y: 200 },
                data: {
                    label: 'Merge Results',
                    config: {
                        code: `// Combine data from all APIs
return {
  combined: {
    api1: input.api1,
    api2: input.api2,
    api3: input.api3
  },
  timestamp: new Date().toISOString()
};`,
                    },
                },
            },
            {
                id: '6',
                type: 'http',
                position: { x: 700, y: 200 },
                data: {
                    label: 'Send Result',
                    config: {
                        method: 'POST',
                        url: 'https://api.example.com/result',
                    },
                },
            },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e1-3', source: '1', target: '3' },
            { id: 'e1-4', source: '1', target: '4' },
            { id: 'e2-5', source: '2', target: '5' },
            { id: 'e3-5', source: '3', target: '5' },
            { id: 'e4-5', source: '4', target: '5' },
            { id: 'e5-6', source: '5', target: '6' },
        ],
    },
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): WorkflowTemplate | undefined {
    return workflowTemplates.find(t => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): WorkflowTemplate[] {
    return workflowTemplates.filter(t => t.category === category);
}

/**
 * Get templates by difficulty
 */
export function getTemplatesByDifficulty(difficulty: string): WorkflowTemplate[] {
    return workflowTemplates.filter(t => t.difficulty === difficulty);
}

/**
 * Get templates by tag
 */
export function getTemplatesByTag(tag: string): WorkflowTemplate[] {
    return workflowTemplates.filter(t => t.tags.includes(tag));
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
    return Array.from(new Set(workflowTemplates.map(t => t.category)));
}

/**
 * Get all tags
 */
export function getAllTags(): string[] {
    return Array.from(new Set(workflowTemplates.flatMap(t => t.tags)));
}
