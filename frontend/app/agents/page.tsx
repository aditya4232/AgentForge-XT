"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAgents, Agent } from "@/lib/api";

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getAgents()
            .then(setAgents)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Agents</h1>
                    <p className="text-muted-foreground">
                        {loading ? "Loading..." : `${agents.length} agent${agents.length !== 1 ? 's' : ''} total`}
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search agents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-card border border-border rounded-xl px-4 py-2 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                        />
                        <svg className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <Link
                        href="/agents/new"
                        className="bg-primary text-primary-foreground px-5 py-2 rounded-xl font-medium hover:bg-primary/90 transition flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Agent
                    </Link>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-card border border-border p-6 rounded-xl animate-pulse">
                            <div className="flex justify-between mb-4">
                                <div className="h-6 bg-muted rounded w-1/2"></div>
                                <div className="h-6 bg-muted rounded w-16"></div>
                            </div>
                            <div className="h-4 bg-muted rounded w-full mb-2"></div>
                            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-muted rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            ) : filteredAgents.length === 0 ? (
                <div className="bg-card border border-border border-dashed p-16 rounded-xl text-center">
                    {searchQuery ? (
                        <>
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No results found</h3>
                            <p className="text-muted-foreground">Try a different search term</p>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No agents yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Create your first agent to start building AI workflows
                            </p>
                            <Link
                                href="/agents/new"
                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Your First Agent
                            </Link>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgents.map((agent, index) => (
                        <Link
                            key={agent.id}
                            href={`/agents/${agent.id}`}
                            className="group animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="bg-card border border-border p-6 rounded-xl card-hover h-full flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold group-hover:text-primary transition line-clamp-1">
                                        {agent.name}
                                    </h3>
                                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded shrink-0 ml-2">
                                        {agent.id.slice(0, 8)}
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-4 flex-1 line-clamp-3 text-sm">
                                    {agent.description || "No description provided."}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <span className="text-xs text-muted-foreground">
                                        {agent.updated_at
                                            ? `Updated ${new Date(agent.updated_at).toLocaleDateString()}`
                                            : "New Agent"
                                        }
                                    </span>
                                    <span className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                                        Edit
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
