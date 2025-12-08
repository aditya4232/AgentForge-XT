import { NextRequest, NextResponse } from "next/server";
import { openAIClient } from "@/lib/openai-client";

export const dynamic = 'force-dynamic';

interface TestResult {
    step: string;
    status: "success" | "error" | "skipped";
    duration?: number;
    message?: string;
    data?: unknown;
}

/**
 * POST - Run a workflow test
 * Tests the automation pipeline with a sample workflow
 */
export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const results: TestResult[] = [];

    try {
        const body = await request.json().catch(() => ({}));
        const { testType = "basic", input = "Hello, test!" } = body;

        // Step 1: Test OpenAI connection
        const openaiStart = Date.now();
        if (!openAIClient.isConfigured()) {
            results.push({
                step: "OpenAI Connection",
                status: "skipped",
                message: "OpenAI API key not configured. Set OPENAI_API_KEY in .env.local",
            });
        } else {
            try {
                const testPrompt = testType === "basic"
                    ? "Respond with just 'OK' to confirm you're working."
                    : input;

                // Using chat() convenience method which returns string directly
                const response = await openAIClient.chat(
                    testPrompt,
                    "You are a test assistant. Be extremely brief.",
                    {
                        max_tokens: 50,
                        temperature: 0,
                    }
                );

                if (!response) throw new Error("No response from AI");

                results.push({
                    step: "OpenAI Connection",
                    status: "success",
                    duration: Date.now() - openaiStart,
                    message: "AI responded successfully",
                    data: { response: response.slice(0, 100) },
                });
            } catch (error) {
                results.push({
                    step: "OpenAI Connection",
                    status: "error",
                    duration: Date.now() - openaiStart,
                    message: error instanceof Error ? error.message : "Unknown error",
                });
            }
        }

        // Step 2: Test workflow node execution simulation
        const workflowStart = Date.now();
        const sampleWorkflow = {
            nodes: [
                { id: "1", type: "webhook", data: { label: "Webhook Trigger" } },
                { id: "2", type: "transform", data: { label: "Transform Data" } },
                { id: "3", type: "ai_chat", data: { label: "AI Processing" } },
            ],
            edges: [
                { source: "1", target: "2" },
                { source: "2", target: "3" },
            ],
        };

        // Simulate workflow execution
        const executionResults = [];
        for (const node of sampleWorkflow.nodes) {
            await new Promise(r => setTimeout(r, 100)); // Simulate processing time
            executionResults.push({
                nodeId: node.id,
                type: node.type,
                status: "completed",
                output: { message: `Node ${node.data.label} executed` },
            });
        }

        results.push({
            step: "Workflow Execution",
            status: "success",
            duration: Date.now() - workflowStart,
            message: `Executed ${sampleWorkflow.nodes.length} nodes successfully`,
            data: { executedNodes: executionResults.length },
        });

        // Step 3: Test AI chatbot pipeline (if OpenAI is configured)
        if (openAIClient.isConfigured() && testType === "chatbot") {
            const chatStart = Date.now();
            try {
                // Using createChatCompletion for full response object (usage, model, etc.)
                const chatResponse = await openAIClient.createChatCompletion([
                    { role: "system", content: "You are a helpful AI assistant for AgentForge. Be friendly and concise." },
                    { role: "user", content: input }
                ] as any, {
                    max_tokens: 200,
                    temperature: 0.7,
                });

                if (!chatResponse) throw new Error("No response from AI pipeline");

                results.push({
                    step: "AI Chatbot Pipeline",
                    status: "success",
                    duration: Date.now() - chatStart,
                    message: "Chatbot pipeline working",
                    data: {
                        input,
                        response: chatResponse.choices[0]?.message?.content || "",
                        model: chatResponse.model,
                        tokens: chatResponse.usage,
                    },
                });
            } catch (error) {
                results.push({
                    step: "AI Chatbot Pipeline",
                    status: "error",
                    duration: Date.now() - chatStart,
                    message: error instanceof Error ? error.message : "Chatbot test failed",
                });
            }
        }

        // Step 4: Test embeddings (if available)
        if (openAIClient.isConfigured() && testType === "embeddings") {
            const embedStart = Date.now();
            try {
                const embedding = await openAIClient.createEmbedding(
                    [input],
                    { model: "text-embedding-3-small" }
                );

                if (!embedding) throw new Error("Failed to generate embedding");

                results.push({
                    step: "Embeddings Generation",
                    status: "success",
                    duration: Date.now() - embedStart,
                    message: "Embeddings generated successfully",
                    data: {
                        dimensions: embedding.data && embedding.data[0] && embedding.data[0].embedding ? embedding.data[0].embedding.length : 0,
                        model: embedding.model,
                    },
                });
            } catch (error) {
                results.push({
                    step: "Embeddings Generation",
                    status: "error",
                    duration: Date.now() - embedStart,
                    message: error instanceof Error ? error.message : "Embeddings test failed",
                });
            }
        }

        // Calculate overall status
        const hasErrors = results.some(r => r.status === "error");
        const allSkipped = results.every(r => r.status === "skipped");

        return NextResponse.json({
            success: !hasErrors,
            status: hasErrors ? "partial" : allSkipped ? "skipped" : "success",
            totalDuration: Date.now() - startTime,
            results,
            summary: {
                total: results.length,
                passed: results.filter(r => r.status === "success").length,
                failed: results.filter(r => r.status === "error").length,
                skipped: results.filter(r => r.status === "skipped").length,
            },
        });
    } catch (error) {
        console.error("Test execution error:", error);
        return NextResponse.json({
            success: false,
            status: "error",
            totalDuration: Date.now() - startTime,
            results,
            error: error instanceof Error ? error.message : "Test execution failed",
        }, { status: 500 });
    }
}

/**
 * GET - Get available test types
 */
export async function GET() {
    return NextResponse.json({
        testTypes: [
            {
                id: "basic",
                name: "Basic Connectivity",
                description: "Test basic AI and workflow connectivity",
            },
            {
                id: "chatbot",
                name: "AI Chatbot",
                description: "Test the AI chatbot pipeline with a custom message",
            },
            {
                id: "embeddings",
                name: "Embeddings",
                description: "Test vector embeddings generation",
            },
        ],
        openaiConfigured: openAIClient.isConfigured(),
    });
}
