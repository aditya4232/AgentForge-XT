"use client";

import { useEffect, useState, useCallback } from "react";
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
    Eye,
    EyeOff,
    Database,
    Globe,
    AlertCircle,
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
    supabase: 'checking' | 'connected' | 'disconnected';
}

interface SettingsState {
    // OpenAI / AI Settings
    openaiApiKey: string;
    openaiBaseUrl: string;
    openaiModel: string;
    // n8n Settings
    n8nUrl: string;
    n8nApiKey: string;
    // Qdrant Settings
    qdrantUrl: string;
    qdrantApiKey: string;
    // Preferences
    autoSave: boolean;
    notifications: boolean;
    darkMode: boolean;
}

const AI_MODELS = [
    { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
];

const COMPATIBLE_PROVIDERS = [
    { name: 'OpenAI', url: 'https://api.openai.com/v1' },
    { name: 'Azure OpenAI', url: 'https://YOUR_RESOURCE.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT/v1' },
    { name: 'Ollama', url: 'http://localhost:11434/v1' },
    { name: 'LocalAI', url: 'http://localhost:8080/v1' },
    { name: 'OpenRouter', url: 'https://openrouter.ai/api/v1' },
    { name: 'Groq', url: 'https://api.groq.com/openai/v1' },
    { name: 'Together AI', url: 'https://api.together.xyz/v1' },
];

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showApiKey, setShowApiKey] = useState(false);
    const [showN8nKey, setShowN8nKey] = useState(false);
    const [testingService, setTestingService] = useState<string | null>(null);

    const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
        n8n: 'checking',
        ai: 'checking',
        supabase: 'checking',
    });

    const [settings, setSettings] = useState<SettingsState>({
        openaiApiKey: '',
        openaiBaseUrl: 'https://api.openai.com/v1',
        openaiModel: 'gpt-4-turbo-preview',
        n8nUrl: 'http://localhost:5678',
        n8nApiKey: '',
        qdrantUrl: 'http://localhost:6333',
        qdrantApiKey: '',
        autoSave: true,
        notifications: true,
        darkMode: true,
    });

    const loadSettings = useCallback(async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/settings', {
                headers: {
                    'x-user-id': user.uid,
                    'x-user-email': user.email || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setSettings({
                    openaiApiKey: data.settings.openai_api_key || '',
                    openaiBaseUrl: data.settings.openai_base_url || 'https://api.openai.com/v1',
                    openaiModel: data.settings.openai_default_model || 'gpt-4-turbo-preview',
                    n8nUrl: data.settings.n8n_url || 'http://localhost:5678',
                    n8nApiKey: data.settings.n8n_api_key || '',
                    qdrantUrl: data.settings.qdrant_url || 'http://localhost:6333',
                    qdrantApiKey: data.settings.qdrant_api_key || '',
                    autoSave: data.settings.auto_save ?? true,
                    notifications: data.settings.notifications_enabled ?? true,
                    darkMode: data.settings.theme === 'dark',
                });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const checkServiceStatus = useCallback(async () => {
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

        // Check Supabase (just check if URL is configured)
        setServiceStatus(prev => ({
            ...prev,
            supabase: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'connected' : 'disconnected',
        }));
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/sign-in");
            return;
        }
        if (user) {
            loadSettings();
            checkServiceStatus();
        }
    }, [user, loading, router, loadSettings, checkServiceStatus]);

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        setSaveMessage(null);

        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user.uid,
                    'x-user-email': user.email || '',
                },
                body: JSON.stringify({
                    openai_api_key: settings.openaiApiKey,
                    openai_base_url: settings.openaiBaseUrl,
                    openai_default_model: settings.openaiModel,
                    n8n_url: settings.n8nUrl,
                    n8n_api_key: settings.n8nApiKey,
                    qdrant_url: settings.qdrantUrl,
                    qdrant_api_key: settings.qdrantApiKey,
                    auto_save: settings.autoSave,
                    notifications_enabled: settings.notifications,
                    theme: settings.darkMode ? 'dark' : 'light',
                }),
            });

            if (response.ok) {
                setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
                checkServiceStatus();
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            setSaveMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setIsSaving(false);
        }
    };

    const testOpenAIConnection = async () => {
        setTestingService('openai');
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'test-openai',
                    config: {
                        apiKey: settings.openaiApiKey,
                        baseUrl: settings.openaiBaseUrl,
                    },
                }),
            });

            const data = await response.json();
            if (data.success) {
                setSaveMessage({ type: 'success', text: `Connected! Found ${data.models?.length || 0} models.` });
            } else {
                setSaveMessage({ type: 'error', text: `Connection failed: ${data.error}` });
            }
        } catch {
            setSaveMessage({ type: 'error', text: 'Failed to test connection' });
        } finally {
            setTestingService(null);
        }
    };

    const testN8nConnection = async () => {
        setTestingService('n8n');
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'test-n8n',
                    config: {
                        url: settings.n8nUrl,
                        apiKey: settings.n8nApiKey,
                    },
                }),
            });

            const data = await response.json();
            if (data.success) {
                setSaveMessage({ type: 'success', text: 'n8n connection successful!' });
            } else {
                setSaveMessage({ type: 'error', text: `n8n connection failed: ${data.error}` });
            }
        } catch {
            setSaveMessage({ type: 'error', text: 'Failed to test n8n connection' });
        } finally {
            setTestingService(null);
        }
    };

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
                            Manage your API keys, integrations, and preferences
                        </p>
                    </div>
                </header>

                <div className="p-6 space-y-8 max-w-4xl">
                    {/* Save Message */}
                    {saveMessage && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg ${saveMessage.type === 'success'
                                ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                            {saveMessage.type === 'success' ? (
                                <CheckCircle className="h-4 w-4" />
                            ) : (
                                <AlertCircle className="h-4 w-4" />
                            )}
                            <span className="text-sm">{saveMessage.text}</span>
                        </div>
                    )}

                    {/* Service Status */}
                    <section className="rounded-lg border border-border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Server className="h-5 w-5" />
                                Service Status
                            </h2>
                            <button
                                onClick={checkServiceStatus}
                                className="btn-ghost text-sm flex items-center gap-1"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            {/* n8n Status */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                                        <Workflow className="h-4 w-4 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">n8n</p>
                                        <p className="text-xs text-muted-foreground">Automation</p>
                                    </div>
                                </div>
                                <StatusBadge status={serviceStatus.n8n} />
                            </div>

                            {/* AI Status */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">AI</p>
                                        <p className="text-xs text-muted-foreground">OpenAI</p>
                                    </div>
                                </div>
                                <StatusBadge status={serviceStatus.ai} />
                            </div>

                            {/* Supabase Status */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-md bg-green-500/10 flex items-center justify-center">
                                        <Database className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Supabase</p>
                                        <p className="text-xs text-muted-foreground">Database</p>
                                    </div>
                                </div>
                                <StatusBadge status={serviceStatus.supabase} />
                            </div>
                        </div>
                    </section>

                    {/* AI Configuration */}
                    <section className="rounded-lg border border-border p-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Bot className="h-5 w-5" />
                            AI Configuration
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Configure your AI provider. Supports OpenAI and OpenAI-compatible APIs (Azure, Ollama, LocalAI, OpenRouter, etc.)
                        </p>

                        <div className="space-y-4">
                            {/* API Key */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    API Key <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showApiKey ? "text" : "password"}
                                        value={settings.openaiApiKey}
                                        onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                                        placeholder="sk-... or your API key"
                                        className="input w-full pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Get your key from{' '}
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

                            {/* Base URL */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Base URL
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={settings.openaiBaseUrl}
                                        onChange={(e) => setSettings({ ...settings, openaiBaseUrl: e.target.value })}
                                        placeholder="https://api.openai.com/v1"
                                        className="input flex-1"
                                    />
                                    <button
                                        onClick={testOpenAIConnection}
                                        disabled={testingService === 'openai' || !settings.openaiApiKey}
                                        className="btn-secondary whitespace-nowrap"
                                    >
                                        {testingService === 'openai' ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>Test Connection</>
                                        )}
                                    </button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {COMPATIBLE_PROVIDERS.map((provider) => (
                                        <button
                                            key={provider.name}
                                            onClick={() => setSettings({ ...settings, openaiBaseUrl: provider.url })}
                                            className={`text-xs px-2 py-1 rounded-md transition-colors ${settings.openaiBaseUrl === provider.url
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
                                                }`}
                                        >
                                            {provider.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Model Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Default Model
                                </label>
                                <select
                                    value={settings.openaiModel}
                                    onChange={(e) => setSettings({ ...settings, openaiModel: e.target.value })}
                                    className="input w-full"
                                >
                                    {AI_MODELS.map((model) => (
                                        <option key={model.value} value={model.value}>
                                            {model.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* n8n Configuration */}
                    <section className="rounded-lg border border-border p-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Globe className="h-5 w-5" />
                            n8n Automation
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Connect to your n8n instance for workflow automation.
                            <a
                                href="https://n8n.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline ml-1"
                            >
                                Learn more about n8n
                            </a>
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    n8n Instance URL
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={settings.n8nUrl}
                                        onChange={(e) => setSettings({ ...settings, n8nUrl: e.target.value })}
                                        placeholder="http://localhost:5678"
                                        className="input flex-1"
                                    />
                                    <button
                                        onClick={testN8nConnection}
                                        disabled={testingService === 'n8n'}
                                        className="btn-secondary whitespace-nowrap"
                                    >
                                        {testingService === 'n8n' ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>Test</>
                                        )}
                                    </button>
                                    <a
                                        href={settings.n8nUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-ghost"
                                        title="Open n8n"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    n8n API Key (optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type={showN8nKey ? "text" : "password"}
                                        value={settings.n8nApiKey}
                                        onChange={(e) => setSettings({ ...settings, n8nApiKey: e.target.value })}
                                        placeholder="n8n_api_..."
                                        className="input w-full pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowN8nKey(!showN8nKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showN8nKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Get from n8n: Settings → API → Create API Key
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Vector Database */}
                    <section className="rounded-lg border border-border p-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Database className="h-5 w-5" />
                            Vector Database (Qdrant)
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Configure Qdrant for RAG and semantic search features.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Qdrant URL
                                </label>
                                <input
                                    type="text"
                                    value={settings.qdrantUrl}
                                    onChange={(e) => setSettings({ ...settings, qdrantUrl: e.target.value })}
                                    placeholder="http://localhost:6333"
                                    className="input w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Qdrant API Key (optional)
                                </label>
                                <input
                                    type="password"
                                    value={settings.qdrantApiKey}
                                    onChange={(e) => setSettings({ ...settings, qdrantApiKey: e.target.value })}
                                    placeholder="Your Qdrant API key"
                                    className="input w-full"
                                />
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
                    <div className="flex items-center justify-end gap-4 sticky bottom-0 bg-background py-4 border-t border-border -mx-6 px-6">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-primary"
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

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'checking':
            return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
        case 'connected':
        case 'configured':
            return (
                <span className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle className="h-3 w-3" />
                    Connected
                </span>
            );
        case 'disconnected':
        case 'not-configured':
            return (
                <span className="flex items-center gap-1 text-amber-500 text-xs">
                    <XCircle className="h-3 w-3" />
                    Not Set
                </span>
            );
        case 'error':
            return (
                <span className="flex items-center gap-1 text-red-500 text-xs">
                    <XCircle className="h-3 w-3" />
                    Error
                </span>
            );
        default:
            return null;
    }
}
