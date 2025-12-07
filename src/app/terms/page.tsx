import Link from "next/link";
import { Workflow, ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto max-w-3xl px-6 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                            <Workflow className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-semibold">FlowForge</span>
                    </Link>
                </div>
            </nav>

            <main className="mx-auto max-w-3xl px-6 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to home
                </Link>

                <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last updated: December 7, 2024</p>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground">By accessing and using FlowForge ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
                        <p className="text-muted-foreground">FlowForge is a workflow automation platform that allows users to create, manage, and execute automated workflows. The Service includes a visual workflow builder, execution engine, and related tools.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                        <p className="text-muted-foreground">To use certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
                        <p className="text-muted-foreground">You agree not to use the Service to:</p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe upon the rights of others</li>
                            <li>Transmit harmful or malicious code</li>
                            <li>Interfere with or disrupt the Service</li>
                            <li>Attempt to gain unauthorized access to systems</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
                        <p className="text-muted-foreground">The Service and its original content, features, and functionality are owned by FlowForge and are protected by international copyright, trademark, and other intellectual property laws.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
                        <p className="text-muted-foreground">In no event shall FlowForge be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
                        <p className="text-muted-foreground">We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
                        <p className="text-muted-foreground">If you have any questions about these Terms, please contact us at support@flowforge.io</p>
                    </section>
                </div>
            </main>

            <footer className="border-t border-border py-8 mt-12">
                <div className="mx-auto max-w-3xl px-6">
                    <p className="text-sm text-muted-foreground text-center">
                        Built by <a href="https://linkedin.com/in/aditya-shenvi" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">Aditya Shenvi</a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
