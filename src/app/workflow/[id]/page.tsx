"use client";

import { useCallback, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
    Workflow,
    Save,
    Play,
    ArrowLeft,
    Plus,
    Settings,
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

// Custom node component
function CustomNode({ data, selected }: { data: any; selected: boolean }) {
    const nodeInfo = getNodeInfo(data.type);
    const Icon = nodeInfo?.icon || Zap;

    return (
        <div
            className={`min-w-[160px] rounded-lg border bg-card shadow-sm transition-all ${selected ? "border-primary shadow-md" : "border-border"
                }`}
        >
            <div className="p-3">
                <div className="flex items-center gap-2">
                    <div className={`h-7 w-7 rounded-md flex items-center justify-center ${nodeInfo?.color || "bg-secondary"}`}>
                        <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{data.label}</p>
                    </div>
                </div>
            </div>
            {data.status && (
                <div
                    className={`px-3 py-1.5 border-t text-xs flex items-center gap-1.5 ${data.status === "success"
                            ? "border-green-200 bg-green-50 text-green-600 dark:border-green-900 dark:bg-green-950"
                            : data.status === "error"
                                ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950"
                                : "border-border"
                        }`}
                >
                    {data.status === "success" && <CheckCircle className="h-3 w-3" />}
                    {data.status === "error" && <AlertCircle className="h-3 w-3" />}
                    {data.status === "success" ? "Success" : data.status === "error" ? "Failed" : "Pending"}
                </div>
            )}
        </div>
    );
}

const nodeTypes = { custom: CustomNode };

// Initial demo nodes
const initialNodes: Node[] = [
    {
        id: "1",
        type: "custom",
        position: { x: 100, y: 100 },
        data: { label: "Webhook", type: "webhook" },
    },
    {
        id: "2",
        type: "custom",
        position: { x: 350, y: 100 },
        data: { label: "Transform", type: "transform" },
    },
    {
        id: "3",
        type: "custom",
        position: { x: 600, y: 100 },
        data: { label: "Send Email", type: "email" },
    },
];

const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
];

export default function WorkflowEditorPage() {
    const params = useParams();
    const router = useRouter();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [showNodePanel, setShowNodePanel] = useState(false);
    const [workflowName, setWorkflowName] = useState("My Workflow");
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
        },
        [setNodes]
    );

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise((r) => setTimeout(r, 800));
        setIsSaving(false);
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
                    <button onClick={handleExecute} disabled={isExecuting} className="btn-primary text-sm">
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
                <div className="flex-1" ref={reactFlowWrapper}>
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
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
