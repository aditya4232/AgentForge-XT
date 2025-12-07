'use client'

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Mock API calls - replace with actual apiClient methods
const fetchSettings = async () => {
    const res = await fetch('/api/v1/settings'); // Proxy handles URL
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
};

const updateSettings = async (data: any) => {
    const res = await fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
};

export default function SettingsPage() {
    const queryClient = useQueryClient();
    const [groqKey, setGroqKey] = useState("");
    const [openaiKey, setOpenaiKey] = useState("");
    const [model, setModel] = useState("groq/llama3-70b-8192");

    const { data, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: fetchSettings,
        // On success, populate state if keys exist (they strictly come as masked '*******')
        // We don't overwrite state if user is typing, only on initial load
    });

    const mutation = useMutation({
        mutationFn: updateSettings,
        onSuccess: () => {
            toast.success("Settings saved successfully!");
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            setGroqKey(""); // Clear local input for security
            setOpenaiKey("");
        },
        onError: () => toast.error("Failed to save settings.")
    });

    const handleSave = () => {
        mutation.mutate({
            groq_key: groqKey || undefined, // Only send if changed
            openai_key: openaiKey || undefined,
            model_preference: model
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Settings ⚙️</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage your API keys and model preferences.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>AI Provider Configuration</CardTitle>
                        <CardDescription>
                            Your keys are encrypted and stored securely.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="space-y-2">
                            <Label>Active Model</Label>
                            <Select value={model} onValueChange={setModel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="groq/llama3-70b-8192">Groq - Llama 3 70B (Fastest & Free)</SelectItem>
                                    <SelectItem value="groq/mixtral-8x7b-32768">Groq - Mixtral 8x7B</SelectItem>
                                    <SelectItem value="openai/gpt-4-turbo">OpenAI - GPT-4 Turbo</SelectItem>
                                    <SelectItem value="openai/gpt-3.5-turbo">OpenAI - GPT-3.5 Turbo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Groq API Key</Label>
                            <Input
                                type="password"
                                placeholder={data?.groq_key ? "•••••••• (Configured)" : "gsk_..."}
                                value={groqKey}
                                onChange={(e) => setGroqKey(e.target.value)}
                            />
                            <p className="text-xs text-slate-500">
                                Required for Llama 3 & Mixtral. Get it free at console.groq.com
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>OpenAI API Key</Label>
                            <Input
                                type="password"
                                placeholder={data?.openai_key ? "•••••••• (Configured)" : "sk-..."}
                                value={openaiKey}
                                onChange={(e) => setOpenaiKey(e.target.value)}
                            />
                            <p className="text-xs text-slate-500">
                                Required for GPT-4 models.
                            </p>
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={mutation.isPending}
                            className="w-full"
                        >
                            {mutation.isPending ? "Saving..." : "Save Configuration"}
                        </Button>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
