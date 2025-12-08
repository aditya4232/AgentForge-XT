"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HelpCircle,
    X,
    Lightbulb,
    MousePointer,
    Link2,
    Play,
    Save,
    Trash2,
    ArrowRight,
} from "lucide-react";

const tips = [
    {
        icon: MousePointer,
        title: "Add Nodes",
        description: "Drag nodes from the left panel onto the canvas, or use the '+ Add node' button.",
    },
    {
        icon: Link2,
        title: "Connect Nodes",
        description: "Click and drag from a purple handle on the right side of one node to the left side of another.",
    },
    {
        icon: Play,
        title: "Execute Workflow",
        description: "Click 'Run' to test your workflow. Watch the nodes light up as they execute.",
    },
    {
        icon: Save,
        title: "Save Your Work",
        description: "Click 'Save' to persist your workflow. It will be available in your dashboard.",
    },
    {
        icon: Trash2,
        title: "Delete Nodes",
        description: "Select a node by clicking it, then use the trash icon in the config panel to delete.",
    },
];

export function WorkflowHelp() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasSeenTips, setHasSeenTips] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("agentforge_workflow_tips_seen") === "true";
        }
        return false;
    });

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("agentforge_workflow_tips_seen", "true");
        setHasSeenTips(true);
    };

    return (
        <>
            {/* Help button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-violet-500 text-white shadow-lg shadow-violet-500/25 hover:bg-violet-600 transition-colors flex items-center justify-center"
                title="Workflow Tips"
            >
                <HelpCircle className="h-6 w-6" />
                {!hasSeenTips && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white animate-pulse" />
                )}
            </button>

            {/* Tips modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 pb-4 border-b border-border">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                            <Lightbulb className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold">Workflow Tips</h2>
                                            <p className="text-sm text-muted-foreground">Quick guide to get started</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                                    >
                                        <X className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>

                            {/* Tips list */}
                            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                                {tips.map((tip, i) => (
                                    <motion.div
                                        key={tip.title}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50"
                                    >
                                        <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                                            <tip.icon className="h-4 w-4 text-violet-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium mb-1">{tip.title}</h3>
                                            <p className="text-xs text-muted-foreground">{tip.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-border bg-secondary/20">
                                <button
                                    onClick={handleClose}
                                    className="w-full py-2.5 px-4 rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    Got it! <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default WorkflowHelp;
