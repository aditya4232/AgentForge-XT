"use client";

import { useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    Connection,
    BackgroundVariant,
    Panel,
    Handle,
    Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
    Workflow,
    Save,
    Play,
    ArrowLeft,
    Plus,
    Trash2,
    X,
    Globe,
    Clock,
    Send,
    Mail,
    GitBranch,
    Repeat,
    Filter,
    Wand2,
    Timer,
    Zap,
    CheckCircle,
    AlertCircle,
    Loader2,
    Sparkles,
} from "lucide-react";

// Node categories
const nodeCategories = [
    {
        name: "Triggers",
        nodes: [
            { type: "webhook", label: "Webhook", icon: Globe, color: "bg-green-500/10 text-green-600" },
            { type: "schedule", label: "Schedule", icon: Clock, color: "bg-green-500/10 text-green-600" },
            { type: "manual", label: "Manual", icon: Play, color: "bg-green-500/10 text-green-600" },
        ],
    },
    {
        name: "AI",
        nodes: [
            { type: "ai_chat", label: "AI Chat", icon: Sparkles, color: "bg-violet-500/10 text-violet-600" },
            { type: "ai_embedding", label: "Embeddings", icon: Zap, color: "bg-violet-500/10 text-violet-600" },
            { type: "ai_rag", label: "RAG Query", icon: Sparkles, color: "bg-violet-500/10 text-violet-600" },
        ],
    },
    {
        name: "Actions",
        nodes: [
            { type: "http_request", label: "HTTP Request", icon: Send, color: "bg-blue-500/10 text-blue-600" },
            { type: "email", label: "Send Email", icon: Mail, color: "bg-blue-500/10 text-blue-600" },
            { type: "delay", label: "Delay", icon: Timer, color: "bg-blue-500/10 text-blue-600" },
        ],
    },
    {
        name: "Logic",
        nodes: [
            { type: "condition", label: "Condition", icon: GitBranch, color: "bg-orange-500/10 text-orange-600" },
            { type: "loop", label: "Loop", icon: Repeat, color: "bg-orange-500/10 text-orange-600" },
        ],
    },
    {
        name: "Data",
        nodes: [
            { type: "transform", label: "Transform", icon: Wand2, color: "bg-purple-500/10 text-purple-600" },
            { type: "filter", label: "Filter", icon: Filter, color: "bg-purple-500/10 text-purple-600" },
        ],
    },
];

// Get node info helper
function getNodeInfo(type: string) {
    for (const category of nodeCategories) {
        const node = category.nodes.find((n) => n.type === type);
        if (node) return node;
    }
    return null;
}

// Custom node component with visible handles
function CustomNode({ data, selected }: { data: any; selected: boolean }) {
    const nodeInfo = getNodeInfo(data.type);
    const Icon = nodeInfo?.icon || Zap;

    return (
        <div
            className={`relative min-w-[180px] rounded-xl border-2 bg-card shadow-lg transition-all ${selected
                    ? "border-violet-500 shadow-violet-500/25"
                    : "border-border hover:border-violet-500/50"
                }`}
        >
            {/* Left Handle (Input) */}
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    width: 14,
                    height: 14,
                    left: -8,
                    background: '#8b5cf6',
                    border: '3px solid #1e1e2e',
                    cursor: 'crosshair',
                }}
            />

            <div className="p-3">
                <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shadow-md ${nodeInfo?.color || "bg-violet-500/10 text-violet-500"}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{data.label}</p>
                        <p className="text-xs text-muted-foreground">{nodeInfo?.label || data.type}</p>
                    </div>
                </div>
            </div>

            {data.status && (
                <div
                    className={`px-3 py-2 border-t text-xs flex items-center gap-2 ${data.status === "success"
                            ? "border-green-500/30 bg-green-500/10 text-green-500"
                            : data.status === "error"
                                ? "border-red-500/30 bg-red-500/10 text-red-500"
                                : "border-border"
                        }`}
                >
                    {data.status === "success" && <CheckCircle className="h-3.5 w-3.5" />}
                    {data.status === "error" && <AlertCircle className="h-3.5 w-3.5" />}
                    {data.status === "success" ? "Success" : data.status === "error" ? "Failed" : "Pending"}
                </div>
            )}

            {/* Right Handle (Output) */}
            <Handle
                type="source"
                position={Position.Right}
                style={{
                    width: 14,
                    height: 14,
                    right: -8,
                    background: '#8b5cf6',
                    border: '3px solid #1e1e2e',
                    cursor: 'crosshair',
                }}
            />
        </div>
    );
}

