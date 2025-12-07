"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAgents, Agent } from "@/lib/api";

export default function DashboardPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [healthStatus, setHealthStatus] = useState<"ok" | "error" | "loading">("loading");

    useEffect(() => {
        // Fetch agents
        getAgents()
            .then(setAgents)
            .catch(console.error)
            .finally(() => setLoading(false));

        // Check backend health
        fetch(process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") + "/health" || "http://localhost:8000/health")
            .then(res => res.ok ? setHealthStatus("ok") : setHealthStatus("error"))
            .catch(() => setHealthStatus("error"));
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Your agent control center</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-card border border-border p-6 rounded-xl card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-muted-foreground text-sm font-medium">Total Agents</span>
                        <span className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </span>
                    </div>
                    <div className="text-4xl font-bold">{loading ? "—" : agents.length}</div>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-muted-foreground text-sm font-medium">Active Runs</span>
                        <span className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                    </div>
                    <div className="text-4xl font-bold text-green-400">—</div>
                    <p className="text-xs text-muted-foreground mt-2">Real-time coming soon</p>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-muted-foreground text-sm font-medium">Success Rate</span>
                        <span className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </span>
                    </div>
                    <div className="text-4xl font-bold text-purple-400">—%</div>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-muted-foreground text-sm font-medium">System Status</span>
                        <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${healthStatus === "ok" ? "bg-green-500/10" :
                                healthStatus === "error" ? "bg-red-500/10" : "bg-yellow-500/10"
                            }`}>
                            <span className={`w-3 h-3 rounded-full ${healthStatus === "ok" ? "bg-green-400 animate-pulse" :
                                    healthStatus === "error" ? "bg-red-400" : "bg-yellow-400 animate-pulse"
                                }`}></span>
                        </span>
                    </div>
                    <div className={`text-2xl font-bold ${healthStatus === "ok" ? "text-green-400" :
                            healthStatus === "error" ? "text-red-400" : "text-yellow-400"
                        }`}>
                        {healthStatus === "ok" ? "Online" : healthStatus === "error" ? "Offline" : "Checking..."}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/agents/new"
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Agent
                    </Link>
                    <Link
                        href="/agents"
                        className="bg-secondary text-secondary-foreground px-6 py-3 rounded-xl font-medium hover:bg-secondary/80 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        View All Agents
                    </Link>
                    <a
                        href="http://localhost:3001"
                        target="_blank"
                        className="bg-secondary text-secondary-foreground px-6 py-3 rounded-xl font-medium hover:bg-secondary/80 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Open Grafana
                    </a>
                </div>
            </div>

            {/* Recent Agents */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Recent Agents</h2>
                    <Link href="/agents" className="text-sm text-primary hover:underline">
                        View all →
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-card border border-border p-6 rounded-xl animate-pulse">
                                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                <div className="h-4 bg-muted rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : agents.length === 0 ? (
                    <div className="bg-card border border-border border-dashed p-12 rounded-xl text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No agents yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first agent to get started</p>
                        <Link
                            href="/agents/new"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
                        >
                            Create Agent
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {agents.slice(0, 3).map((agent, index) => (
                            <Link
                                key={agent.id}
                                href={`/agents/${agent.id}`}
                                className="bg-card border border-border p-6 rounded-xl card-hover group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-semibold text-lg group-hover:text-primary transition">
                                        {agent.name}
                                    </h3>
                                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                        {agent.id.slice(0, 8)}
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm line-clamp-2">
                                    {agent.description || "No description"}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
