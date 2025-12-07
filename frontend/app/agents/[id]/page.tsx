"use client";

import { useEffect, useState, use } from "react";
import { getAgent, updateAgent, runAgent, Agent } from "@/lib/api";
import AgentCanvas from "@/components/AgentCanvas";
import { useRouter } from "next/navigation";

export default function AgentEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [agent, setAgent] = useState<Agent | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    useEffect(() => {
        getAgent(id).then(setAgent).catch(console.error);
    }, [id]);

    const handleSave = async (graph: any) => {
        setIsSaving(true);
        try {
            await updateAgent(id, { graph });
            setLastSaved(new Date());
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save agent. Check console for details.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRun = async () => {
        const input = window.prompt("Enter input for the agent:");
        if (input === null) return;

        setIsRunning(true);
        try {
            const run = await runAgent(id, { input });
            router.push(`/runs/${run.id}`);
        } catch (error) {
            console.error("Failed to start run", error);
            alert("Failed to start run. Is the backend running?");
        } finally {
            setIsRunning(false);
        }
    };

    if (!agent) {
        return (
            <div className="h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading agent...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col">
            {/* Toolbar */}
            <div className="bg-card border-b border-border px-6 py-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/agents")}
                        className="p-2 hover:bg-muted rounded-lg transition"
                        title="Back to agents"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-lg font-bold">{agent.name}</h1>
                        <p className="text-xs text-muted-foreground font-mono">{agent.id.slice(0, 16)}...</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Save Status */}
                    <span className="text-xs text-muted-foreground">
                        {isSaving ? (
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                Saving...
                            </span>
                        ) : lastSaved ? (
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                Saved {lastSaved.toLocaleTimeString()}
                            </span>
                        ) : null}
                    </span>

                    {/* Run Button */}
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {isRunning ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Starting...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Run Agent
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-hidden bg-background">
                <AgentCanvas initialGraph={agent.graph} onSave={handleSave} />
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-card border-t border-border px-6 py-2 flex justify-between items-center text-xs text-muted-foreground shrink-0">
                <div className="flex items-center gap-4">
                    <span>Nodes: {agent.graph?.nodes?.length || 0}</span>
                    <span>Edges: {agent.graph?.edges?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>Connected to backend</span>
                </div>
            </div>
        </div>
    );
}
