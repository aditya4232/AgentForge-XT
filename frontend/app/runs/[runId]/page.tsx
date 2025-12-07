"use client";

import { useEffect, useState, use } from "react";
import { getRun, Run } from "@/lib/api";

export default function RunDetailsPage({ params }: { params: Promise<{ runId: string }> }) {
    const { runId } = use(params);
    const [run, setRun] = useState<Run | null>(null);

    useEffect(() => {
        const fetchRun = () => {
            getRun(runId).then(setRun).catch(console.error);
        };

        fetchRun();
        const interval = setInterval(fetchRun, 2000); // Poll every 2s

        return () => clearInterval(interval);
    }, [runId]);

    if (!run) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Run Details</h1>
            <p className="text-muted-foreground mb-8">ID: {run.id}</p>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="bg-card border border-border p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">Status</h3>
                    <div className={`text-2xl font-bold capitalize ${run.status === 'completed' ? 'text-green-500' :
                            run.status === 'failed' ? 'text-red-500' : 'text-yellow-500'
                        }`}>
                        {run.status}
                    </div>
                </div>
                <div className="bg-card border border-border p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">Agent ID</h3>
                    <div className="text-xl">{run.agent_id}</div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Input Data</h3>
                <pre className="bg-muted p-4 rounded overflow-auto text-sm">
                    {JSON.stringify(run.input_data, null, 2)}
                </pre>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Output Data</h3>
                {run.output_data ? (
                    <pre className="bg-muted p-4 rounded overflow-auto text-sm">
                        {JSON.stringify(run.output_data, null, 2)}
                    </pre>
                ) : (
                    <div className="text-muted-foreground italic">No output yet...</div>
                )}
            </div>

            <div>
                <h3 className="text-lg font-bold mb-4">Execution Logs</h3>
                {Array.isArray(run.logs) && run.logs.length > 0 ? (
                    <div className="space-y-2">
                        {run.logs.map((log: any, i: number) => (
                            <div key={i} className="font-mono text-sm border-l-2 border-primary pl-3 py-1">
                                {typeof log === 'string' ? log : JSON.stringify(log)}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-muted-foreground italic">No logs available.</div>
                )}
            </div>
        </div>
    );
}
