"use client";

import { useEffect, useState, use } from "react";
import { getRun, Run } from "@/lib/api";
import Link from "next/link";

export default function RunDetailsPage({ params }: { params: Promise<{ runId: string }> }) {
    const { runId } = use(params);
    const [run, setRun] = useState<Run | null>(null);
    const [polling, setPolling] = useState(true);

    useEffect(() => {
        const fetchRun = () => {
            getRun(runId).then(data => {
                setRun(data);
                // Stop polling when run is complete
                if (data.status === "completed" || data.status === "failed") {
                    setPolling(false);
                }
            }).catch(console.error);
        };

        fetchRun();
        const interval = setInterval(() => {
            if (polling) fetchRun();
        }, 2000);

        return () => clearInterval(interval);
    }, [runId, polling]);

    if (!run) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading run details...</p>
                </div>
            </div>
        );
    }

    const statusConfig = {
        pending: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Pending" },
        running: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Running" },
        completed: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", label: "Completed" },
        failed: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Failed" },
    };

    const status = statusConfig[run.status as keyof typeof statusConfig] || statusConfig.pending;

    return (
        <div className="p-8 max-w-5xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={`/agents/${run.agent_id}`}
                    className="p-2 hover:bg-muted rounded-lg transition"
                    title="Back to agent"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">Run Details</h1>
                    <p className="text-muted-foreground font-mono text-sm">{run.id}</p>
                </div>
                <div className={`px-4 py-2 rounded-full border ${status.bg} ${status.border} flex items-center gap-2`}>
                    {(run.status === "running" || run.status === "pending") && (
                        <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
                    )}
                    <span className={`font-medium ${status.color}`}>{status.label}</span>
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border p-6 rounded-xl">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Status</h3>
                    <div className={`text-2xl font-bold ${status.color} flex items-center gap-2`}>
                        {(run.status === "running" || run.status === "pending") && (
                            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        )}
                        {run.status === "completed" && (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {run.status === "failed" && (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        {status.label}
                    </div>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Agent</h3>
                    <Link
                        href={`/agents/${run.agent_id}`}
                        className="text-lg text-primary hover:underline font-mono"
                    >
                        {run.agent_id.slice(0, 16)}...
                    </Link>
                </div>
                <div className="bg-card border border-border p-6 rounded-xl">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Polling</h3>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${polling ? "bg-green-400 animate-pulse" : "bg-muted-foreground"}`}></span>
                        <span className="text-lg">{polling ? "Active" : "Stopped"}</span>
                    </div>
                </div>
            </div>

            {/* Input Data */}
            <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Input Data
                </h3>
                <pre className="bg-card border border-border p-4 rounded-xl overflow-auto text-sm font-mono">
                    {JSON.stringify(run.input_data, null, 2)}
                </pre>
            </div>

            {/* Output Data */}
            <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Output Data
                </h3>
                {run.output_data ? (
                    <pre className="bg-card border border-border p-4 rounded-xl overflow-auto text-sm font-mono">
                        {JSON.stringify(run.output_data, null, 2)}
                    </pre>
                ) : (
                    <div className="bg-card border border-border border-dashed p-8 rounded-xl text-center text-muted-foreground">
                        {run.status === "running" || run.status === "pending" ? (
                            <div className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                                Processing...
                            </div>
                        ) : (
                            "No output data"
                        )}
                    </div>
                )}
            </div>

            {/* Execution Logs */}
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Execution Logs
                </h3>
                {Array.isArray(run.logs) && run.logs.length > 0 ? (
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        {run.logs.map((log: any, i: number) => (
                            <div
                                key={i}
                                className="font-mono text-sm border-l-4 border-primary/50 pl-4 py-3 px-4 hover:bg-muted/50 transition"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <span className="text-muted-foreground mr-3">{i + 1}.</span>
                                {typeof log === 'string' ? log : JSON.stringify(log)}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-card border border-border border-dashed p-8 rounded-xl text-center text-muted-foreground">
                        {run.status === "running" || run.status === "pending"
                            ? "Logs will appear here as the agent executes..."
                            : "No logs recorded"
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
