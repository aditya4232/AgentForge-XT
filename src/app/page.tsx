"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Zap,
    Workflow,
    ArrowRight,
    Play,
    Code2,
    Layers,
    GitBranch,
    Clock,
    ChevronRight,
} from "lucide-react";

const features = [
    {
        icon: Workflow,
        title: "Visual Builder",
        description: "Drag and drop nodes to create automation workflows without code.",
    },
    {
        icon: Zap,
        title: "Instant Execution",
        description: "Run workflows instantly with real-time logs and monitoring.",
    },
    {
        icon: GitBranch,
        title: "Conditional Logic",
        description: "Add if/else conditions and loops to handle complex scenarios.",
    },
    {
        icon: Code2,
        title: "Custom Code",
        description: "Write custom JavaScript when you need more flexibility.",
    },
    {
        icon: Layers,
        title: "Integrations",
        description: "Connect to popular apps via HTTP requests and webhooks.",
    },
    {
        icon: Clock,
        title: "Scheduling",
        description: "Schedule workflows to run automatically on a cron schedule.",
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
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

                        <div className="hidden md:flex items-center gap-6">
                            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Features
                            </Link>
                            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Pricing
                            </Link>
                            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Docs
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/auth/sign-in" className="btn-ghost text-sm">
                                Sign in
                            </Link>
                            <Link href="/auth/sign-up" className="btn-primary text-sm">
                                Get started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative py-20 md:py-32">
                <div className="absolute inset-0 bg-grid opacity-50" />
                <div className="relative mx-auto max-w-6xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-green-500" />
                            Open source workflow automation
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Automate your workflows
                            <br />
                            <span className="text-muted-foreground">with visual builder</span>
                        </h1>

                        <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-8">
                            Build powerful automation workflows visually. Connect apps,
                            transform data, and automate repetitive tasks without writing code.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href="/auth/sign-up" className="btn-primary">
                                Start building <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/demo" className="btn-secondary">
                                <Play className="h-4 w-4" /> View demo
                            </Link>
                        </div>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-16 md:mt-24"
                    >
                        <div className="relative rounded-xl border border-border bg-card p-2 shadow-lg">
                            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
                                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                                <span className="ml-3 text-xs text-muted-foreground">workflow-editor</span>
                            </div>
                            <div className="relative h-[300px] md:h-[400px] bg-background/50 rounded-b-lg overflow-hidden">
                                <div className="absolute inset-0 bg-dots" />

                                {/* Mock workflow nodes */}
                                <div className="absolute top-8 left-8 flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
                                    <div className="h-8 w-8 rounded-md bg-green-500/10 flex items-center justify-center">
                                        <Zap className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Webhook Trigger</p>
                                        <p className="text-xs text-muted-foreground">POST /api/webhook</p>
                                    </div>
                                </div>

                                <div className="absolute top-8 left-1/3 flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
                                    <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                                        <Code2 className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Transform Data</p>
                                        <p className="text-xs text-muted-foreground">JSON mapping</p>
                                    </div>
                                </div>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
                                    <div className="h-8 w-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                                        <GitBranch className="h-4 w-4 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Condition</p>
                                        <p className="text-xs text-muted-foreground">If status = 200</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-8 right-8 flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
                                    <div className="h-8 w-8 rounded-md bg-purple-500/10 flex items-center justify-center">
                                        <Workflow className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Send Notification</p>
                                        <p className="text-xs text-muted-foreground">Slack #general</p>
                                    </div>
                                </div>

                                {/* Connection lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <path
                                        d="M 230 50 Q 280 80 320 50"
                                        stroke="hsl(var(--border))"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeDasharray="4 4"
                                    />
                                    <path
                                        d="M 450 70 Q 480 150 400 180"
                                        stroke="hsl(var(--border))"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeDasharray="4 4"
                                    />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 border-t border-border">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Everything you need to automate
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Powerful features to help you build, deploy, and monitor
                            automation workflows at any scale.
                        </p>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                variants={item}
                                className="group rounded-lg border border-border p-6 hover:border-foreground/20 transition-colors"
                            >
                                <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <feature.icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 border-t border-border">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="rounded-xl border border-border bg-card p-8 md:p-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            Ready to automate?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Start building your first workflow in minutes. No credit card required.
                        </p>
                        <Link href="/auth/sign-up" className="btn-primary">
                            Get started for free <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
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
                            Built by{" "}
                            <a
                                href="https://linkedin.com/in/aditya-shenvi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-4 hover:text-foreground"
                            >
                                Aditya Shenvi
                            </a>
                            {" "}• Final Year Project 2024
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
