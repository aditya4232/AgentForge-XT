import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
            <h1 className="text-6xl font-extrabold tracking-tighter mb-6 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent drop-shadow-sm">
                Build Agents.<br />Multiply Intelligence.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-10">
                AgentForge-XT is the cloud-native platform for designing, deploying, and monitoring multi-agent systems with ease.
            </p>

            <div className="flex gap-4">
                <Link href="/dashboard" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                    Open Dashboard
                </Link>
                <Link href="https://github.com/adityashenvi/agentforge-xt" className="border border-border bg-card px-8 py-3 rounded-lg font-semibold hover:bg-accent transition">
                    View on GitHub
                </Link>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full max-w-5xl">
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition duration-300">
                    <h3 className="font-bold text-lg mb-2 text-blue-400">Visual Builder</h3>
                    <p className="text-muted-foreground">Drag and drop nodes to create complex agentic workflows in seconds.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition duration-300">
                    <h3 className="font-bold text-lg mb-2 text-purple-400">Multi-Agent Runtime</h3>
                    <p className="text-muted-foreground">Powered by LangGraph and Celery for resilient, async execution at scale.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition duration-300">
                    <h3 className="font-bold text-lg mb-2 text-cyan-400">Full Observability</h3>
                    <p className="text-muted-foreground">Integrated Prometheus, Grafana, and MLflow for deep insights.</p>
                </div>
            </div>
        </div>
    );
}
