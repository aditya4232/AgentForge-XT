import {
    Globe,
    Clock,
    Play,
    Send,
    Mail,
    Timer,
    GitBranch,
    Repeat,
    Wand2,
    Filter,
    Zap,
    LucideIcon
} from "lucide-react";

export type NodeCategory = {
    name: string;
    nodes: {
        type: string;
        label: string;
        icon: LucideIcon;
        color: string;
    }[];
};

export const nodeCategories: NodeCategory[] = [
    {
        name: "Triggers",
        nodes: [
            { type: "webhook", label: "Webhook", icon: Globe, color: "bg-green-500/10 text-green-600" },
            { type: "schedule", label: "Schedule", icon: Clock, color: "bg-green-500/10 text-green-600" },
            { type: "manual", label: "Manual", icon: Play, color: "bg-green-500/10 text-green-600" },
            { type: "chat_trigger", label: "On Chat Message", icon: Zap, color: "bg-green-500/10 text-green-600" },
        ],
    },
    {
        name: "AI & Agents",
        nodes: [
            { type: "ai_agent", label: "AI Agent", icon: Zap, color: "bg-emerald-500/10 text-emerald-600" },
            { type: "openai", label: "OpenAI Chat Model", icon: Zap, color: "bg-emerald-500/10 text-emerald-600" },
            { type: "vector_store", label: "Vector Store Tool", icon: Zap, color: "bg-emerald-500/10 text-emerald-600" },
            { type: "qdrant", label: "Qdrant Vector Store", icon: Zap, color: "bg-red-500/10 text-red-600" },
            { type: "embeddings", label: "OpenAI Embeddings", icon: Zap, color: "bg-emerald-500/10 text-emerald-600" },
        ],
    },
    {
        name: "Integrations",
        nodes: [
            { type: "slack", label: "Slack", icon: Send, color: "bg-blue-500/10 text-blue-600" },
            { type: "email", label: "Send Email", icon: Mail, color: "bg-blue-500/10 text-blue-600" },
            { type: "http_request", label: "HTTP Request", icon: Send, color: "bg-blue-500/10 text-blue-600" },
        ],
    },
    {
        name: "Logic & Data",
        nodes: [
            { type: "condition", label: "Condition", icon: GitBranch, color: "bg-orange-500/10 text-orange-600" },
            { type: "loop", label: "Loop", icon: Repeat, color: "bg-orange-500/10 text-orange-600" },
            { type: "transform", label: "Transform", icon: Wand2, color: "bg-purple-500/10 text-purple-600" },
            { type: "filter", label: "Filter", icon: Filter, color: "bg-purple-500/10 text-purple-600" },
        ],
    },
];

// Add missing nodes to categories for compatibility
const extraNodes = [
    { category: "AI & Agents", node: { type: "ai_chat", label: "AI Chat", icon: Zap, color: "bg-violet-500/10 text-violet-600" } },
    { category: "AI & Agents", node: { type: "ai_rag", label: "RAG Query", icon: Zap, color: "bg-violet-500/10 text-violet-600" } },
    { category: "Integrations", node: { type: "delay", label: "Delay", icon: Timer, color: "bg-blue-500/10 text-blue-600" } },
];

extraNodes.forEach(item => {
    const cat = nodeCategories.find(c => c.name === item.category);
    if (cat && !cat.nodes.find(n => n.type === item.node.type)) {
        cat.nodes.push(item.node);
    }
});

export function getNodeInfo(type: string) {
    for (const category of nodeCategories) {
        const node = category.nodes.find((n) => n.type === type);
        if (node) return { ...node, category: category.name };
    }
    return null;
}
