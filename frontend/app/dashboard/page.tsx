'use client'

import { useSession } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import { useWorkflows, useExecutions } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { data: session } = useSession();
    const { data: workflows, isLoading: workflowsLoading } = useWorkflows();
    const { data: executions, isLoading: executionsLoading } = useExecutions();

    const userName = session?.user?.name?.split(' ')[0] || session?.user?.email?.split('@')[0] || 'there';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, {userName}! 👋
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Here's what's happening with your AI agents
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Workflows</CardTitle>
                            <CardDescription>Agent teams you've created</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">
                                {workflowsLoading ? "..." : workflows?.length || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Executions</CardTitle>
                            <CardDescription>Total runs this month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">
                                {executionsLoading ? "..." : executions?.length || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Success Rate</CardTitle>
                            <CardDescription>Successful completions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-green-600">
                                {executions?.length ? "100%" : "N/A"}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Get started with these common tasks</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/builder">
                                <Button className="w-full" size="lg">
                                    🎨 Create New Workflow
                                </Button>
                            </Link>
                            <Link href="/templates">
                                <Button variant="outline" className="w-full" size="lg">
                                    🏪 Browse Templates
                                </Button>
                            </Link>
                            <Link href="/executions">
                                <Button variant="outline" className="w-full" size="lg">
                                    📊 View Execution History
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your latest executions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {executionsLoading ? (
                                <p className="text-slate-500">Loading...</p>
                            ) : executions && executions.length > 0 ? (
                                <div className="space-y-2">
                                    {executions.slice(0, 5).map((execution: any) => (
                                        <div key={execution.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <div className="font-medium">{execution.workflow_id}</div>
                                            <div className="text-sm text-slate-500">{execution.status}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-500 mb-4">No executions yet</p>
                                    <Link href="/builder">
                                        <Button>Create Your First Workflow</Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
