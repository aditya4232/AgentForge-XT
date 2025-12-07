import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AgentForge-XT | Visual Agent Builder",
    description: "Design, deploy, and monitor AI agents with a visual workflow builder. No spaghetti code required.",
    keywords: ["AI agents", "LangGraph", "workflow builder", "LLM", "automation"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <div className="min-h-screen bg-background text-foreground flex flex-col">
                    <header className="border-b border-border p-4 flex justify-between items-center bg-card/50 backdrop-blur sticky top-0 z-50">
                        <a href="/" className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition">
                            AgentForge-XT
                        </a>
                        <nav className="flex gap-6 text-sm font-medium">
                            <a href="/" className="hover:text-primary transition">Home</a>
                            <a href="/dashboard" className="hover:text-primary transition">Dashboard</a>
                            <a href="/agents" className="hover:text-primary transition">Agents</a>
                        </nav>
                    </header>
                    <main className="flex-1">
                        {children}
                    </main>
                    <footer className="p-4 text-center text-xs text-muted-foreground border-t border-border">
                        Built by Aditya Shenvi • v0.5 Beta • © 2025-26
                    </footer>
                </div>
            </body>
        </html>
    );
}
