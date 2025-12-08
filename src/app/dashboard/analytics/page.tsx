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
    TrendingUp,
    Activity,
    CheckCircle,
    XCircle,
    Loader2,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Workflows", icon: Workflow },
    { href: "/dashboard/executions", label: "Executions", icon: Clock },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, active: true },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

// Mock analytics data
const mockAnalytics = {
    totalExecutions: 1247,
    successRate: 94.2,
    avgExecutionTime: "2.3s",
    activeWorkflows: 8,
    weeklyData: [
        { day: "Mon", executions: 45, success: 42 },
        { day: "Tue", executions: 52, success: 50 },
        { day: "Wed", executions: 38, success: 35 },
        { day: "Thu", executions: 61, success: 58 },
        { day: "Fri", executions: 55, success: 52 },
        { day: "Sat", executions: 23, success: 22 },
        { day: "Sun", executions: 18, success: 17 },
    ],
    topWorkflows: [
        { name: "Daily Email Report", executions: 312, successRate: 98.1 },
        { name: "Slack Notification", executions: 256, successRate: 99.2 },
        { name: "Data Sync Pipeline", executions: 189, successRate: 87.3 },
        { name: "Lead Processing", executions: 143, successRate: 95.8 },
        { name: "Backup Workflow", executions: 120, successRate: 100 },
    ],
};

export default function AnalyticsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/sign-in");
            return;
        }

        if (user) {
            // TODO: Fetch real analytics from API
            setIsLoading(false);
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
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

    const maxExecutions = Math.max(...mockAnalytics.weeklyData.map(d => d.executions));

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
                    <div className="px-6 py-4">
                        <h1 className="text-xl font-semibold">Analytics</h1>
                        <p className="text-sm text-muted-foreground">
                            Monitor performance and usage metrics
                        </p>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="rounded-lg border border-border p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Total Executions</span>
                            </div>
                            <p className="text-2xl font-semibold">{mockAnalytics.totalExecutions.toLocaleString()}</p>
                            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3" />
                                +12% from last month
                            </p>
                        </div>
                        <div className="rounded-lg border border-border p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Success Rate</span>
                            </div>
                            <p className="text-2xl font-semibold text-green-600">{mockAnalytics.successRate}%</p>
                            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3" />
                                +2.1% from last month
                            </p>
                        </div>
                        <div className="rounded-lg border border-border p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Avg. Execution Time</span>
                            </div>
                            <p className="text-2xl font-semibold">{mockAnalytics.avgExecutionTime}</p>
                            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3" />
                                -0.5s from last month
                            </p>
                        </div>
                        <div className="rounded-lg border border-border p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Workflow className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Active Workflows</span>
                            </div>
                            <p className="text-2xl font-semibold">{mockAnalytics.activeWorkflows}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Running 24/7
                            </p>
                        </div>
                    </div>

                    {/* Weekly Chart */}
                    <div className="rounded-lg border border-border p-6">
                        <h2 className="text-lg font-semibold mb-4">Weekly Executions</h2>
                        <div className="flex items-end justify-between h-48 gap-2">
                            {mockAnalytics.weeklyData.map((data) => (
                                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col gap-1" style={{ height: "160px" }}>
                                        <div
                                            className="w-full bg-red-500/20 rounded-t"
                                            style={{
                                                height: `${((data.executions - data.success) / maxExecutions) * 100}%`,
                                            }}
                                        />
                                        <div
                                            className="w-full bg-green-500 rounded-b"
                                            style={{
                                                height: `${(data.success / maxExecutions) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{data.day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-4 justify-center">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded bg-green-500" />
                                <span className="text-xs text-muted-foreground">Success</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded bg-red-500/20" />
                                <span className="text-xs text-muted-foreground">Failed</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Workflows */}
                    <div className="rounded-lg border border-border">
                        <div className="px-4 py-3 border-b border-border">
                            <h2 className="text-lg font-semibold">Top Workflows</h2>
                        </div>
                        <div className="divide-y divide-border">
                            {mockAnalytics.topWorkflows.map((workflow, index) => (
                                <div key={workflow.name} className="flex items-center justify-between px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-muted-foreground w-6">
                                            #{index + 1}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium">{workflow.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {workflow.executions} executions
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${workflow.successRate >= 95
                                                        ? "bg-green-500"
                                                        : workflow.successRate >= 80
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                    }`}
                                                style={{ width: `${workflow.successRate}%` }}
                                            />
                                        </div>
                                        <span className={`text-sm font-medium ${workflow.successRate >= 95
                                                ? "text-green-600"
                                                : workflow.successRate >= 80
                                                    ? "text-yellow-600"
                                                    : "text-red-500"
                                            }`}>
                                            {workflow.successRate}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
