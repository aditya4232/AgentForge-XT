import Link from "next/link";
import { Workflow, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto max-w-3xl px-6 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                            <Workflow className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-semibold">AgentForge</span>
                    </Link>
                </div>
            </nav>

            <main className="mx-auto max-w-3xl px-6 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to home
                </Link>

                <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: December 7, 2024</p>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                        <p className="text-muted-foreground">We collect information you provide directly to us, including:</p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                            <li>Account information (name, email, profile picture)</li>
                            <li>Workflow data and configurations</li>
                            <li>Usage data and analytics</li>
                            <li>Communication preferences</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                        <p className="text-muted-foreground">We use the information we collect to:</p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process and complete transactions</li>
                            <li>Send you technical notices and support messages</li>
                            <li>Respond to your comments and questions</li>
                            <li>Analyze usage and improve user experience</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Data Storage</h2>
                        <p className="text-muted-foreground">Your data is stored securely using industry-standard encryption. We use Supabase for database storage and Firebase for authentication, both of which comply with strict security standards.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
                        <p className="text-muted-foreground">We do not sell, trade, or otherwise transfer your personally identifiable information to third parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
                        <p className="text-muted-foreground">We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
                        <p className="text-muted-foreground">You have the right to:</p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Export your data</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Security</h2>
                        <p className="text-muted-foreground">We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
                        <p className="text-muted-foreground">If you have any questions about this Privacy Policy, please contact us at privacy@AgentForge.io</p>
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
