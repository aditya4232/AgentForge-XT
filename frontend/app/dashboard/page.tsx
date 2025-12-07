"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAgents } from "@/lib/api";

export default function DashboardPage() {
    const [stats, setStats] = useState({ agents: 0, runs: 0 });

    useEffect(() => {
        getAgents().then(agents => {
            setStats(s => ({ ...s, agents: agents.length }));
        }).catch(console.error);
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <h3 className="text-muted-foreground text-sm font-medium">Total Agents</h3>
                    <div className="text-4xl font-bold mt-2">{stats.agents}</div>
                </div>
                <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <h3 className="text-muted-foreground text-sm font-medium">Active Runs</h3>
                    <div className="text-4xl font-bold mt-2 text-green-500">-</div>
                    <p className="text-xs text-muted-foreground mt-1">Check Runs page</p>
                </div>
                <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
                    <h3 className="text-muted-foreground text-sm font-medium">System Health</h3>
                    <div className="text-4xl font-bold mt-2 text-blue-500">99.9%</div>
                </div>
            </div>

            <div className="flex gap-4">
                <Link href="/agents/new" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition">
                    + Create New Agent
                </Link>
                <Link href="/agents" className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/80 transition">
                    View All Agents
                </Link>
            </div>
        </div>
    );
}
