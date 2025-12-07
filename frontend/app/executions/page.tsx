'use client'

import { Navbar } from "@/components/navbar";
import { useExecutions } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MOCK_EXECUTIONS = [
    {
        id: '1',
        workflow_name: 'Blog Writer Team',
        status: 'completed',
        started_at: '2025-12-07T10:30:00Z',
        duration: '2m 34s',
        tokens_used: 1250,
    },
    {
        id: '2',
        workflow_name: 'Code Review Team',
        status: 'running',
        started_at: '2025-12-07T11:15:00Z',
        duration: '1m 12s',
        tokens_used: 890,
    },
    {
        id: '3',
        workflow_name: 'Market Research Team',
        status: 'completed',
        started_at: '2025-12-07T09:45:00Z',
        duration: '3m 45s',
        tokens_used: 2100,
    },
    {
        id: '4',
        workflow_name: 'Customer Support Team',
        status: 'failed',
        started_at: '2025-12-07T08:20:00Z',
        duration: '0m 45s',
        tokens_used: 320,
        error: 'API rate limit exceeded',
    },
];

export default function ExecutionsPage() {
    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            completed: { variant: 'default', className: 'bg-green-500' },
            running: { variant: 'default', className: 'bg-blue-500' },
            failed: { variant: 'destructive' },
            pending: { variant: 'secondary' },
        };
        return variants[status] || variants.pending;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Execution History 📊</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Track and monitor your agent workflow executions
                    </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{MOCK_EXECUTIONS.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">75%</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">2m 19s</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">4,560</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Executions List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Executions</CardTitle>
                        <CardDescription>View details and logs for each execution</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {MOCK_EXECUTIONS.map((execution) => (
                                <div
                                    key={execution.id}
                                    className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-lg">{execution.workflow_name}</h3>
                                            <p className="text-sm text-slate-500">
                                                Started: {new Date(execution.started_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <Badge {...getStatusBadge(execution.status)}>
                                            {execution.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-500">Duration:</span>
                                            <span className="ml-2 font-medium">{execution.duration}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">Tokens:</span>
                                            <span className="ml-2 font-medium">{execution.tokens_used}</span>
                                        </div>
                                        <div className="text-right">
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>

                                    {execution.status === 'failed' && (
                                        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-200">
                                            Error: {(execution as any).error}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
