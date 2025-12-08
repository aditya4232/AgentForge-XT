"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { signOut } from "@/lib/firebase";
import {
    Workflow,
    Settings,
    LogOut,
    BarChart3,
    Clock,
    CheckCircle,
    XCircle,
    PlayCircle,
    Loader2,
    RefreshCw,
    ChevronRight,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Workflows", icon: Workflow },
    { href: "/dashboard/executions", label: "Executions", icon: Clock, active: true },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

// Mock execution data - in production, fetch from n8n or database
const mockExecutions = [
    {
        id: "exec-1",
        workflowId: "wf-1",
        workflowName: "Daily Email Report",
        status: "success" as const,
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3598000).toISOString(),
        duration: "2s",
    },
    {
        id: "exec-2",
        workflowId: "wf-2",
        workflowName: "Slack Notification",
        status: "success" as const,
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        completedAt: new Date(Date.now() - 7199500).toISOString(),
        duration: "0.5s",
    },
    {
        id: "exec-3",
        workflowId: "wf-3",
        workflowName: "Data Sync Pipeline",
        status: "failed" as const,
        startedAt: new Date(Date.now() - 10800000).toISOString(),
        completedAt: new Date(Date.now() - 10795000).toISOString(),
        duration: "5s",
        error: "Connection timeout",
    },
    {
        id: "exec-4",
        workflowId: "wf-1",
        workflowName: "Daily Email Report",
        status: "running" as const,
        startedAt: new Date(Date.now() - 30000).toISOString(),
    },
];

interface Execution {
    id: string;
    workflowId: string;
    workflowName: string;
    status: "pending" | "running" | "success" | "failed";
    startedAt: string;
    completedAt?: string;
    duration?: string;
    error?: string;
}

export default function ExecutionsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [executions, setExecutions] = useState<Execution[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "success" | "failed" | "running">("all");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/sign-in");
            return;
        }

        if (user) {
            // TODO: Fetch real executions from n8n API
            setExecutions(mockExecutions);
            setIsLoading(false);
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    const handleRefresh = () => {
        setIsLoading(true);
        // TODO: Refetch from n8n API
        setTimeout(() => {
            setExecutions(mockExecutions);
            setIsLoading(false);
        }, 500);
    };

    const filteredExecutions = executions.filter(exec => {
        if (filter === "all") return true;
        return exec.status === filter;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "success":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "failed":
                return <XCircle className="h-4 w-4 text-red-500" />;
            case "running":
                return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
            default:
                return <PlayCircle className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const classes = {
            success: "bg-green-500/10 text-green-600",
            failed: "bg-red-500/10 text-red-500",
            running: "bg-blue-500/10 text-blue-500",
            pending: "bg-gray-500/10 text-gray-500",
        };
        return classes[status as keyof typeof classes] || classes.pending;
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const stats = {
        total: executions.length,
        success: executions.filter(e => e.status === "success").length,
        failed: executions.filter(e => e.status === "failed").length,
        running: executions.filter(e => e.status === "running").length,
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-56 border-r border-border bg-background z-40">
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                                <Workflow className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="font-semibold">AgentForge</span>
                        </Link>
                    </div>

                    <nav className="flex-1 p-3 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${item.active
                                    ? "bg-secondary text-foreground font-medium"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-3 border-t border-border">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors cursor-pointer group">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                                {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {user.displayName || "User"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-background transition-all"
                                title="Sign out"
                            >
                                <LogOut className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="pl-56">
                <header className="sticky top-0 z-30 border-b border-border bg-background">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <h1 className="text-xl font-semibold">Executions</h1>
                            <p className="text-sm text-muted-foreground">
                                Monitor workflow execution history
                            </p>
                        </div>
                        <button onClick={handleRefresh} className="btn-ghost">
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                        </button>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4">
                        <button
                            onClick={() => setFilter("all")}
                            className={`rounded-lg border p-4 text-left transition-colors ${filter === "all" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                }`}
                        >
                            <p className="text-2xl font-semibold">{stats.total}</p>
                            <p className="text-xs text-muted-foreground">Total Executions</p>
                        </button>
                        <button
                            onClick={() => setFilter("success")}
                            className={`rounded-lg border p-4 text-left transition-colors ${filter === "success" ? "border-green-500 bg-green-500/5" : "border-border hover:border-green-500/50"
                                }`}
                        >
                            <p className="text-2xl font-semibold text-green-600">{stats.success}</p>
                            <p className="text-xs text-muted-foreground">Successful</p>
                        </button>
                        <button
                            onClick={() => setFilter("failed")}
                            className={`rounded-lg border p-4 text-left transition-colors ${filter === "failed" ? "border-red-500 bg-red-500/5" : "border-border hover:border-red-500/50"
                                }`}
                        >
                            <p className="text-2xl font-semibold text-red-500">{stats.failed}</p>
                            <p className="text-xs text-muted-foreground">Failed</p>
                        </button>
                        <button
                            onClick={() => setFilter("running")}
                            className={`rounded-lg border p-4 text-left transition-colors ${filter === "running" ? "border-blue-500 bg-blue-500/5" : "border-border hover:border-blue-500/50"
                                }`}
                        >
                            <p className="text-2xl font-semibold text-blue-500">{stats.running}</p>
                            <p className="text-xs text-muted-foreground">Running</p>
                        </button>
                    </div>

                    {/* Executions List */}
                    <div className="rounded-lg border border-border">
                        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                            <h2 className="text-sm font-medium">
                                {filter === "all" ? "All Executions" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Executions`}
                            </h2>
                            <span className="text-xs text-muted-foreground">{filteredExecutions.length} results</span>
                        </div>
                        <div className="divide-y divide-border">
                            {filteredExecutions.length === 0 ? (
                                <div className="px-4 py-12 text-center">
                                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-sm font-medium mb-1">No executions found</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Execute a workflow to see results here
                                    </p>
                                </div>
                            ) : (
                                filteredExecutions.map((execution) => (
                                    <div
                                        key={execution.id}
                                        className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            {getStatusIcon(execution.status)}
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {execution.workflowName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(execution.startedAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {execution.error && (
                                                <span className="text-xs text-red-500 max-w-[150px] truncate">
                                                    {execution.error}
                                                </span>
                                            )}
                                            {execution.duration && (
                                                <span className="text-xs text-muted-foreground">
                                                    {execution.duration}
                                                </span>
                                            )}
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(execution.status)}`}>
                                                {execution.status}
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
