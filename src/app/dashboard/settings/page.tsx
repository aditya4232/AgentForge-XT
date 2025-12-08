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
    Key,
    Server,
    Bot,
    Save,
    CheckCircle,
    XCircle,
    Loader2,
    RefreshCw,
    ExternalLink,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Workflows", icon: Workflow },
    { href: "/dashboard/executions", label: "Executions", icon: Clock },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, active: true },
];

interface ServiceStatus {
    n8n: 'checking' | 'connected' | 'disconnected' | 'error';
    ai: 'checking' | 'configured' | 'not-configured';
}

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
        n8n: 'checking',
        ai: 'checking',
    });

    // Settings state
    const [settings, setSettings] = useState({
        openaiKey: '',
        n8nUrl: 'http://localhost:5678',
        notifications: true,
        autoSave: true,
        darkMode: true,
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/sign-in");
            return;
        }
        checkServiceStatus();
    }, [user, loading, router]);

    const checkServiceStatus = async () => {
        // Check n8n status
        try {
            const n8nRes = await fetch('/api/n8n');
            const n8nData = await n8nRes.json();
            setServiceStatus(prev => ({
                ...prev,
                n8n: n8nData.status === 'connected' ? 'connected' : 'disconnected',
            }));
        } catch {
            setServiceStatus(prev => ({ ...prev, n8n: 'error' }));
        }

        // Check AI status
        try {
            const aiRes = await fetch('/api/ai');
            const aiData = await aiRes.json();
            setServiceStatus(prev => ({
                ...prev,
                ai: aiData.configured ? 'configured' : 'not-configured',
            }));
        } catch {
            setServiceStatus(prev => ({ ...prev, ai: 'not-configured' }));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            // In a real app, save settings to database
            await new Promise(resolve => setTimeout(resolve, 500));
            setSaveMessage('Settings saved successfully!');
        } catch (error) {
            setSaveMessage('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

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
                        <h1 className="text-xl font-semibold">Settings</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your account and configure integrations
                        </p>
                    </div>
                </header>

                <div className="p-6 space-y-8 max-w-3xl">
                    {/* Service Status */}
                    <section className="rounded-lg border border-border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Server className="h-5 w-5" />
                                Service Status
                            </h2>
                            <button
                                onClick={checkServiceStatus}
                                className="btn-ghost text-sm"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                                        <Workflow className="h-4 w-4 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">n8n Automation Engine</p>
                                        <p className="text-xs text-muted-foreground">{settings.n8nUrl}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {serviceStatus.n8n === 'checking' && (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                    {serviceStatus.n8n === 'connected' && (
                                        <span className="flex items-center gap-1 text-green-600 text-sm">
                                            <CheckCircle className="h-4 w-4" />
                                            Connected
                                        </span>
                                    )}
                                    {serviceStatus.n8n === 'disconnected' && (
                                        <span className="flex items-center gap-1 text-red-500 text-sm">
                                            <XCircle className="h-4 w-4" />
                                            Disconnected
                                        </span>
                                    )}
                                    <a
                                        href={settings.n8nUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded-md hover:bg-background transition-colors"
                                    >
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">AI Services (OpenAI)</p>
                                        <p className="text-xs text-muted-foreground">GPT-4, Embeddings</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {serviceStatus.ai === 'checking' && (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                    {serviceStatus.ai === 'configured' && (
                                        <span className="flex items-center gap-1 text-green-600 text-sm">
                                            <CheckCircle className="h-4 w-4" />
                                            Configured
                                        </span>
                                    )}
                                    {serviceStatus.ai === 'not-configured' && (
                                        <span className="flex items-center gap-1 text-amber-500 text-sm">
                                            <XCircle className="h-4 w-4" />
                                            Not Configured
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* API Keys */}
                    <section className="rounded-lg border border-border p-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Key className="h-5 w-5" />
                            API Keys
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Configure your API keys for external services. Keys are stored securely.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    OpenAI API Key
                                </label>
                                <input
                                    type="password"
                                    value={settings.openaiKey}
                                    onChange={(e) => setSettings({ ...settings, openaiKey: e.target.value })}
                                    placeholder="sk-..."
                                    className="input w-full"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Required for AI features. Get your key from{' '}
                                    <a
                                        href="https://platform.openai.com/api-keys"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        OpenAI Platform
                                    </a>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    n8n URL
                                </label>
                                <input
                                    type="text"
                                    value={settings.n8nUrl}
                                    onChange={(e) => setSettings({ ...settings, n8nUrl: e.target.value })}
                                    placeholder="http://localhost:5678"
                                    className="input w-full"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    URL of your n8n instance for workflow execution
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Preferences */}
                    <section className="rounded-lg border border-border p-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Settings className="h-5 w-5" />
                            Preferences
                        </h2>

                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium">Auto-save workflows</p>
                                    <p className="text-xs text-muted-foreground">
                                        Automatically save changes while editing
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.autoSave}
                                    onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                                    className="toggle"
                                />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium">Email notifications</p>
                                    <p className="text-xs text-muted-foreground">
                                        Receive notifications about workflow executions
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                                    className="toggle"
                                />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium">Dark mode</p>
                                    <p className="text-xs text-muted-foreground">
                                        Use dark theme for the interface
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.darkMode}
                                    onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                                    className="toggle"
                                />
                            </label>
                        </div>
                    </section>

                    {/* Save Button */}
                    <div className="flex items-center justify-between">
                        {saveMessage && (
                            <p className={`text-sm ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                                {saveMessage}
                            </p>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-primary ml-auto"
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Save Settings
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
