"use client";

import { useCallback, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
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

const initialNodes: Node[] = [
    {
        id: "1",
        type: "custom",
        position: { x: 100, y: 150 },
        data: { label: "On Chat Message", type: "chat_trigger" },
    },
    {
        id: "2",
        type: "custom",
        position: { x: 400, y: 150 },
        data: { label: "AI Agent", type: "ai_agent" },
    },
    {
        id: "3",
        type: "custom",
        position: { x: 700, y: 150 },
        data: { label: "Slack", type: "slack" },
    },
];

const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
];

export default function WorkflowEditorPage() {
    const params = useParams();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [showNodePanel, setShowNodePanel] = useState(false);
    const [workflowName, setWorkflowName] = useState("AI Agent Workflow");
    const [isSaving, setIsSaving] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [activeTab, setActiveTab] = useState("editor");
    const [isWorkflowActive, setIsWorkflowActive] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

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
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const workflowData = {
                name: workflowName,
                nodes: nodes,
                edges: edges,
                is_active: isWorkflowActive,
                updated_at: new Date().toISOString(),
            };

            console.log("Saved workflow:", workflowData);
            await new Promise((r) => setTimeout(r, 800));
        } catch (error) {
            console.error("Error saving workflow:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleExecute = async () => {
        setIsExecuting(true);
        setShowLogs(true);
        for (const node of nodes) {
            setNodes((nds) =>
                nds.map((n) =>
                    n.id === node.id ? { ...n, data: { ...n.data, status: "running" } } : n
                )
            );
            await new Promise((r) => setTimeout(r, 600));
            setNodes((nds) =>
                nds.map((n) =>
                    n.id === node.id ? { ...n, data: { ...n.data, status: "success" } } : n
                )
            );
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
                                <div className="space-y-1">
                                    <p>[info] Workflow initialized</p>
                                    <p>[info] Loading nodes...</p>
                                    <p>[success] Nodes connected successfully</p>
                                    <p className="text-blue-400">[debug] Executing workflow...</p>
                                    <p className="text-green-500">[success] Workflow completed</p>
                                </div>
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
                            <div className="p-4 overflow-y-auto flex-1">
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
                                    <div className="p-3 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground">
                                        Configuration for <strong>{selectedNode.data.type}</strong> will appear here.
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