const nodeTypes = { custom: CustomNode };

// Templates for quick start
const templates = [
    {
        id: "blank",
        name: "Blank Workflow",
        description: "Start from scratch",
        icon: Plus,
        nodes: [],
        edges: [],
    },
    {
        id: "webhook-notify",
        name: "Webhook to Email",
        description: "Receive webhook and send email notification",
        icon: Mail,
        nodes: [
            { id: "1", type: "custom", position: { x: 100, y: 150 }, data: { label: "Webhook", type: "webhook" } },
            { id: "2", type: "custom", position: { x: 350, y: 150 }, data: { label: "Transform", type: "transform" } },
            { id: "3", type: "custom", position: { x: 600, y: 150 }, data: { label: "Send Email", type: "email" } },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e2-3", source: "2", target: "3" },
        ],
    },
    {
        id: "scheduled-report",
        name: "Scheduled Report",
        description: "Run daily tasks on schedule",
        icon: Clock,
        nodes: [
            { id: "1", type: "custom", position: { x: 100, y: 150 }, data: { label: "Schedule", type: "schedule" } },
            { id: "2", type: "custom", position: { x: 350, y: 150 }, data: { label: "HTTP Request", type: "http_request" } },
            { id: "3", type: "custom", position: { x: 600, y: 150 }, data: { label: "Send Email", type: "email" } },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e2-3", source: "2", target: "3" },
        ],
    },
    {
        id: "conditional",
        name: "Conditional Flow",
        description: "Branch based on conditions",
        icon: GitBranch,
        nodes: [
            { id: "1", type: "custom", position: { x: 100, y: 150 }, data: { label: "Webhook", type: "webhook" } },
            { id: "2", type: "custom", position: { x: 350, y: 150 }, data: { label: "Condition", type: "condition" } },
            { id: "3", type: "custom", position: { x: 600, y: 50 }, data: { label: "Send Email", type: "email" } },
            { id: "4", type: "custom", position: { x: 600, y: 250 }, data: { label: "HTTP Request", type: "http_request" } },
        ],
        edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e2-3", source: "2", target: "3" },
            { id: "e2-4", source: "2", target: "4" },
        ],
    },
];

