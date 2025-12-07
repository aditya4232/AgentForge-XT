"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { signOut } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Workflow, Settings, LogOut, BarChart3, Clock, Loader2, TrendingUp, Activity, Zap, Calendar, ArrowUp, ArrowDown } from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Workflows", icon: Workflow },
    { href: "/dashboard/executions", label: "Executions", icon: Clock },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, active: true },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const weeklyData = [
    { day: "Mon", executions: 45, success: 43 },
    { day: "Tue", executions: 52, success: 50 },
    { day: "Wed", executions: 38, success: 37 },
    { day: "Thu", executions: 67, success: 64 },
    { day: "Fri", executions: 55, success: 52 },
    { day: "Sat", executions: 23, success: 22 },
    { day: "Sun", executions: 18, success: 18 },
];

const topWorkflows = [
    { name: "Slack Notification", executions: 156, successRate: 98.5 },
    { name: "Daily Report Generator", executions: 89, successRate: 96.2 },
    { name: "GitHub Issue to Notion", executions: 45, successRate: 91.1 },
];

export default function AnalyticsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => { if (!loading && !user) router.push("/auth/sign-in"); }, [user, loading, router]);
    const handleSignOut = async () => { await signOut(); router.push("/"); };
    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    if (!user) return null;

    const maxExec = Math.max(...weeklyData.map(d => d.executions));

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
                            <button onClick={handleSignOut} className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-background"><LogOut className="h-4 w-4 text-muted-foreground" /></button>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="pl-56">
                <header className="sticky top-0 z-30 border-b border-border bg-background">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div><h1 className="text-xl font-semibold">Analytics</h1><p className="text-sm text-muted-foreground">Track your automation performance</p></div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" />Last 7 days</div>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border p-4">
                            <div className="flex items-center justify-between mb-2"><Activity className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-green-500 flex items-center"><ArrowUp className="h-3 w-3" />12%</span></div>
                            <p className="text-2xl font-semibold">298</p><p className="text-xs text-muted-foreground">Total Executions</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-lg border border-border p-4">
                            <div className="flex items-center justify-between mb-2"><TrendingUp className="h-4 w-4 text-green-500" /><span className="text-xs text-green-500 flex items-center"><ArrowUp className="h-3 w-3" />2.5%</span></div>
                            <p className="text-2xl font-semibold">96.8%</p><p className="text-xs text-muted-foreground">Success Rate</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-lg border border-border p-4">
                            <div className="flex items-center justify-between mb-2"><Zap className="h-4 w-4 text-yellow-500" /><span className="text-xs text-red-500 flex items-center"><ArrowDown className="h-3 w-3" />5%</span></div>
                            <p className="text-2xl font-semibold">2.3s</p><p className="text-xs text-muted-foreground">Avg Duration</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-lg border border-border p-4">
                            <div className="flex items-center justify-between mb-2"><Workflow className="h-4 w-4 text-muted-foreground" /></div>
                            <p className="text-2xl font-semibold">3</p><p className="text-xs text-muted-foreground">Active Workflows</p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Weekly Chart */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-lg border border-border p-6">
                            <h2 className="text-sm font-medium mb-6">Weekly Executions</h2>
                            <div className="h-48 flex items-end justify-between gap-2">
                                {weeklyData.map((day, i) => (
                                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex flex-col items-center gap-1" style={{ height: "160px" }}>
                                            <div className="w-full bg-primary/20 rounded-t relative" style={{ height: `${(day.executions / maxExec) * 100}%` }}>
                                                <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t" style={{ height: `${(day.success / day.executions) * 100}%` }} />
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{day.day}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-primary" />Success</span>
                                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-primary/20" />Failed</span>
                            </div>
                        </motion.div>

                        {/* Top Workflows */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-lg border border-border p-6">
                            <h2 className="text-sm font-medium mb-6">Top Workflows</h2>
                            <div className="space-y-4">
                                {topWorkflows.map((wf, i) => (
                                    <div key={wf.name} className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">{i + 1}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{wf.name}</p>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span>{wf.executions} runs</span>
                                                <span className="text-green-500">{wf.successRate}% success</span>
                                            </div>
                                        </div>
                                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full" style={{ width: `${wf.successRate}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
