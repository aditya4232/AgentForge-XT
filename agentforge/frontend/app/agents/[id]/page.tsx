"use client";

import { useEffect, useState, use } from "react";
import { getAgent, updateAgent, runAgent, Agent } from "@/lib/api";
import AgentCanvas from "@/components/AgentCanvas";
import { useRouter } from "next/navigation";

export default function AgentEditorPage({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15: params is a Promise
    const { id } = use(params);
    const router = useRouter();
    const [agent, setAgent] = useState<Agent | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        getAgent(id).then(setAgent).catch(console.error);
    }, [id]);

    const handleSave = async (graph: any) => {
        try {
            await updateAgent(id, { graph });
            alert("Agent saved successfully!");
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save agent.");
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        // Prompt for input
        const input = window.prompt("Enter input for the agent:");
        if (input === null) {
            setIsRunning(false);
            return;
        }

        try {
            // Auto-save before running
            if (agent?.graph) {
                // Ideally we get the latest state from canvas, but valid here if saved.
                // For MVP rely on user saving or use effect sync (simplified here).
            }

            const run = await runAgent(id, { input });
            router.push(`/runs/${run.id}`);
        } catch (error) {
            console.error("Failed to start run", error);
            alert("Failed to start run.");
        } finally {
            setIsRunning(false);
        }
    };

    if (!agent) return <div className="p-8">Loading...</div>;

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col">
            <div className="bg-card border-b border-border p-4 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">{agent.name}</h1>
                    <p className="text-xs text-muted-foreground">{agent.id}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {isRunning ? "Starting..." : "Run Agent"}
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <AgentCanvas initialGraph={agent.graph} onSave={handleSave} />
            </div>
        </div>
    );
}
