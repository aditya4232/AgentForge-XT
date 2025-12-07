"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Workflow, Book, Code2, Zap, GitBranch, Clock, Send, Mail, Filter, Wand2, ChevronRight, Search, Play, ArrowLeft } from "lucide-react";

const sections = [
    {
        id: "getting-started",
        title: "Getting Started",
        icon: Zap,
        articles: [
            { title: "Quick Start Guide", description: "Create your first workflow in 5 minutes" },
            { title: "Understanding Workflows", description: "Learn the basics of workflow automation" },
            { title: "Authentication", description: "Set up your account with Google or GitHub" },
        ],
    },
    {
        id: "nodes",
        title: "Node Reference",
        icon: GitBranch,
        articles: [
            { title: "Trigger Nodes", description: "Webhook, Schedule, and Manual triggers" },
            { title: "Action Nodes", description: "HTTP Request, Email, Delay actions" },
            { title: "Logic Nodes", description: "Conditions, Loops, and Switches" },
            { title: "Data Nodes", description: "Transform, Filter, and Merge data" },
        ],
    },
    {
        id: "api",
        title: "API Reference",
        icon: Code2,
        articles: [
            { title: "Authentication", description: "API keys and authentication methods" },
            { title: "Workflows API", description: "Create, update, and delete workflows" },
            { title: "Executions API", description: "Trigger and monitor workflow runs" },
            { title: "Webhooks", description: "External webhook integration" },
        ],
    },
];

const nodeTypes = [
    { type: "Webhook", icon: Zap, category: "Trigger", description: "Trigger workflow via HTTP request" },
    { type: "Schedule", icon: Clock, category: "Trigger", description: "Run on a cron schedule" },
    { type: "HTTP Request", icon: Send, category: "Action", description: "Make API calls" },
    { type: "Email", icon: Mail, category: "Action", description: "Send email notifications" },
    { type: "Condition", icon: GitBranch, category: "Logic", description: "Conditional branching" },
    { type: "Transform", icon: Wand2, category: "Data", description: "Transform data format" },
    { type: "Filter", icon: Filter, category: "Data", description: "Filter items in array" },
];

export default function DocsPage() {
    const [search, setSearch] = useState("");

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
                            <span className="text-lg font-semibold">FlowForge</span>
                            <span className="badge badge-secondary text-xs ml-2">Docs</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search docs..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="input pl-9 w-64"
                                />
                            </div>
                            <Link href="/auth/sign-up" className="btn-primary text-sm">Get started</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-6xl px-6 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to home
                </Link>

                {/* Hero */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Book className="h-7 w-7 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Documentation</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Learn how to build powerful automation workflows with FlowForge.
                    </p>
                </motion.div>

                {/* Sections */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {sections.map((section, i) => (
                        <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl border border-border p-6">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                <section.icon className="h-5 w-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
                            <ul className="space-y-2">
                                {section.articles.map((article) => (
                                    <li key={article.title}>
                                        <a href="#" className="group flex items-center justify-between py-2 text-sm hover:text-primary transition-colors">
                                            <span>{article.title}</span>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Node Types Reference */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Node Types</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {nodeTypes.map((node) => (
                            <div key={node.type} className="group rounded-lg border border-border p-4 hover:border-primary/50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <node.icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span className="font-medium">{node.type}</span>
                                        <span className="text-xs text-muted-foreground ml-2">{node.category}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{node.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Start Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-xl border border-border bg-primary/5 p-8 text-center">
                    <h2 className="text-2xl font-bold mb-2">Ready to start building?</h2>
                    <p className="text-muted-foreground mb-6">Create your first workflow in minutes with our visual builder.</p>
                    <Link href="/auth/sign-up" className="btn-primary inline-flex">
                        <Play className="h-4 w-4" /> Start building
                    </Link>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="border-t border-border py-8 mt-12">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                                <Workflow className="h-3 w-3 text-primary-foreground" />
                            </div>
                            <span className="text-sm font-medium">FlowForge</span>
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
