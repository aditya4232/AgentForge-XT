"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
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
    Trash2,
    X,
    Zap,
    Loader2,
} from "lucide-react";
import { nodeCategories } from "@/lib/workflow-constants";
import CustomNode from "@/components/workflow/CustomNode";

const nodeTypes = { custom: CustomNode };

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

import { useAuth } from "@/components/auth-provider";

export default function WorkflowEditorPage() {
    const { user } = useAuth();
    const params = useParams();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [showNodePanel, setShowNodePanel] = useState(false);
    const [workflowName, setWorkflowName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [activeTab, setActiveTab] = useState("editor");
    const [isWorkflowActive, setIsWorkflowActive] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [executionLogs, setExecutionLogs] = useState<any[]>([]);

    // Fetch workflow data
    useEffect(() => {
        const fetchWorkflow = async () => {
            if (!user) return;
            try {
                const response = await fetch(`/api/workflows/${params.id}`);
                if (response.ok) {
                    const { workflow } = await response.json();
                    setWorkflowName(workflow.name || "Untitled Workflow");
                    setNodes(workflow.nodes || []);
                    setEdges(workflow.edges || []);
                    setIsWorkflowActive(workflow.is_active || false);
                }
            } catch (error) {
                console.error("Error fetching workflow:", error);
            }
        };
        fetchWorkflow();
    }, [params.id, user, setNodes, setEdges]);

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
                x: event.clientX - bounds.left - 120,
                y: event.clientY - bounds.top - 40,
            };

            const newNode: Node = {
                id: `${Date.now()}`,
                type: "custom",
                position,
                data: { label, type },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [setNodes]
    );

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const workflowData = {
                name: workflowName,
                nodes: nodes,
                edges: edges,
                is_active: isWorkflowActive,
            };

            const response = await fetch(`/api/workflows/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user.uid,
                },
                body: JSON.stringify(workflowData),
            });

            if (!response.ok) {
                throw new Error("Failed to save workflow");
            }
            console.log("Saved workflow successfully");
        } catch (error) {
            console.error("Error saving workflow:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleExecute = async () => {
        if (!user) return;
        setIsExecuting(true);
        setShowLogs(true);
        setExecutionLogs([]); // Clear previous logs

        try {
            const response = await fetch(`/api/workflows/${params.id}/execute`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user.uid,
                },
            });

            const data = await response.json();

            if (response.ok && data.execution) {
                // Update visuals for execution (simplified)
                setExecutionLogs(data.execution.logs || []);
                if (data.execution.status === "success") {
                    console.log("Execution successful");
                }
            }
        } catch (error) {
            console.error("Error executing workflow:", error);
            setExecutionLogs([{
                timestamp: new Date().toISOString(),
                status: "error",
                nodeName: "System",
                message: "Execution failed to start"
            }]);
        } finally {
            setIsExecuting(false);
        }
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
        <div className="h-screen flex flex-col bg-background text-foreground">
            {/* Top Bar */}
            <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Workflow className="h-4 w-4 text-primary" />
                        </div>
                        <input
                            type="text"
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                            className="bg-transparent text-sm font-semibold focus:outline-none placeholder:text-muted-foreground/50 w-48"
                            placeholder="Workflow Name"
                        />
                    </div>
                </div>

                {/* Center Tabs */}
                <div className="flex items-center bg-secondary/50 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("editor")}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === "editor" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => setActiveTab("executions")}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === "executions" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Executions
                    </button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 mr-4">
                        <span className={`text-xs font-medium ${isWorkflowActive ? "text-green-500" : "text-muted-foreground"}`}>
                            {isWorkflowActive ? "Active" : "Inactive"}
                        </span>
                        <button
                            onClick={() => setIsWorkflowActive(!isWorkflowActive)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${isWorkflowActive ? "bg-green-500" : "bg-muted"}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isWorkflowActive ? "translate-x-4" : ""}`} />
                        </button>
                    </div>

                    <div className="h-4 w-px bg-border" />

                    <a
                        href="http://localhost:5678"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs h-8 gap-2"
                    >
                        <Zap className="h-3.5 w-3.5" />
                        n8n Engine
                    </a>

                    <button onClick={handleSave} disabled={isSaving} className="btn-secondary text-xs h-8 gap-2">
                        {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Save
                    </button>

                    <button onClick={handleExecute} disabled={isExecuting} className="btn-primary text-xs h-8 gap-2 shadow-lg shadow-primary/20">
                        {isExecuting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                        Execute
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Floating Add Button */}
                <div className="absolute top-4 left-4 z-10">
                    <button
                        onClick={() => setShowNodePanel(!showNodePanel)}
                        className="h-10 w-10 rounded-full bg-foreground text-background shadow-xl hover:scale-105 transition-all flex items-center justify-center"
                        title="Add Node"
                    >
                        <Plus className="h-6 w-6" />
                    </button>
                </div>

                {/* Node Sidebar */}
                <AnimatePresence>
                    {showNodePanel && (
                        <motion.div
                            initial={{ x: -320, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -320, opacity: 0 }}
                            className="absolute top-0 left-0 bottom-0 w-80 bg-background/95 backdrop-blur border-r border-border shadow-2xl z-20 flex flex-col"
                        >
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                <h2 className="font-semibold text-sm">Add Integration</h2>
                                <button onClick={() => setShowNodePanel(false)} className="p-1 hover:bg-secondary rounded">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                {nodeCategories.map((category) => (
                                    <div key={category.name} className="mb-6">
                                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 pl-1">
                                            {category.name}
                                        </h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {category.nodes.map((node) => (
                                                <div
                                                    key={node.type}
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData("application/reactflow", node.type);
                                                        e.dataTransfer.setData("label", node.label);
                                                        e.dataTransfer.effectAllowed = "move";
                                                    }}
                                                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/50 cursor-grab transition-all group"
                                                >
                                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${node.color}`}>
                                                        <node.icon className="h-4 w-4" />
                                                    </div>
                                                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{node.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Canvas */}
                <div className="flex-1 bg-secondary/5 relative" ref={reactFlowWrapper}>
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
                    >
                        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="currentColor" className="text-muted-foreground/10" />
                        <Controls className="!bg-background !border-border !rounded-lg !shadow-sm [&>button]:!bg-background [&>button]:!border-border [&>button:hover]:!bg-secondary !m-4" />
                        <MiniMap
                            className="!bg-background !border-border !rounded-lg !shadow-sm !m-4"
                            nodeColor={() => "hsl(var(--primary))"}
                            maskColor="hsl(var(--background) / 0.9)"
                        />
                    </ReactFlow>
                </div>

                {/* Bottom Log Panel */}
                <AnimatePresence>
                    {showLogs && (
                        <motion.div
                            initial={{ y: 200 }}
                            animate={{ y: 0 }}
                            exit={{ y: 200 }}
                            className="absolute bottom-0 left-0 right-0 z-10 bg-background border-t border-border shadow-2xl"
                        >
                            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
                                <span className="text-xs font-medium">Execution Logs</span>
                                <button onClick={() => setShowLogs(false)} className="p-1 hover:bg-secondary rounded">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                            <div className="h-48 overflow-y-auto bg-black/90 text-mono text-xs p-4 font-mono text-green-400">
                                {executionLogs.length === 0 ? (
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">[info] Waiting for execution...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {executionLogs.map((log, i) => (
                                            <p key={i} className={log.status === "error" ? "text-red-400" : log.status === "running" ? "text-blue-400" : "text-green-400"}>
                                                [{log.status}] {log.nodeName || "System"}: {log.message || "Completed"}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Right Config Panel */}
                <AnimatePresence>
                    {selectedNode && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 320, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="absolute top-0 right-0 bottom-0 bg-background border-l border-border shadow-2xl z-20 flex flex-col"
                        >
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                <h2 className="font-semibold text-sm">Configuration</h2>
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
                            <div className="p-4 overflow-y-auto flex-1 h-[calc(100vh-140px)]">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Node Label</label>
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
                                            className="input mt-1.5 w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</label>
                                        <div className="mt-1 px-3 py-2 rounded-md border border-border bg-secondary/50 text-sm">
                                            {selectedNode.data.type}
                                        </div>
                                    </div>

                                    {selectedNode.data.type === "http_request" && (
                                        <>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">URL</label>
                                                <input
                                                    type="text"
                                                    placeholder="https://api.example.com"
                                                    className="input mt-1 w-full"
                                                    value={selectedNode.data.config?.url || ""}
                                                    onChange={(e) => {
                                                        setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, config: { ...n.data.config, url: e.target.value } } } : n));
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Method</label>
                                                <select
                                                    className="input mt-1 w-full"
                                                    value={selectedNode.data.config?.method || "GET"}
                                                    onChange={(e) => {
                                                        setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, config: { ...n.data.config, method: e.target.value } } } : n));
                                                    }}
                                                >
                                                    <option>GET</option>
                                                    <option>POST</option>
                                                    <option>PUT</option>
                                                    <option>DELETE</option>
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    {selectedNode.data.type === "ai_chat" && (
                                        <>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Model</label>
                                                <select
                                                    className="input mt-1 w-full"
                                                    value={selectedNode.data.config?.model || "gpt-4-turbo-preview"}
                                                    onChange={(e) => {
                                                        setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, config: { ...n.data.config, model: e.target.value } } } : n));
                                                    }}
                                                >
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
                                                    className="input mt-1 min-h-[120px] resize-none w-full"
                                                    value={selectedNode.data.config?.systemPrompt || ""}
                                                    onChange={(e) => {
                                                        setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, config: { ...n.data.config, systemPrompt: e.target.value } } } : n));
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {selectedNode.data.type === "webhook" && (
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Webhook URL</label>
                                            <div className="mt-1 px-3 py-2 rounded-md border border-border bg-secondary/50 text-xs font-mono break-all select-all">
                                                {`${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhook/${selectedNode.id}`}
                                            </div>
                                        </div>
                                    )}

                                    {selectedNode.data.type === "web_scraper" && (
                                        <>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">URL</label>
                                                <input
                                                    type="text"
                                                    placeholder="https://example.com"
                                                    className="input mt-1 w-full"
                                                    value={selectedNode.data.config?.url || ""}
                                                    onChange={(e) => {
                                                        setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, config: { ...n.data.config, url: e.target.value } } } : n));
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">CSS Selector</label>
                                                <input
                                                    type="text"
                                                    placeholder="body, .content, #main"
                                                    className="input mt-1 w-full"
                                                    value={selectedNode.data.config?.selector || ""}
                                                    onChange={(e) => {
                                                        setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, config: { ...n.data.config, selector: e.target.value } } } : n));
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {selectedNode.data.type === "qdrant" && (
                                        <>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Collection Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="knowledge_base"
                                                    className="input mt-1 w-full"
                                                    value={selectedNode.data.config?.collection || ""}
                                                    onChange={(e) => {
                                                        setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, config: { ...n.data.config, collection: e.target.value } } } : n));
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">Action</label>
                                                <select
                                                    className="input mt-1 w-full"
                                                    value={selectedNode.data.config?.action || "upsert"}
                                                    onChange={(e) => {
                                                        setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, config: { ...n.data.config, action: e.target.value } } } : n));
                                                    }}
                                                >
                                                    <option value="upsert">Upsert (Save)</option>
                                                    <option value="search">Search (Retrieve)</option>
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    {/* Default message if no specific config */}
                                    {!["http_request", "ai_chat", "webhook", "web_scraper", "qdrant"].includes(selectedNode.data.type) && (
                                        <div className="p-3 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground">
                                            Configuration options for <strong>{selectedNode.data.type}</strong> are generic.
                                            <div className="mt-2">
                                                <label className="text-xs font-medium text-muted-foreground">Config JSON</label>
                                                <textarea
                                                    className="input mt-1 w-full font-mono text-xs"
                                                    rows={5}
                                                    value={JSON.stringify(selectedNode.data.config || {}, null, 2)}
                                                    onChange={(e) => {
                                                        try {
                                                            const config = JSON.parse(e.target.value);
                                                            setNodes((nds) => nds.map((n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, config } } : n));
                                                        } catch (err) {
                                                            // Ignore invalid JSON while typing
                                                        }
                                                    }}
                                                />
                                            </div>
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
