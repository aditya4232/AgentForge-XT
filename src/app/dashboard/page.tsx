"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { signOut } from "@/lib/firebase";
import {
    Workflow,
    Plus,
    Play,
    Settings,
    LogOut,
    BarChart3,
    Clock,
    Zap,
    MoreHorizontal,
    Search,
    Loader2,
    ChevronRight,
} from "lucide-react";

// Mock data
const workflows = [
    {
        id: "1",
        name: "Slack Notification on New User",
        description: "Send a welcome message when a new user signs up",
        is_active: true,
        updated_at: "2024-12-07T10:30:00Z",
        executions: 156,
    },
    {
        id: "2",
        name: "Daily Report Generator",
        description: "Generate and email daily analytics report",
        is_active: true,
        updated_at: "2024-12-06T18:00:00Z",
        executions: 30,
    },
    {
        id: "3",
        name: "GitHub Issue to Notion",
        description: "Sync GitHub issues to Notion database",
        is_active: false,
        updated_at: "2024-12-05T09:15:00Z",
        executions: 89,
    },
];

const stats = [
    { label: "Total Workflows", value: "3", icon: Workflow },
    { label: "Active", value: "2", icon: Zap },
    { label: "Executions", value: "275", icon: Play },
    { label: "Success Rate", value: "98%", icon: BarChart3 },
];

const navItems = [
    { href: "/dashboard", label: "Workflows", icon: Workflow, active: true },
    { href: "/dashboard/executions", label: "Executions", icon: Clock },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/sign-in");
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-56 border-r border-border bg-background z-40">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-4 border-b border-border">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                                <Workflow className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="font-semibold">FlowForge</span>
                        </Link>
                    </div>

                    {/* Navigation */}
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

                    {/* User */}
                    <div className="p-3 border-t border-border">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors cursor-pointer group">
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || "User"}
                                    className="h-8 w-8 rounded-full"
                                />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                                    {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                </div>
                            )}
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
                {/* Header */}
                <header className="sticky top-0 z-30 border-b border-border bg-background">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <h1 className="text-xl font-semibold">Workflows</h1>
                            <p className="text-sm text-muted-foreground">
                                Manage your automation workflows
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="input pl-9 w-48"
                                />
                            </div>
                            <Link href="/workflow/new" className="btn-primary">
                                <Plus className="h-4 w-4" />
                                New workflow
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="rounded-lg border border-border p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-2xl font-semibold">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Workflows */}
                    <div className="rounded-lg border border-border">
                        <div className="px-4 py-3 border-b border-border">
                            <h2 className="text-sm font-medium">Your Workflows</h2>
                        </div>
                        <div className="divide-y divide-border">
                            {workflows.map((workflow) => (
                                <Link
                                    key={workflow.id}
                                    href={`/workflow/${workflow.id}`}
                                    className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className={`h-8 w-8 rounded-md flex items-center justify-center ${workflow.is_active
                                                    ? "bg-green-500/10 text-green-600"
                                                    : "bg-secondary text-muted-foreground"
                                                }`}
                                        >
                                            <Workflow className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                                {workflow.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {workflow.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-muted-foreground">
                                                {workflow.executions} runs
                                            </p>
                                        </div>
                                        <span
                                            className={`badge ${workflow.is_active ? "badge-success" : "badge-secondary"
                                                }`}
                                        >
                                            {workflow.is_active ? "Active" : "Inactive"}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Empty state */}
                    {workflows.length === 0 && (
                        <div className="rounded-lg border border-dashed border-border p-12 text-center">
                            <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center mx-auto mb-4">
                                <Workflow className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium mb-2">No workflows yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Create your first workflow to start automating
                            </p>
                            <Link href="/workflow/new" className="btn-primary">
                                <Plus className="h-4 w-4" />
                                Create workflow
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