export default function NewWorkflowPage() {
    const router = useRouter();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [showNodePanel, setShowNodePanel] = useState(true);
    const [showTemplates, setShowTemplates] = useState(true);
    const [workflowName, setWorkflowName] = useState("Untitled Workflow");
    const [isSaving, setIsSaving] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onNodeClick = useCallback((_: any, node: Node) => {
        setSelectedNode(node);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const type = event.dataTransfer.getData("application/reactflow");
            const label = event.dataTransfer.getData("label");
            if (!type || !reactFlowWrapper.current) return;

            const bounds = reactFlowWrapper.current.getBoundingClientRect();
            const position = {
                x: event.clientX - bounds.left,
                y: event.clientY - bounds.top,
            };

            const newNode: Node = {
                id: `${Date.now()}`,
                type: "custom",
                position,
                data: { label, type },
            };

            setNodes((nds) => nds.concat(newNode));
            setShowNodePanel(false);
            setShowTemplates(false);
        },
        [setNodes]
    );

    const handleSelectTemplate = (template: typeof templates[0]) => {
        setNodes(template.nodes as Node[]);
        setEdges(template.edges as Edge[]);
        setShowTemplates(false);
        if (template.id !== "blank") {
            setWorkflowName(template.name);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise((r) => setTimeout(r, 800));
        // In production, save to Supabase
        setIsSaving(false);
        router.push("/dashboard");
    };

    const handleExecute = async () => {
        setIsExecuting(true);
        for (const node of nodes) {
            setNodes((nds) =>
                nds.map((n) =>
                    n.id === node.id ? { ...n, data: { ...n.data, status: "success" } } : n
                )
            );
            await new Promise((r) => setTimeout(r, 400));
        }
        setIsExecuting(false);
    };

    const handleDeleteNode = () => {
        if (selectedNode) {
            setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
            setEdges((eds) =>
                eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
            );
            setSelectedNode(null);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                            <Workflow className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                        <input
                            type="text"
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                            className="bg-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1"
                        />
                        <span className="badge badge-secondary text-xs">New</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setShowNodePanel(!showNodePanel)} className="btn-secondary text-sm">
                        <Plus className="h-4 w-4" />
                        Add node
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="btn-secondary text-sm">
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save
                    </button>
                    <button onClick={handleExecute} disabled={isExecuting || nodes.length === 0} className="btn-primary text-sm">
                        {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                        Run
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Node Panel */}
                <AnimatePresence>
                    {showNodePanel && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 280, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="border-r border-border bg-background overflow-hidden flex-shrink-0"
                        >
                            <div className="w-[280px] h-full overflow-y-auto p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-medium">Add Node</h2>
                                    <button onClick={() => setShowNodePanel(false)} className="p-1 rounded hover:bg-secondary">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                {nodeCategories.map((category) => (
                                    <div key={category.name} className="mb-5">
                                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                            {category.name}
                                        </h3>
                                        <div className="space-y-1">
                                            {category.nodes.map((node) => (
                                                <div
                                                    key={node.type}
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData("application/reactflow", node.type);
                                                        e.dataTransfer.setData("label", node.label);
                                                        e.dataTransfer.effectAllowed = "move";
                                                    }}
                                                    className="flex items-center gap-2 p-2 rounded-md border border-border hover:border-primary/50 hover:bg-secondary/50 cursor-grab transition-colors"
                                                >
                                                    <div className={`h-7 w-7 rounded-md flex items-center justify-center ${node.color}`}>
                                                        <node.icon className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span className="text-sm">{node.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Canvas */}
                <div className="flex-1 relative" ref={reactFlowWrapper}>
                    {/* Templates Overlay */}
                    <AnimatePresence>
                        {showTemplates && nodes.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-10 bg-background/95 flex items-center justify-center p-6"
                            >
                                <div className="max-w-2xl w-full">
                                    <div className="text-center mb-8">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                            <Sparkles className="h-6 w-6 text-primary" />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2">Create New Workflow</h2>
                                        <p className="text-muted-foreground">
                                            Start with a template or build from scratch
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {templates.map((template) => (
                                            <button
                                                key={template.id}
                                                onClick={() => handleSelectTemplate(template)}
                                                className="group p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/50 text-left transition-all"
                                            >
                                                <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors`}>
                                                    <template.icon className="h-5 w-5 text-primary" />
                                                </div>
                                                <h3 className="font-medium mb-1">{template.name}</h3>
                                                <p className="text-sm text-muted-foreground">{template.description}</p>
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setShowTemplates(false)}
                                        className="mt-6 text-sm text-muted-foreground hover:text-foreground mx-auto block"
                                    >
                                        Skip and start empty
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-background"
                    >
                        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="hsl(var(--muted-foreground) / 0.2)" />
                        <Controls className="!bg-background !border-border !rounded-lg [&>button]:!bg-background [&>button]:!border-border [&>button:hover]:!bg-secondary" />
                        <MiniMap
                            className="!bg-background !border-border !rounded-lg"
                            nodeColor={() => "hsl(var(--primary))"}
                            maskColor="hsl(var(--background) / 0.9)"
                        />
                        <Panel position="bottom-center" className="mb-4">
                            <div className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
                                Drag nodes from panel • Connect by dragging handles
                            </div>
                        </Panel>
                    </ReactFlow>
                </div>

                {/* Config Panel */}
                <AnimatePresence>
                    {selectedNode && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 280, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="border-l border-border bg-background overflow-hidden flex-shrink-0"
                        >
                            <div className="w-[280px] h-full overflow-y-auto p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-medium">Configure</h2>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={handleDeleteNode}
                                            className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-950 text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => setSelectedNode(null)} className="p-1 rounded hover:bg-secondary">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Name</label>
                                        <input
                                            type="text"
                                            value={selectedNode.data.label}
                                            onChange={(e) => {
                                                setNodes((nds) =>
                                                    nds.map((n) =>
                                                        n.id === selectedNode.id
                                                            ? { ...n, data: { ...n.data, label: e.target.value } }
                                                            : n
                                                    )
                                                );
                                            }}
                                            className="input mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Type</label>
                                        <div className="mt-1 px-3 py-2 rounded-md border border-border bg-secondary/50 text-sm">
                                            {selectedNode.data.type}
                                        </div>
                                    </div>

                                    {selectedNode.data.type === "http_request" && (
                                        <>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">URL</label>
                                                <input type="text" placeholder="https://api.example.com" className="input mt-1" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Method</label>
                                                <select className="input mt-1">
                                                    <option>GET</option>
                                                    <option>POST</option>
                                                    <option>PUT</option>
                                                    <option>DELETE</option>
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    {selectedNode.data.type === "email" && (
                                        <>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">To</label>
                                                <input type="email" placeholder="email@example.com" className="input mt-1" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Subject</label>
                                                <input type="text" placeholder="Email subject" className="input mt-1" />
                                            </div>
                                        </>
                                    )}

                                    {selectedNode.data.type === "delay" && (
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Duration (seconds)</label>
                                            <input type="number" placeholder="5" className="input mt-1" />
                                        </div>
                                    )}

                                    {selectedNode.data.type === "schedule" && (
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Cron Expression</label>
                                            <input type="text" placeholder="0 9 * * *" className="input mt-1" />
                                            <p className="text-xs text-muted-foreground mt-1">e.g., "0 9 * * *" = Daily at 9 AM</p>
                                        </div>
                                    )}

                                    {selectedNode.data.type === "webhook" && (
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Webhook URL</label>
                                            <div className="mt-1 px-3 py-2 rounded-md border border-border bg-secondary/50 text-xs font-mono break-all">
                                                /api/webhook/{selectedNode.id}
                                            </div>
                                        </div>
                                    )}

                                    {selectedNode.data.type === "condition" && (
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Condition</label>
                                            <input type="text" placeholder="{{data.status}} === 'active'" className="input mt-1" />
                                        </div>
                                    )}

                                    {selectedNode.data.type === "ai_chat" && (
                                        <>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Model</label>
                                                <select className="input mt-1">
                                                    <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                                                    <option value="gpt-4o">GPT-4o</option>
                                                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">System Prompt</label>
                                                <textarea
                                                    placeholder="You are a helpful assistant..."
                                                    className="input mt-1 min-h-[80px] resize-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Temperature</label>
                                                <input type="number" step="0.1" min="0" max="2" placeholder="0.7" className="input mt-1" />
                                            </div>
                                        </>
                                    )}

                                    {selectedNode.data.type === "ai_embedding" && (
                                        <>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Embedding Model</label>
                                                <select className="input mt-1">
                                                    <option value="text-embedding-3-small">text-embedding-3-small</option>
                                                    <option value="text-embedding-3-large">text-embedding-3-large</option>
                                                    <option value="text-embedding-ada-002">text-embedding-ada-002</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Input Field</label>
                                                <input type="text" placeholder="{{data.text}}" className="input mt-1" />
                                            </div>
                                        </>
                                    )}

                                    {selectedNode.data.type === "ai_rag" && (
                                        <>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Vector Store</label>
                                                <select className="input mt-1">
                                                    <option value="qdrant">Qdrant</option>
                                                    <option value="pinecone">Pinecone</option>
                                                    <option value="weaviate">Weaviate</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Collection Name</label>
                                                <input type="text" placeholder="knowledge_base" className="input mt-1" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Top K Results</label>
                                                <input type="number" min="1" max="20" placeholder="5" className="input mt-1" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
