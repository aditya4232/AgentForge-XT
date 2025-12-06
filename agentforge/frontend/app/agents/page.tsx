"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAgents, Agent } from "@/lib/api";

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);

    useEffect(() => {
        getAgents().then(setAgents).catch(console.error);
    }, []);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Agents</h1>
                <Link href="/agents/new" className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition">
                    Create Agent
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map(agent => (
                    <Link key={agent.id} href={`/agents/${agent.id}`} className="block group">
                        <div className="bg-card border border-border p-6 rounded-lg shadow-sm hover:border-primary transition h-full flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold group-hover:text-primary transition">{agent.name}</h3>
                                <span className="text-xs text-muted-foreground font-mono bg-accent px-2 py-1 rounded">{agent.id.slice(0, 8)}</span>
                            </div>
                            <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">
                                {agent.description || "No description provided."}
                            </p>
                            <div className="text-sm text-muted-foreground">
                                {agent.updated_at ? `Updated: ${new Date(agent.updated_at).toLocaleDateString()}` : 'New Agent'}
                            </div>
                        </div>
                    </Link>
                ))}

                {agents.length === 0 && (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                        No agents found. Create your first agent to get started!
                    </div>
                )}
            </div>
        </div>
    );
}
