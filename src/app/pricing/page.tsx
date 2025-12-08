"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Workflow, Check, X, Zap, Building2, Rocket, ChevronRight, ArrowLeft } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for getting started",
        icon: Zap,
        features: [
            { text: "5 workflows", included: true },
            { text: "100 executions/month", included: true },
            { text: "Basic nodes", included: true },
            { text: "Community support", included: true },
            { text: "Custom nodes", included: false },
            { text: "Priority execution", included: false },
            { text: "Team collaboration", included: false },
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Pro",
        price: "$19",
        period: "per month",
        description: "For professionals and small teams",
        icon: Rocket,
        features: [
            { text: "Unlimited workflows", included: true },
            { text: "10,000 executions/month", included: true },
            { text: "All node types", included: true },
            { text: "Priority support", included: true },
            { text: "Custom nodes", included: true },
            { text: "Priority execution", included: true },
            { text: "Team collaboration", included: false },
        ],
        cta: "Start Free Trial",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "$99",
        period: "per month",
        description: "For large teams and organizations",
        icon: Building2,
        features: [
            { text: "Unlimited workflows", included: true },
            { text: "Unlimited executions", included: true },
            { text: "All node types", included: true },
            { text: "24/7 dedicated support", included: true },
            { text: "Custom nodes", included: true },
            { text: "Priority execution", included: true },
            { text: "Team collaboration", included: true },
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

export default function PricingPage() {
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

            <section className="py-20">
                <div className="mx-auto max-w-6xl px-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
                        <ArrowLeft className="h-4 w-4" /> Back to home
                    </Link>

                    <div className="text-center mb-16">
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold mb-4">
                            Simple, transparent pricing
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-xl mx-auto">
                            Start free and scale as you grow. No hidden fees.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className={`relative rounded-xl border p-6 ${plan.popular ? "border-primary bg-primary/5 shadow-lg" : "border-border"}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="badge badge-default text-xs">Most Popular</span>
                                    </div>
                                )}
                                <div className="mb-6">
                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 ${plan.popular ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                                        <plan.icon className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-xl font-bold">{plan.name}</h2>
                                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                                </div>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">/{plan.period}</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature.text} className="flex items-center gap-3 text-sm">
                                            {feature.included ? (
                                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            ) : (
                                                <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                                            )}
                                            <span className={feature.included ? "" : "text-muted-foreground/50"}>{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/auth/sign-up"
                                    className={`w-full flex items-center justify-center gap-2 ${plan.popular ? "btn-primary" : "btn-secondary"}`}
                                >
                                    {plan.cta} <ChevronRight className="h-4 w-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-muted-foreground">
                            All plans include a 14-day free trial. No credit card required.
                        </p>
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
                            Built by <a href="https://linkedin.com/in/aditya-shenvi" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">Aditya Shenvi</a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
