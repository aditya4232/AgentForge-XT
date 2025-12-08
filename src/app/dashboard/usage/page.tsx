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
    Zap,
    Activity,
    Database,
    Loader2,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Calendar,
    Cpu,
    HardDrive,
    Server,
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
    { href: "/dashboard", label: "Workflows", icon: Workflow },
    { href: "/dashboard/executions", label: "Executions", icon: Clock },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/usage", label: "Usage", icon: Activity, active: true },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface UsageData {
    aiCalls: { today: number; week: number; month: number; limit: number };
    workflows: { active: number; total: number; limit: number };
    executions: { today: number; week: number; month: number };
    storage: { used: number; limit: number };
    dailyUsage: { date: string; calls: number; executions: number }[];
}

// Mock usage data - in production, fetch from API
const mockUsage: UsageData = {
    aiCalls: { today: 45, week: 312, month: 1247, limit: 5000 },
    workflows: { active: 3, total: 8, limit: 10 },
    executions: { today: 23, week: 156, month: 623 },
    storage: { used: 12.5, limit: 50 }, // MB
    dailyUsage: [
        { date: "Mon", calls: 45, executions: 23 },
        { date: "Tue", calls: 52, executions: 31 },
        { date: "Wed", calls: 38, executions: 18 },
        { date: "Thu", calls: 61, executions: 29 },
        { date: "Fri", calls: 55, executions: 25 },
        { date: "Sat", calls: 23, executions: 12 },
        { date: "Sun", calls: 38, executions: 18 },
    ],
};

export default function UsagePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [usage, setUsage] = useState<UsageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/sign-in");
            return;
        }

        if (user) {
            // TODO: Fetch real usage data from API
            setTimeout(() => {
                setUsage(mockUsage);
                setIsLoading(false);
            }, 500);
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

    if (!user || !usage) return null;

    const aiUsagePercent = (usage.aiCalls.month / usage.aiCalls.limit) * 100;
    const workflowUsagePercent = (usage.workflows.total / usage.workflows.limit) * 100;
    const storagePercent = (usage.storage.used / usage.storage.limit) * 100;
    const maxDailyCalls = Math.max(...usage.dailyUsage.map(d => d.calls));

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
                                <p className="text-sm font-medium truncate">{user.displayName || "User"}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-background transition-all"
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
                        <h1 className="text-xl font-semibold">Usage & Limits</h1>
                        <p className="text-sm text-muted-foreground">
                            Monitor your API usage, workflows, and storage
                        </p>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* Free Tier Warning */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3"
                    >
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                Free Tier Limits
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Your workflows and data are automatically deleted after 15 days of inactivity.
                                Upgrade to Pro for unlimited retention.
                            </p>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-xl border border-border p-4 bg-gradient-to-br from-violet-500/5 to-purple-500/5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <Cpu className="h-5 w-5 text-violet-500" />
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600">
                                    {timeRange === "day" ? "Today" : timeRange === "week" ? "This Week" : "This Month"}
                                </span>
                            </div>
                            <p className="text-2xl font-bold">
                                {timeRange === "day" ? usage.aiCalls.today : timeRange === "week" ? usage.aiCalls.week : usage.aiCalls.month}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">AI API Calls</p>
                            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${aiUsagePercent > 80 ? "bg-red-500" : aiUsagePercent > 50 ? "bg-amber-500" : "bg-violet-500"
                                        }`}
                                    style={{ width: `${Math.min(aiUsagePercent, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {usage.aiCalls.month.toLocaleString()} / {usage.aiCalls.limit.toLocaleString()} monthly
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-xl border border-border p-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <Workflow className="h-5 w-5 text-blue-500" />
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${workflowUsagePercent > 80 ? "bg-red-500/10 text-red-600" : "bg-blue-500/10 text-blue-600"
                                    }`}>
                                    {usage.workflows.active} Active
                                </span>
                            </div>
                            <p className="text-2xl font-bold">{usage.workflows.total}</p>
                            <p className="text-xs text-muted-foreground mt-1">Total Workflows</p>
                            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${workflowUsagePercent > 80 ? "bg-red-500" : "bg-blue-500"
                                        }`}
                                    style={{ width: `${Math.min(workflowUsagePercent, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {usage.workflows.total} / {usage.workflows.limit} max
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="rounded-xl border border-border p-4 bg-gradient-to-br from-green-500/5 to-emerald-500/5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <Zap className="h-5 w-5 text-green-500" />
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                                    <TrendingUp className="h-3 w-3 inline mr-1" />
                                    +12%
                                </span>
                            </div>
                            <p className="text-2xl font-bold">
                                {timeRange === "day" ? usage.executions.today : timeRange === "week" ? usage.executions.week : usage.executions.month}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Executions</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="rounded-xl border border-border p-4 bg-gradient-to-br from-orange-500/5 to-amber-500/5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <HardDrive className="h-5 w-5 text-orange-500" />
                            </div>
                            <p className="text-2xl font-bold">{usage.storage.used.toFixed(1)} MB</p>
                            <p className="text-xs text-muted-foreground mt-1">Storage Used</p>
                            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${storagePercent > 80 ? "bg-red-500" : "bg-orange-500"
                                        }`}
                                    style={{ width: `${Math.min(storagePercent, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {usage.storage.used.toFixed(1)} / {usage.storage.limit} MB
                            </p>
                        </motion.div>
                    </div>

                    {/* Time Range Selector + Chart */}
                    <div className="rounded-xl border border-border p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">Usage Over Time</h2>
                            <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
                                {(["day", "week", "month"] as const).map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeRange === range
                                                ? "bg-background shadow text-foreground"
                                                : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {range.charAt(0).toUpperCase() + range.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="flex items-end justify-between h-48 gap-2">
                            {usage.dailyUsage.map((day, i) => (
                                <motion.div
                                    key={day.date}
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex-1 flex flex-col items-center gap-2"
                                    style={{ originY: 1 }}
                                >
                                    <div className="w-full flex flex-col gap-1 h-40 justify-end">
                                        <div
                                            className="w-full bg-gradient-to-t from-violet-500 to-purple-400 rounded-t transition-all hover:opacity-80"
                                            style={{
                                                height: `${(day.calls / maxDailyCalls) * 100}%`,
                                            }}
                                            title={`${day.calls} API calls`}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{day.date}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex items-center justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded bg-gradient-to-t from-violet-500 to-purple-400" />
                                <span className="text-xs text-muted-foreground">API Calls</span>
                            </div>
                        </div>
                    </div>

                    {/* Data Retention Notice */}
                    <div className="rounded-xl border border-border p-6">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <Calendar className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">Data Retention Policy</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    To optimize resources on our free tier, workflows and execution data are automatically
                                    archived after 15 days of inactivity. Active workflows with recent executions are preserved.
                                </p>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 rounded-lg bg-secondary/50">
                                        <p className="text-lg font-semibold text-foreground">15 days</p>
                                        <p className="text-xs text-muted-foreground">Inactive workflow retention</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-secondary/50">
                                        <p className="text-lg font-semibold text-foreground">7 days</p>
                                        <p className="text-xs text-muted-foreground">Execution logs retention</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-secondary/50">
                                        <p className="text-lg font-semibold text-foreground">∞</p>
                                        <p className="text-xs text-muted-foreground">Pro plan retention</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
