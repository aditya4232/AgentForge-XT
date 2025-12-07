"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Workflow, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Workflow className="h-8 w-8 text-primary" />
                </div>

                <h1 className="text-6xl font-bold mb-4">404</h1>
                <h2 className="text-xl font-semibold mb-2">Page not found</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Link href="/" className="btn-primary">
                        <Home className="h-4 w-4" /> Go home
                    </Link>
                    <button onClick={() => window.history.back()} className="btn-secondary">
                        <ArrowLeft className="h-4 w-4" /> Go back
                    </button>
                </div>
            </motion.div>

            <div className="absolute bottom-8 text-sm text-muted-foreground">
                <Link href="/" className="flex items-center gap-2 hover:text-foreground transition-colors">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                        <Workflow className="h-3 w-3 text-primary-foreground" />
                    </div>
                    FlowForge
                </Link>
            </div>
        </div>
    );
}
