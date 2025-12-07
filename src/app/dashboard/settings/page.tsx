"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { signOut } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Workflow, Settings, LogOut, BarChart3, Clock, Loader2, User, Bell, Shield, Key, Save, Check, Moon, Sun, Mail, Globe } from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Workflows", icon: Workflow },
    { href: "/dashboard/executions", label: "Executions", icon: Clock },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, active: true },
];

const settingsTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API Keys", icon: Key },
    { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [notifications, setNotifications] = useState({ email: true, browser: false, slack: false });

    useEffect(() => { if (!loading && !user) router.push("/auth/sign-in"); }, [user, loading, router]);
    const handleSignOut = async () => { await signOut(); router.push("/"); };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

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
                            <button onClick={handleSignOut} className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-background"><LogOut className="h-4 w-4 text-muted-foreground" /></button>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="pl-56">
                <header className="sticky top-0 z-30 border-b border-border bg-background">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div><h1 className="text-xl font-semibold">Settings</h1><p className="text-sm text-muted-foreground">Manage your account and preferences</p></div>
                        <button onClick={handleSave} disabled={isSaving} className="btn-primary text-sm">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                            {saved ? "Saved!" : "Save changes"}
                        </button>
                    </div>
                </header>

                <div className="p-6">
                    <div className="flex gap-6">
                        {/* Settings Tabs */}
                        <div className="w-48 space-y-1">
                            {settingsTabs.map((tab) => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left transition-colors ${activeTab === tab.id ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                                    <tab.icon className="h-4 w-4" />{tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Settings Content */}
                        <div className="flex-1 max-w-2xl">
                            {activeTab === "profile" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <div className="rounded-lg border border-border p-6">
                                        <h2 className="text-sm font-medium mb-4">Profile Information</h2>
                                        <div className="flex items-center gap-4 mb-6">
                                            {user.photoURL ? <img src={user.photoURL} alt="" className="h-16 w-16 rounded-full" /> : <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-medium">{user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}</div>}
                                            <div><p className="font-medium">{user.displayName || "User"}</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="text-xs font-medium text-muted-foreground">Display Name</label><input type="text" defaultValue={user.displayName || ""} className="input mt-1" /></div>
                                            <div><label className="text-xs font-medium text-muted-foreground">Email</label><input type="email" defaultValue={user.email || ""} disabled className="input mt-1 opacity-50" /></div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-border p-6">
                                        <h2 className="text-sm font-medium mb-4">Appearance</h2>
                                        <div className="flex items-center justify-between">
                                            <div><p className="text-sm font-medium">Dark Mode</p><p className="text-xs text-muted-foreground">Toggle dark/light theme</p></div>
                                            <div className="flex items-center gap-2 p-1 rounded-lg bg-secondary">
                                                <button className="p-2 rounded-md bg-background"><Moon className="h-4 w-4" /></button>
                                                <button className="p-2 rounded-md text-muted-foreground"><Sun className="h-4 w-4" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "notifications" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-border p-6 space-y-4">
                                    <h2 className="text-sm font-medium mb-4">Notification Preferences</h2>
                                    {[{ key: "email", label: "Email Notifications", desc: "Receive updates via email", icon: Mail },
                                    { key: "browser", label: "Browser Notifications", desc: "Get push notifications", icon: Globe },
                                    { key: "slack", label: "Slack Notifications", desc: "Send to Slack channel", icon: Bell }
                                    ].map(({ key, label, desc, icon: Icon }) => (
                                        <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                                            <div className="flex items-center gap-3"><Icon className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div></div>
                                            <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))} className={`w-11 h-6 rounded-full transition-colors ${notifications[key as keyof typeof notifications] ? "bg-primary" : "bg-secondary"}`}>
                                                <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications[key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"}`} />
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === "api" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-border p-6">
                                    <h2 className="text-sm font-medium mb-4">API Keys</h2>
                                    <p className="text-sm text-muted-foreground mb-4">Use API keys to authenticate with the FlowForge API.</p>
                                    <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Your API Key</p></div>
                                        <code className="text-sm font-mono">ff_••••••••••••••••</code>
                                    </div>
                                    <button className="btn-secondary text-sm">Generate New Key</button>
                                </motion.div>
                            )}

                            {activeTab === "security" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <div className="rounded-lg border border-border p-6">
                                        <h2 className="text-sm font-medium mb-4">Connected Accounts</h2>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                                <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full bg-white flex items-center justify-center"><svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg></div><span className="text-sm">Google</span></div>
                                                <span className="badge badge-success">Connected</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-red-200 dark:border-red-900 p-6">
                                        <h2 className="text-sm font-medium text-red-500 mb-2">Danger Zone</h2>
                                        <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all data.</p>
                                        <button className="px-4 py-2 rounded-md text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">Delete Account</button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
