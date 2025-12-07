import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FlowForge | Modern Workflow Automation",
    description: "Build, automate, and scale your workflows with our visual automation platform. Connect apps, automate tasks, and focus on what matters.",
    keywords: ["workflow automation", "no-code", "automation", "n8n alternative", "workflow builder"],
    authors: [{ name: "Aditya Shenvi" }],
    openGraph: {
        title: "FlowForge | Modern Workflow Automation",
        description: "Build, automate, and scale your workflows with our visual automation platform.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "FlowForge | Modern Workflow Automation",
        description: "Build, automate, and scale your workflows with our visual automation platform.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
