'use client'

import { useCallback, useState } from 'react';
import { Navbar } from "@/components/navbar";
import ReactFlow, {
    Node,
    Edge,
    addEdge,
    Background,
    Controls,
    MiniMap,
    Connection,
    useNodesState,
    useEdgesState,
    MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Start' },
        position: { x: 250, y: 25 },
    },
];

const initialEdges: Edge[] = [];

export default function BuilderPage() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const onConnect = useCallback(
        (params: Connection) => {
            const edge = {
                ...params,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                },
            };
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges]
    );

    const addAgentNode = (role: string) => {
        const newNode: Node = {
            id: `${nodes.length + 1}`,
            type: 'default',
            data: {
                label: `${role} Agent`,
                role: role,
            },
            position: {
                x: Math.random() * 400 + 100,
                y: Math.random() * 400 + 100
            },
        };
        setNodes((nds) => [...nds, newNode]);
        toast.success(`Added ${role} Agent`);
    };

    const saveWorkflow = () => {
        const workflow = {
            nodes,
            edges,
        };
        console.log('Saving workflow:', workflow);
        toast.success('Workflow saved successfully!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold mb-2">Visual Agent Builder 🎨</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Drag and drop agents to create your workflow
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Agent Palette */}
                    <div className="col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Agent Palette</CardTitle>
                                <CardDescription>Drag agents onto the canvas</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    onClick={() => addAgentNode('Researcher')}
                                    className="w-full"
                                    variant="outline"
                                >
                                    🔍 Researcher
                                </Button>
                                <Button
                                    onClick={() => addAgentNode('Writer')}
                                    className="w-full"
                                    variant="outline"
                                >
                                    ✍️ Writer
                                </Button>
                                <Button
                                    onClick={() => addAgentNode('Analyst')}
                                    className="w-full"
                                    variant="outline"
                                >
                                    📊 Analyst
                                </Button>
                                <Button
                                    onClick={() => addAgentNode('Coder')}
                                    className="w-full"
                                    variant="outline"
                                >
                                    💻 Coder
                                </Button>
                                <Button
                                    onClick={() => addAgentNode('Reviewer')}
                                    className="w-full"
                                    variant="outline"
                                >
                                    ✅ Reviewer
                                </Button>
                                <Button
                                    onClick={() => addAgentNode('Editor')}
                                    className="w-full"
                                    variant="outline"
                                >
                                    📝 Editor
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button onClick={saveWorkflow} className="w-full">
                                    💾 Save Workflow
                                </Button>
                                <Button variant="outline" className="w-full">
                                    ▶️ Run Workflow
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Canvas */}
                    <div className="col-span-9">
                        <Card className="h-[700px]">
                            <CardContent className="p-0 h-full">
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    onConnect={onConnect}
                                    onNodeClick={(_, node) => setSelectedNode(node)}
                                    fitView
                                >
                                    <Background />
                                    <Controls />
                                    <MiniMap />
                                </ReactFlow>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
