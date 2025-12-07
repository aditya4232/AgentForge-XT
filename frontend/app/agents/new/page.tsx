"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAgent } from "@/lib/api";

export default function NewAgentPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const agent = await createAgent({
                name,
                description,
                graph: { nodes: [], edges: [] } // Start empty
            });
            router.push(`/agents/${agent.id}`);
        } catch (error) {
            console.error("Failed to create agent", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 border border-border bg-card rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Create New Agent</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-background border border-input rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-background border border-input rounded px-3 py-2"
                        rows={3}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-primary-foreground py-2 rounded font-medium hover:bg-primary/90 transition disabled:opacity-50"
                >
                    {isLoading ? "Creating..." : "Create Agent"}
                </button>
            </form>
        </div>
    );
}
