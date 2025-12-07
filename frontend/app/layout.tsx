import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AgentForge-XT",
    description: "Cloud-native platform to design, deploy, and monitor multi-agent AI systems.",
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
                    <header className="border-b border-border p-4 flex justify-between items-center bg-card/50 backdrop-blur">
                        <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            AgentForge-XT
                        </div>
                        <nav className="flex gap-4 text-sm font-medium">
                            <a href="/" className="hover:text-primary transition">Home</a>
                            <a href="/dashboard" className="hover:text-primary transition">Dashboard</a>
                            <a href="/agents" className="hover:text-primary transition">Agents</a>
                        </nav>
                    </header>
                    <main className="flex-1">
                        {children}
                    </main>
                    <footer className="p-4 text-center text-xs text-muted-foreground border-t border-border">
                        Designed by Aditya Shenvi © 2025-26
                    </footer>
                </div>
            </body>
        </html>
    );
}
