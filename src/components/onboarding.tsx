"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Workflow,
    Settings,
    Sparkles,
    Zap,
    ArrowRight,
    ArrowLeft,
    Check,
    Rocket,
    Database,
    Key,
    Play,
} from "lucide-react";

interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    action?: string;
    actionLink?: string;
}

const onboardingSteps: OnboardingStep[] = [
    {
        id: "welcome",
        title: "Welcome to AgentForge! 🚀",
        description: "Build powerful AI-driven automation workflows without code. Let's get you started in just a few steps.",
        icon: Rocket,
    },
    {
        id: "api-keys",
        title: "Configure Your API Keys",
        description: "Add your OpenAI API key to unlock AI features. You can use any OpenAI-compatible service like Ollama, Groq, or Azure.",
        icon: Key,
        action: "Go to Settings",
        actionLink: "/dashboard/settings",
    },
    {
        id: "create-workflow",
        title: "Create Your First Workflow",
        description: "Drag and drop nodes to build automation. Connect triggers, AI nodes, and actions to create powerful workflows.",
        icon: Workflow,
        action: "Create Workflow",
        actionLink: "/workflow/new",
    },
    {
        id: "ai-nodes",
        title: "Use AI-Powered Nodes",
        description: "Add AI Chat, Embeddings, and RAG nodes to make your workflows intelligent. Perfect for chatbots, content generation, and more.",
        icon: Sparkles,
    },
    {
        id: "n8n-integration",
        title: "Connect with n8n",
        description: "Integrate with n8n for 400+ app integrations. Run n8n locally or in the cloud for maximum flexibility.",
        icon: Zap,
    },
    {
        id: "ready",
        title: "You're All Set! 🎉",
        description: "Start building amazing automations. Check out templates for inspiration or create your own from scratch.",
        icon: Check,
        action: "Start Building",
        actionLink: "/dashboard",
    },
];

interface OnboardingContextType {
    isOnboarding: boolean;
    currentStep: number;
    showWelcome: boolean;
    hasCompletedOnboarding: boolean;
    startOnboarding: () => void;
    nextStep: () => void;
    prevStep: () => void;
    skipOnboarding: () => void;
    completeOnboarding: () => void;
    dismissWelcome: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within OnboardingProvider");
    }
    return context;
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [showWelcome, setShowWelcome] = useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);

    useEffect(() => {
        // Check if user has completed onboarding
        const completed = localStorage.getItem("agentforge_onboarding_completed");
        const welcomed = localStorage.getItem("agentforge_welcomed");

        if (!completed) {
            setHasCompletedOnboarding(false);
        }

        if (!welcomed) {
            // Show welcome popup after a short delay
            setTimeout(() => setShowWelcome(true), 1000);
        }
    }, []);

    const startOnboarding = () => {
        setShowWelcome(false);
        setIsOnboarding(true);
        setCurrentStep(0);
    };

    const nextStep = () => {
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            completeOnboarding();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const skipOnboarding = () => {
        setIsOnboarding(false);
        localStorage.setItem("agentforge_onboarding_completed", "true");
        setHasCompletedOnboarding(true);
    };

    const completeOnboarding = () => {
        setIsOnboarding(false);
        localStorage.setItem("agentforge_onboarding_completed", "true");
        setHasCompletedOnboarding(true);
    };

    const dismissWelcome = () => {
        setShowWelcome(false);
        localStorage.setItem("agentforge_welcomed", "true");
    };

    return (
        <OnboardingContext.Provider
            value={{
                isOnboarding,
                currentStep,
                showWelcome,
                hasCompletedOnboarding,
                startOnboarding,
                nextStep,
                prevStep,
                skipOnboarding,
                completeOnboarding,
                dismissWelcome,
            }}
        >
            {children}

            {/* Welcome Popup */}
            <AnimatePresence>
                {showWelcome && (
                    <WelcomePopup
                        onDismiss={dismissWelcome}
                        onStartTour={startOnboarding}
                    />
                )}
            </AnimatePresence>

            {/* Onboarding Modal */}
            <AnimatePresence>
                {isOnboarding && (
                    <OnboardingModal
                        step={onboardingSteps[currentStep]}
                        currentStep={currentStep}
                        totalSteps={onboardingSteps.length}
                        onNext={nextStep}
                        onPrev={prevStep}
                        onSkip={skipOnboarding}
                    />
                )}
            </AnimatePresence>
        </OnboardingContext.Provider>
    );
}

function WelcomePopup({
    onDismiss,
    onStartTour,
}: {
    onDismiss: () => void;
    onStartTour: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

                {/* Content */}
                <div className="relative p-8 text-white">
                    <button
                        onClick={onDismiss}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 backdrop-blur mb-4"
                        >
                            <Sparkles className="h-8 w-8" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-2">Welcome to AgentForge-XT! ✨</h2>
                        <p className="text-white/80 text-sm">
                            The modern AI workflow automation platform. Build intelligent automations with drag-and-drop simplicity.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { icon: Workflow, label: "Visual Workflows" },
                            { icon: Sparkles, label: "AI-Powered" },
                            { icon: Zap, label: "n8n Integration" },
                        ].map((feature, i) => (
                            <motion.div
                                key={feature.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="text-center p-3 rounded-xl bg-white/10 backdrop-blur"
                            >
                                <feature.icon className="h-5 w-5 mx-auto mb-2" />
                                <p className="text-xs font-medium">{feature.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onDismiss}
                            className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                        >
                            Skip for now
                        </button>
                        <button
                            onClick={onStartTour}
                            className="flex-1 py-3 px-4 rounded-xl bg-white text-purple-600 hover:bg-white/90 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <Play className="h-4 w-4" />
                            Start Tour
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function OnboardingModal({
    step,
    currentStep,
    totalSteps,
    onNext,
    onPrev,
    onSkip,
}: {
    step: OnboardingStep;
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
}) {
    const Icon = step.icon;
    const isLastStep = currentStep === totalSteps - 1;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Progress bar */}
                <div className="h-1 bg-secondary">
                    <motion.div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    />
                </div>

                <div className="p-6">
                    {/* Step indicator */}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-xs text-muted-foreground">
                            Step {currentStep + 1} of {totalSteps}
                        </span>
                        <button
                            onClick={onSkip}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Skip tutorial
                        </button>
                    </div>

                    {/* Icon */}
                    <motion.div
                        key={step.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-14 w-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4"
                    >
                        <Icon className="h-7 w-7 text-violet-500" />
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        key={`content-${step.id}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground text-sm mb-6">{step.description}</p>
                    </motion.div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={onPrev}
                                className="px-4 py-2.5 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </button>
                        )}
                        <button
                            onClick={onNext}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center gap-2"
                        >
                            {isLastStep ? (
                                <>
                                    Get Started
                                    <Rocket className="h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Step dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all ${i === currentStep
                                        ? "w-6 bg-violet-500"
                                        : i < currentStep
                                            ? "w-1.5 bg-violet-500/50"
                                            : "w-1.5 bg-secondary"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
