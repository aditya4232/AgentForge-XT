"use client";

import React, { useCallback } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Connection,
    Edge,
    Node,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
    { id: '1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Input Node' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: 'LLM Processing' } },
];
const initialEdges: Edge[] = [];

interface AgentCanvasProps {
    initialGraph?: any;
    onSave?: (graph: any) => void;
}

export default function AgentCanvas({ initialGraph, onSave }: AgentCanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph?.nodes || initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph?.edges || initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const handleSave = () => {
        if (onSave) {
            onSave({ nodes, edges });
        }
    };

    return (
        <div className="h-full w-full flex flex-col">
            <div className="p-2 border-b border-border bg-card flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-medium">Canvas Editor</span>
                <button onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-1 rounded text-sm hover:bg-primary/90 transition">
                    Save Graph
                </button>
            </div>
            <div className="flex-1 min-h-[500px] border border-border rounded shadow-inner bg-slate-900/10">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    className="bg-background"
                >
                    <Controls />
                    <MiniMap />
                    <Background gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    );
}
