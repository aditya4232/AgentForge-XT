import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { n8nClient } from "@/lib/n8n-client";

// POST - Execute a workflow
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        if (!isSupabaseConfigured || !supabase) {
            return NextResponse.json(
                { error: "Database not configured" },
                { status: 503 }
            );
        }

        // Get workflow
        const { data: workflow, error: workflowError } = await supabase
            .from("workflows")
            .select("*")
            .eq("id", params.id)
            .single();

        if (workflowError || !workflow) {
            return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
        }

        // Create execution record
        const { data: execution, error: execError } = await supabase
            .from("executions")
            .insert({
                workflow_id: params.id,
                status: "running",
                started_at: new Date().toISOString(),
                logs: [],
            })
            .select()
            .single();

        if (execError) {
            return NextResponse.json({ error: execError.message }, { status: 500 });
        }

        // Execute via n8n if available
        if (workflow.n8n_id && await n8nClient.isConfigured()) {
            const n8nExecution = await n8nClient.executeWorkflow(workflow.n8n_id);

            if (n8nExecution) {
                // Update with real n8n results
                await supabase
                    .from("executions")
                    .update({
                        status: n8nExecution.status || "success", // Map n8n status
                        completed_at: n8nExecution.stoppedAt || new Date().toISOString(),
                        logs: [], // Logs not available in immediate execution response
                        n8n_execution_id: n8nExecution.id,
                    })
                    .eq("id", execution.id);

                return NextResponse.json({
                    execution: {
                        ...execution,
                        status: n8nExecution.status || "success",
                        n8n_execution_id: n8nExecution.id,
                    }
                });
            }
        }

        // Fallback: Local Execution Engine
        // This runs the workflow directly in the Next.js API if n8n is not configured
        const nodes = workflow.nodes || [];
        const edges = workflow.edges || [];
        const logs: { nodeId: string; nodeName: string; status: string; timestamp: string; message?: string }[] = [];
        const context: Record<string, any> = {}; // Store node outputs

        // robust topological sort or simple sequential (start with nodes with no incoming edges)
        // For MVP, we'll find start nodes and follow edges

        let queue = nodes.filter((n: any) => !edges.some((e: any) => e.target === n.id)); // Roots
        if (queue.length === 0 && nodes.length > 0) queue = [nodes[0]]; // Fallback if cycle or weirdness

        const visited = new Set<string>();

        while (queue.length > 0) {
            const node = queue.shift();
            if (!node || visited.has(node.id)) continue;
            visited.add(node.id);

            let status = "success";
            let message = "Executed successfully";
            let output: any = null;

            try {
                // Execute Node Logic
                switch (node.data?.type) {
                    case "ai_chat":
                        const { openAIClient } = await import("@/lib/openai-client");
                        if (openAIClient.isConfigured()) {
                            // simple prompt construction from config or previous input
                            const systemPrompt = node.data.config?.systemPrompt || "You are a helpful assistant.";
                            // Try to get input from context (e.g., webhook body or previous node output)
                            const input = context["last_output"] || "Hello!";
                            const response = await openAIClient.chat(JSON.stringify(input), systemPrompt, {
                                model: node.data.config?.model
                            });
                            output = response;
                            message = `AI Responded: ${response?.substring(0, 50)}...`;
                        } else {
                            status = "warning";
                            message = "OpenAI not configured";
                        }
                        break;

                    case "http_request":
                        const url = node.data.config?.url;
                        const method = node.data.config?.method || "GET";
                        if (url) {
                            try {
                                const res = await fetch(url, { method });
                                const text = await res.text();
                                try { output = JSON.parse(text); } catch { output = text; }
                                message = `HTTP ${res.status}`;
                            } catch (e) {
                                throw new Error(`HTTP Request Failed: ${e instanceof Error ? e.message : String(e)}`);
                            }
                        } else {
                            message = "No URL configured";
                            status = "skipped";
                        }
                        break;

                    case "web_scraper":
                        const scrapeUrl = node.data.config?.url;
                        const selector = node.data.config?.selector || "body";
                        if (scrapeUrl) {
                            try {
                                const { load } = await import("cheerio");
                                const res = await fetch(scrapeUrl);
                                const html = await res.text();
                                const $ = load(html);
                                const text = $(selector).text().trim().substring(0, 1000); // Limit size
                                output = { text, html: html.substring(0, 500) };
                                message = `Scraped ${text.length} chars`;
                            } catch (e) {
                                throw new Error(`Scraping Failed: ${e instanceof Error ? e.message : String(e)}`);
                            }
                        } else {
                            message = "No URL configured";
                            status = "skipped";
                        }
                        break;

                    case "ai_embedding":
                        const { openAIClient: openAIClientEmbedding } = await import("@/lib/openai-client");
                        const textInput = typeof context["last_output"] === 'string' ? context["last_output"] : (context["last_output"]?.text || JSON.stringify(context["last_output"]));

                        if (textInput && openAIClientEmbedding.isConfigured()) {
                            const embeddingRes = await openAIClientEmbedding.createEmbedding(textInput);
                            if (embeddingRes && embeddingRes.data && embeddingRes.data[0]) {
                                output = {
                                    vector: embeddingRes.data[0].embedding,
                                    text: textInput,
                                    usage: embeddingRes.usage
                                };
                                message = "Generated embedding";
                            } else {
                                throw new Error("Failed to generate embedding");
                            }
                        } else {
                            status = "error";
                            message = "Missing input text or OpenAI config";
                        }
                        break;
                    case "webhook":
                        message = "Triggered manually";
                        output = { body: {} }; // Mock webhook data
                        break;

                    default:
                        message = `Passthrough (${node.data?.type})`;
                        output = context["last_output"];
                }

                if (output) {
                    context[node.id] = output;
                    context["last_output"] = output;
                }

            } catch (error) {
                status = "error";
                message = error instanceof Error ? error.message : "Unknown error";
                console.error(`Error executing node ${node.id}:`, error);
            }

            logs.push({
                nodeId: node.id,
                nodeName: node.data?.label || node.data?.type || "Unknown",
                status,
                timestamp: new Date().toISOString(),
                message
            });

            // Find next nodes
            const nextEdges = edges.filter((e: any) => e.source === node.id);
            for (const edge of nextEdges) {
                const nextNode = nodes.find((n: any) => n.id === edge.target);
                if (nextNode) queue.push(nextNode);
            }
        }

        // Update execution with completion
        await supabase
            .from("executions")
            .update({
                status: logs.some(l => l.status === "error") ? "error" : "success",
                completed_at: new Date().toISOString(),
                logs,
            })
            .eq("id", execution.id);

        return NextResponse.json({
            execution: {
                ...execution,
                status: logs.some(l => l.status === "error") ? "error" : "success",
                logs,
            },
        });
    } catch (error) {
        console.error("Error executing workflow:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
