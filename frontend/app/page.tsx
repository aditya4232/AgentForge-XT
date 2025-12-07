import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
            <h1 className="text-6xl font-extrabold tracking-tighter mb-6 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent drop-shadow-sm">
                Design Agents.<br />Ship Intelligence.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-10">
                Stop writing spaghetti agent code. Build workflows visually, run them async, and actually see what's happening.
            </p>

            <div className="flex gap-4">
                <Link
                    href="/dashboard"
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
                >
                    Get Started
                </Link>
                <Link
                    href="/agents"
                    className="border border-border bg-card px-8 py-3 rounded-lg font-semibold hover:bg-accent transition"
                >
                    Browse Agents
                </Link>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full max-w-5xl">
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition duration-300">
                    <h3 className="font-bold text-lg mb-2 text-blue-400">Visual First</h3>
                    <p className="text-muted-foreground">
                        Drag nodes, connect edges. Your agent logic becomes a graph you can actually understand.
                    </p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition duration-300">
                    <h3 className="font-bold text-lg mb-2 text-purple-400">Async Everything</h3>
                    <p className="text-muted-foreground">
                        Celery workers handle execution. Your API stays snappy. Users don't wait.
                    </p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition duration-300">
                    <h3 className="font-bold text-lg mb-2 text-cyan-400">See Inside</h3>
                    <p className="text-muted-foreground">
                        Prometheus, Grafana, MLflow. When something breaks, you'll know why.
                    </p>
                </div>
            </div>

            <p className="mt-16 text-sm text-muted-foreground">
                v0.5 Beta • Built with FastAPI, Next.js, and LangGraph
            </p>
        </div>
    );
}
