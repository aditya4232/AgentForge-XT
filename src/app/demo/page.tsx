"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Workflow, ArrowLeft, Play, Zap, GitBranch, Mail, Wand2 } from "lucide-react";

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto max-w-6xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                                <Workflow className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-semibold">AgentForge</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link href="/auth/sign-in" className="btn-ghost text-sm">Sign in</Link>
                            <Link href="/auth/sign-up" className="btn-primary text-sm">Get started</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="py-12 md:py-20">
                <div className="mx-auto max-w-6xl px-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
                        <ArrowLeft className="h-4 w-4" /> Back to home
                    </Link>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground mb-6">
                            <Play className="h-3 w-3" /> Interactive Demo
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">See AgentForge in action</h1>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            Watch how easy it is to build powerful automations with our visual workflow builder.
                        </p>
                    </motion.div>

                    {/* Demo Preview */}
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative rounded-xl border border-border bg-card p-2 shadow-xl mb-16">
                        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
                            <div className="h-3 w-3 rounded-full bg-red-500/80" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                            <div className="h-3 w-3 rounded-full bg-green-500/80" />
                            <span className="ml-3 text-xs text-muted-foreground">workflow-demo.AgentForge.io</span>
                        </div>
                        <div className="relative h-[400px] md:h-[500px] bg-background/50 rounded-b-lg overflow-hidden">
                            <div className="absolute inset-0 bg-dots" />

                            {/* Animated Demo Workflow */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="absolute top-12 left-12 flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-md">
                                <div className="h-10 w-10 rounded-md bg-green-500/10 flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Webhook Trigger</p>
                                    <p className="text-xs text-muted-foreground">POST /api/new-user</p>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="absolute top-12 left-[320px] flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-md">
                                <div className="h-10 w-10 rounded-md bg-purple-500/10 flex items-center justify-center">
                                    <Wand2 className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Transform Data</p>
                                    <p className="text-xs text-muted-foreground">Extract user info</p>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="absolute top-40 left-[200px] flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-md">
                                <div className="h-10 w-10 rounded-md bg-orange-500/10 flex items-center justify-center">
                                    <GitBranch className="h-5 w-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Condition</p>
                                    <p className="text-xs text-muted-foreground">If premium user</p>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }} className="absolute bottom-16 left-[100px] flex items-center gap-3 rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/50 p-3 shadow-md">
                                <div className="h-10 w-10 rounded-md bg-blue-500/10 flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Send Welcome Email</p>
                                    <p className="text-xs text-green-600 dark:text-green-400">✓ Executed</p>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }} className="absolute bottom-16 left-[380px] flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-md opacity-50">
                                <div className="h-10 w-10 rounded-md bg-blue-500/10 flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Send Premium Guide</p>
                                    <p className="text-xs text-muted-foreground">Skipped</p>
                                </div>
                            </motion.div>

                            {/* Connection lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 }} d="M 230 60 L 320 60" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeDasharray="4 2" />
                                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.8 }} d="M 450 80 Q 350 130 320 165" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeDasharray="4 2" />
                                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.0 }} d="M 280 210 Q 200 280 180 340" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeDasharray="4 2" />
                                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.0 }} d="M 340 210 Q 380 280 400 340" stroke="hsl(var(--border))" strokeWidth="2" fill="none" strokeDasharray="4 2" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Instant Triggers</h3>
                            <p className="text-sm text-muted-foreground">React to events in real-time with webhooks and schedules.</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <GitBranch className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Smart Logic</h3>
                            <p className="text-sm text-muted-foreground">Add conditions, loops, and branching to handle any scenario.</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Rich Actions</h3>
                            <p className="text-sm text-muted-foreground">Send emails, make API calls, and connect to any service.</p>
                        </motion.div>
                    </div>

                    {/* CTA */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="text-center mt-16">
                        <Link href="/auth/sign-up" className="btn-primary text-lg px-8 py-3">
                            Start building for free
                        </Link>
                        <p className="text-sm text-muted-foreground mt-4">No credit card required</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                                <Workflow className="h-3 w-3 text-primary-foreground" />
                            </div>
                            <span className="text-sm font-medium">AgentForge</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Built by <a href="https://linkedin.com/in/aditya-shenvi" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">Aditya Shenvi</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
