"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { signInWithGoogle, signInWithGithub } from "@/lib/firebase";
import { Workflow, Loader2, AlertCircle } from "lucide-react";

export default function SignInPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setLoading("google");
        setError(null);
        const { user, error } = await signInWithGoogle();
        if (user) {
            router.push("/dashboard");
        } else if (error) {
            if (error.message.includes("configuration-not-found")) {
                setError("Google sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.");
            } else {
                setError(error.message);
            }
        }
        setLoading(null);
    };

    const handleGithubSignIn = async () => {
        setLoading("github");
        setError(null);
        const { user, error } = await signInWithGithub();
        if (user) {
            router.push("/dashboard");
        } else if (error) {
            if (error.message.includes("configuration-not-found")) {
                setError("GitHub sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.");
            } else {
                setError(error.message);
            }
        }
        setLoading(null);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                            <Workflow className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-semibold">FlowForge</span>
                    </Link>
                    <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950 p-4">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Auth Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading !== null}
                        className="btn-secondary w-full justify-center"
                    >
                        {loading === "google" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        )}
                        Continue with Google
                    </button>

                    <button
                        onClick={handleGithubSignIn}
                        disabled={loading !== null}
                        className="btn-secondary w-full justify-center"
                    >
                        {loading === "github" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                        )}
                        Continue with GitHub
                    </button>
                </div>

                {/* Links */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/sign-up" className="text-foreground underline underline-offset-4 hover:text-muted-foreground">
                            Sign up
                        </Link>
                    </p>
                </div>

                <p className="mt-8 text-center text-xs text-muted-foreground">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="underline underline-offset-4">Terms</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="underline underline-offset-4">Privacy Policy</Link>
                </p>
            </motion.div>
        </div>
    );
}
