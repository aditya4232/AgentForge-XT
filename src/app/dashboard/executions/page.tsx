"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { signOut } from "@/lib/firebase";
import { motion } from "framer-motion";
import {
    Workflow, Settings, LogOut, BarChart3, Clock, CheckCircle, XCircle,
    Loader2, Play, RefreshCw, Filter, Calendar, ChevronRight, AlertCircle,
} from "lucide-react";

const mockExecutions = [
    { id: "exec-1", workflow_name: "Slack Notification", status: "success", started_at: "2024-12-07T10:30:00Z", duration: "2s", nodes_executed: 3 },
    { id: "exec-2", workflow_name: "Daily Report Generator", status: "success", started_at: "2024-12-07T09:00:00Z", duration: "15s", nodes_executed: 5 },
    { id: "exec-3", workflow_name: "GitHub Issue to Notion", status: "failed", started_at: "2024-12-07T08:45:00Z", duration: "3s", nodes_executed: 2, error: "HTTP 401: Unauthorized" },
    { id: "exec-4", workflow_name: "Slack Notification", status: "success", started_at: "2024-12-07T08:15:00Z", duration: "1s", nodes_executed: 3 },
    { id: "exec-5", workflow_name: "Daily Report Generator", status: "running", started_at: "2024-12-07T12:00:00Z", duration: "-", nodes_executed: 2 },
];

const navItems = [
    { href: "/dashboard", label: "Workflows", icon: Workflow },
    { href: "/dashboard/executions", label: "Executions", icon: Clock, active: true },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    success: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10", label: "Success" },
    failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", label: "Failed" },
    running: { icon: Loader2, color: "text-blue-500", bg: "bg-blue-500/10", label: "Running" },
};

export default function ExecutionsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [filter, setFilter] = useState<string>("all");
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => { if (!loading && !user) router.push("/auth/sign-in"); }, [user, loading, router]);

    const handleSignOut = async () => { await signOut(); router.push("/"); };
    const handleRefresh = async () => { setIsRefreshing(true); await new Promise(r => setTimeout(r, 1000)); setIsRefreshing(false); };
    const filteredExecutions = mockExecutions.filter(e => filter === "all" || e.status === filter);

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <aside className="fixed left-0 top-0 bottom-0 w-56 border-r border-border bg-background z-40">
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary"><Workflow className="h-4 w-4 text-primary-foreground" /></div>
                            <span className="font-semibold">FlowForge</span>
                        </Link>
                    </div>
                    <nav className="flex-1 p-3 space-y-1">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${item.active ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                                <item.icon className="h-4 w-4" />{item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-3 border-t border-border">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors cursor-pointer group">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">{user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}</div>
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{user.displayName || "User"}</p></div>
                            <button onClick={handleSignOut} className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-background" title="Sign out"><LogOut className="h-4 w-4 text-muted-foreground" /></button>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="pl-56">
                <header className="sticky top-0 z-30 border-b border-border bg-background">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div><h1 className="text-xl font-semibold">Executions</h1><p className="text-sm text-muted-foreground">View workflow execution history</p></div>
                        <button onClick={handleRefresh} disabled={isRefreshing} className="btn-secondary text-sm"><RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />Refresh</button>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="rounded-lg border border-border p-4"><Play className="h-4 w-4 text-muted-foreground mb-2" /><p className="text-2xl font-semibold">{mockExecutions.length}</p><p className="text-xs text-muted-foreground">Total</p></div>
                        <div className="rounded-lg border border-border p-4"><CheckCircle className="h-4 w-4 text-green-500 mb-2" /><p className="text-2xl font-semibold">{mockExecutions.filter(e => e.status === "success").length}</p><p className="text-xs text-muted-foreground">Successful</p></div>
                        <div className="rounded-lg border border-border p-4"><XCircle className="h-4 w-4 text-red-500 mb-2" /><p className="text-2xl font-semibold">{mockExecutions.filter(e => e.status === "failed").length}</p><p className="text-xs text-muted-foreground">Failed</p></div>
                        <div className="rounded-lg border border-border p-4"><Clock className="h-4 w-4 text-blue-500 mb-2" /><p className="text-2xl font-semibold">{mockExecutions.filter(e => e.status === "running").length}</p><p className="text-xs text-muted-foreground">Running</p></div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground mr-2">Filter:</span>
                        {["all", "success", "failed", "running"].map((s) => (
                            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                        ))}
                    </div>

                    <div className="rounded-lg border border-border">
                        <div className="px-4 py-3 border-b border-border"><h2 className="text-sm font-medium">Recent Executions</h2></div>
                        <div className="divide-y divide-border">
                            {filteredExecutions.map((exec, i) => {
                                const status = statusConfig[exec.status] || statusConfig.success;
                                const StatusIcon = status.icon;
                                return (
                                    <motion.div key={exec.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-md flex items-center justify-center ${status.bg}`}><StatusIcon className={`h-4 w-4 ${status.color} ${exec.status === "running" ? "animate-spin" : ""}`} /></div>
                                            <div><p className="text-sm font-medium">{exec.workflow_name}</p><div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{new Date(exec.started_at).toLocaleString()}</div></div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {exec.error && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{exec.error}</span>}
                                            <span className="text-sm">{exec.duration}</span>
                                            <span className={`badge ${exec.status === "success" ? "badge-success" : exec.status === "failed" ? "bg-red-500/10 text-red-500" : "badge-secondary"}`}>{status.label}</span>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
