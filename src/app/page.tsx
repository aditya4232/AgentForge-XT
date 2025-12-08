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
    Sparkles,
    Brain,
    Database,
    Shield,
    Github,
    Star,
    Users,
    Globe,
} from "lucide-react";

const features = [
    {
        icon: Workflow,
        title: "Visual Builder",
        description: "Drag and drop nodes to create automation workflows without code.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: Sparkles,
        title: "AI-Powered",
        description: "Built-in AI nodes for chat, embeddings, and RAG pipelines.",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        icon: Zap,
        title: "n8n Integration",
        description: "Connect to 400+ apps through n8n automation engine.",
        gradient: "from-orange-500 to-red-500",
    },
    {
        icon: GitBranch,
        title: "Conditional Logic",
        description: "Add if/else conditions and loops to handle complex scenarios.",
        gradient: "from-green-500 to-emerald-500",
    },
    {
        icon: Database,
        title: "Vector Search",
        description: "Connect to Qdrant, Pinecone, or Weaviate for RAG workflows.",
        gradient: "from-pink-500 to-rose-500",
    },
    {
        icon: Shield,
        title: "Secure by Default",
        description: "Encrypted API keys, Firebase auth, and RLS policies.",
        gradient: "from-amber-500 to-yellow-500",
    },
];

const stats = [
    { value: "10+", label: "AI Models Supported", icon: Brain },
    { value: "400+", label: "App Integrations", icon: Layers },
    { value: "100%", label: "Open Source", icon: Github },
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
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Animated background gradient */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto max-w-6xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                                <Workflow className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold">AgentForge<span className="text-violet-500">-XT</span></span>
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
                            <a
                                href="https://github.com/aditya4232/AgentForge-XT"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github className="h-4 w-4" />
                                <span>GitHub</span>
                                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-secondary">
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                    Star
                                </span>
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/auth/sign-in" className="btn-ghost text-sm">
                                Sign in
                            </Link>
                            <Link href="/auth/sign-up" className="btn-primary text-sm shadow-lg shadow-violet-500/25">
                                Get started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative py-20 md:py-32">
                <div className="relative mx-auto max-w-6xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-400 mb-8"
                        >
                            <Sparkles className="h-4 w-4" />
                            AI-First Workflow Automation
                            <ChevronRight className="h-4 w-4" />
                        </motion.div>

                        <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6">
                            Build{" "}
                            <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                                AI Agents
                            </span>
                            <br />
                            <span className="text-muted-foreground">Visually</span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10">
                            Create intelligent automation workflows with drag-and-drop simplicity.
                            Connect AI models, RAG pipelines, and 400+ apps in minutes.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/auth/sign-up"
                                className="btn-primary text-base px-8 py-3 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
                            >
                                Start building free <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link href="/demo" className="btn-secondary text-base px-8 py-3">
                                <Play className="h-5 w-5" /> Watch demo
                            </Link>
                        </div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center gap-8 mt-16"
                        >
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                                        <stat.icon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-20"
                    >
                        <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur p-2 shadow-2xl">
                            {/* Browser chrome */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                                <div className="flex gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-red-500" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                    <div className="h-3 w-3 rounded-full bg-green-500" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-secondary/50 text-xs text-muted-foreground">
                                        <Globe className="h-3 w-3" />
                                        app.agentforge.dev/workflow/new
                                    </div>
                                </div>
                            </div>

                            {/* Workflow preview */}
                            <div className="relative h-[340px] md:h-[440px] bg-gradient-to-br from-background via-background to-secondary/20 rounded-b-xl overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30" />

                                {/* Animated nodes */}
                                <motion.div
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="absolute top-12 left-8 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 backdrop-blur-sm p-4 shadow-lg"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                        <Zap className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Webhook Trigger</p>
                                        <p className="text-xs text-muted-foreground">POST /api/chat</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ y: -30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="absolute top-12 left-1/3 flex items-center gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm p-4 shadow-lg"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                        <Sparkles className="h-5 w-5 text-violet-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">AI Chat</p>
                                        <p className="text-xs text-muted-foreground">GPT-4 Turbo</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm p-4 shadow-lg"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                        <Database className="h-5 w-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">RAG Query</p>
                                        <p className="text-xs text-muted-foreground">Qdrant Vector DB</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1.1 }}
                                    className="absolute bottom-12 right-8 flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm p-4 shadow-lg"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <Layers className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Slack</p>
                                        <p className="text-xs text-muted-foreground">Send message</p>
                                    </div>
                                </motion.div>

                                {/* Connection lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                        d="M 200 80 Q 280 120 320 80"
                                        stroke="url(#gradient1)"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.8, duration: 0.5 }}
                                        d="M 480 80 Q 500 200 400 220"
                                        stroke="url(#gradient2)"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 1.0, duration: 0.5 }}
                                        d="M 500 220 Q 600 280 650 350"
                                        stroke="url(#gradient3)"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <defs>
                                        <linearGradient id="gradient1">
                                            <stop offset="0%" stopColor="rgb(34, 197, 94)" />
                                            <stop offset="100%" stopColor="rgb(139, 92, 246)" />
                                        </linearGradient>
                                        <linearGradient id="gradient2">
                                            <stop offset="0%" stopColor="rgb(139, 92, 246)" />
                                            <stop offset="100%" stopColor="rgb(6, 182, 212)" />
                                        </linearGradient>
                                        <linearGradient id="gradient3">
                                            <stop offset="0%" stopColor="rgb(6, 182, 212)" />
                                            <stop offset="100%" stopColor="rgb(59, 130, 246)" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 mb-4">
                                <Zap className="h-4 w-4" /> FEATURES
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Everything you need for AI automation
                            </h2>
                            <p className="text-muted-foreground max-w-xl mx-auto">
                                From simple webhooks to complex AI agents—build it all with our visual builder.
                            </p>
                        </motion.div>
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
                                className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur p-6 hover:border-violet-500/30 transition-all hover:shadow-lg hover:shadow-violet-500/5"
                            >
                                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Integrations Logos */}
            <section className="py-16 border-t border-border/50 bg-secondary/20">
                <div className="mx-auto max-w-6xl px-6">
                    <p className="text-center text-sm text-muted-foreground mb-8">
                        Works with your favorite tools
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
                        {["OpenAI", "Slack", "GitHub", "Discord", "Notion", "Supabase", "Firebase", "n8n"].map((name) => (
                            <div key={name} className="text-sm font-medium text-muted-foreground">
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 border-t border-border/50">
                <div className="mx-auto max-w-6xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-600 p-1"
                    >
                        <div className="rounded-[22px] bg-background/95 backdrop-blur p-8 md:p-16 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to build AI agents?
                            </h2>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                Start building your first AI workflow in minutes. Free forever for personal projects.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/auth/sign-up" className="btn-primary text-base px-8 py-3">
                                    Get started free <ChevronRight className="h-5 w-5" />
                                </Link>
                                <a
                                    href="https://github.com/aditya4232/AgentForge-XT"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary text-base px-8 py-3"
                                >
                                    <Github className="h-5 w-5" /> Star on GitHub
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/50 py-12">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                                <Workflow className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-semibold">AgentForge<span className="text-violet-500">-XT</span></span>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                            <a
                                href="https://github.com/aditya4232/AgentForge-XT"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground transition-colors"
                            >
                                GitHub
                            </a>
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
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
