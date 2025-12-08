import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// Professional workflow templates inspired by n8n and other automation tools
const workflowTemplates = [
    {
        id: "ai-chatbot",
        name: "AI Chatbot",
        description: "A conversational AI chatbot with context memory using RAG",
        category: "AI",
        icon: "sparkles",
        difficulty: "beginner",
        estimatedTime: "5 min",
        nodes: [
            {
                id: "1",
                type: "custom",
                position: { x: 100, y: 200 },
                data: { label: "Webhook", type: "webhook", description: "Receive chat messages" }
            },
            {
                id: "2",
                type: "custom",
                position: { x: 350, y: 200 },
                data: { label: "AI Chat", type: "ai_chat", model: "gpt-4-turbo", systemPrompt: "You are a helpful assistant." }
            },
            {
                id: "3",
                type: "custom",
                position: { x: 600, y: 200 },
                data: { label: "Response", type: "http_response" }
            },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2", animated: true },
            { id: "e2-3", source: "2", target: "3", animated: true },
        ],
    },
    {
        id: "rag-document-qa",
        name: "Document Q&A (RAG)",
        description: "Answer questions using your documents with vector search",
        category: "AI",
        icon: "database",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        nodes: [
            {
                id: "1",
                type: "custom",
                position: { x: 100, y: 200 },
                data: { label: "Webhook", type: "webhook", description: "Receive questions" }
            },
            {
                id: "2",
                type: "custom",
                position: { x: 350, y: 100 },
                data: { label: "Embeddings", type: "ai_embedding", model: "text-embedding-3-small" }
            },
            {
                id: "3",
                type: "custom",
                position: { x: 350, y: 300 },
                data: { label: "RAG Query", type: "ai_rag", vectorStore: "qdrant", topK: 5 }
            },
            {
                id: "4",
                type: "custom",
                position: { x: 600, y: 200 },
                data: { label: "AI Chat", type: "ai_chat", model: "gpt-4-turbo", systemPrompt: "Answer based on the context provided." }
            },
            {
                id: "5",
                type: "custom",
                position: { x: 850, y: 200 },
                data: { label: "Response", type: "http_response" }
            },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e2-3", source: "2", target: "3" },
            { id: "e3-4", source: "3", target: "4", animated: true },
            { id: "e4-5", source: "4", target: "5" },
        ],
    },
    {
        id: "slack-notification",
        name: "Slack Notification Bot",
        description: "Send notifications to Slack when events occur",
        category: "Integrations",
        icon: "zap",
        difficulty: "beginner",
        estimatedTime: "3 min",
        nodes: [
            {
                id: "1",
                type: "custom",
                position: { x: 100, y: 200 },
                data: { label: "Webhook", type: "webhook" }
            },
            {
                id: "2",
                type: "custom",
                position: { x: 350, y: 200 },
                data: { label: "Transform", type: "transform", description: "Format message" }
            },
            {
                id: "3",
                type: "custom",
                position: { x: 600, y: 200 },
                data: {
                    label: "HTTP Request",
                    type: "http_request",
                    url: "https://slack.com/api/chat.postMessage",
                    method: "POST"
                }
            },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e2-3", source: "2", target: "3" },
        ],
    },
    {
        id: "scheduled-report",
        name: "Scheduled Report Generator",
        description: "Generate and email daily/weekly reports automatically",
        category: "Automation",
        icon: "clock",
        difficulty: "intermediate",
        estimatedTime: "8 min",
        nodes: [
            {
                id: "1",
                type: "custom",
                position: { x: 100, y: 200 },
                data: { label: "Schedule", type: "schedule", cron: "0 9 * * 1-5" }
            },
            {
                id: "2",
                type: "custom",
                position: { x: 350, y: 200 },
                data: { label: "Fetch Data", type: "http_request", url: "https://api.example.com/reports" }
            },
            {
                id: "3",
                type: "custom",
                position: { x: 600, y: 200 },
                data: { label: "AI Summary", type: "ai_chat", systemPrompt: "Summarize this data into a brief report." }
            },
            {
                id: "4",
                type: "custom",
                position: { x: 850, y: 200 },
                data: { label: "Send Email", type: "email", to: "team@example.com" }
            },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e2-3", source: "2", target: "3" },
            { id: "e3-4", source: "3", target: "4" },
        ],
    },
    {
        id: "content-moderation",
        name: "AI Content Moderation",
        description: "Automatically moderate user content using AI",
        category: "AI",
        icon: "shield",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        nodes: [
            {
                id: "1",
                type: "custom",
                position: { x: 100, y: 200 },
                data: { label: "Webhook", type: "webhook", description: "Receive content" }
            },
            {
                id: "2",
                type: "custom",
                position: { x: 350, y: 200 },
                data: {
                    label: "AI Moderation",
                    type: "ai_chat",
                    systemPrompt: "Analyze this content and respond with JSON: {safe: boolean, reason: string, category: string}"
                }
            },
            {
                id: "3",
                type: "custom",
                position: { x: 600, y: 200 },
                data: { label: "Condition", type: "condition", field: "safe", operator: "eq", value: true }
            },
            {
                id: "4",
                type: "custom",
                position: { x: 850, y: 100 },
                data: { label: "Approve", type: "http_request", description: "Mark as approved" }
            },
            {
                id: "5",
                type: "custom",
                position: { x: 850, y: 300 },
                data: { label: "Flag for Review", type: "http_request", description: "Send to moderation queue" }
            },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e2-3", source: "2", target: "3" },
            { id: "e3-4", source: "3", target: "4", label: "Yes" },
            { id: "e3-5", source: "3", target: "5", label: "No" },
        ],
    },
    {
        id: "lead-enrichment",
        name: "Lead Enrichment Pipeline",
        description: "Enrich leads with company data and score them using AI",
        category: "Sales",
        icon: "users",
        difficulty: "advanced",
        estimatedTime: "15 min",
        nodes: [
            {
                id: "1",
                type: "custom",
                position: { x: 100, y: 200 },
                data: { label: "New Lead", type: "webhook" }
            },
            {
                id: "2",
                type: "custom",
                position: { x: 350, y: 100 },
                data: { label: "Clearbit", type: "http_request", description: "Enrich with company data" }
            },
            {
                id: "3",
                type: "custom",
                position: { x: 350, y: 300 },
                data: { label: "LinkedIn", type: "http_request", description: "Get social data" }
            },
            {
                id: "4",
                type: "custom",
                position: { x: 600, y: 200 },
                data: { label: "AI Scoring", type: "ai_chat", systemPrompt: "Score this lead 1-100 based on the data provided." }
            },
            {
                id: "5",
                type: "custom",
                position: { x: 850, y: 200 },
                data: { label: "CRM Update", type: "http_request", description: "Update Salesforce/HubSpot" }
            },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e1-3", source: "1", target: "3" },
            { id: "e2-4", source: "2", target: "4" },
            { id: "e3-4", source: "3", target: "4" },
            { id: "e4-5", source: "4", target: "5" },
        ],
    },
    {
        id: "github-issue-responder",
        name: "GitHub Issue Auto-Responder",
        description: "Automatically respond to GitHub issues with AI-generated answers",
        category: "Developer",
        icon: "gitBranch",
        difficulty: "intermediate",
        estimatedTime: "10 min",
        nodes: [
            {
                id: "1",
                type: "custom",
                position: { x: 100, y: 200 },
                data: { label: "GitHub Webhook", type: "webhook", event: "issues.opened" }
            },
            {
                id: "2",
                type: "custom",
                position: { x: 350, y: 200 },
                data: { label: "RAG Search", type: "ai_rag", description: "Search docs for similar issues" }
            },
            {
                id: "3",
                type: "custom",
                position: { x: 600, y: 200 },
                data: {
                    label: "AI Response",
                    type: "ai_chat",
                    systemPrompt: "Generate a helpful response to this GitHub issue based on the documentation context."
                }
            },
            {
                id: "4",
                type: "custom",
                position: { x: 850, y: 200 },
                data: { label: "Post Comment", type: "http_request", url: "https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}/comments" }
            },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e2-3", source: "2", target: "3" },
            { id: "e3-4", source: "3", target: "4" },
        ],
    },
    {
        id: "data-pipeline",
        name: "ETL Data Pipeline",
        description: "Extract, transform, and load data from multiple sources",
        category: "Data",
        icon: "database",
        difficulty: "advanced",
        estimatedTime: "20 min",
        nodes: [
            {
                id: "1",
                type: "custom",
                position: { x: 100, y: 200 },
                data: { label: "Schedule", type: "schedule", cron: "0 0 * * *" }
            },
            {
                id: "2",
                type: "custom",
                position: { x: 350, y: 100 },
                data: { label: "API Source", type: "http_request" }
            },
            {
                id: "3",
                type: "custom",
                position: { x: 350, y: 300 },
                data: { label: "Database Query", type: "http_request" }
            },
            {
                id: "4",
                type: "custom",
                position: { x: 600, y: 200 },
                data: { label: "Transform", type: "transform", description: "Clean and merge data" }
            },
            {
                id: "5",
                type: "custom",
                position: { x: 850, y: 200 },
                data: { label: "Load", type: "http_request", description: "Write to data warehouse" }
            },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e1-3", source: "1", target: "3" },
            { id: "e2-4", source: "2", target: "4" },
            { id: "e3-4", source: "3", target: "4" },
            { id: "e4-5", source: "4", target: "5" },
        ],
    },
];

// GET - List all templates
export async function GET() {
    return NextResponse.json({
        success: true,
        templates: workflowTemplates,
        categories: Array.from(new Set(workflowTemplates.map(t => t.category))),
    });
}
