import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { n8nClient } from "@/lib/n8n-client";

// GET - Get a specific workflow
export async function GET(
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

        const { data: workflow, error } = await supabase
            .from("workflows")
            .select("*")
            .eq("id", params.id)
            .single();

        if (error) {
            return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
        }

        return NextResponse.json({ workflow });
    } catch (error) {
        console.error("Error fetching workflow:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT - Update a workflow
export async function PUT(
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

        const body = await request.json();
        const { name, description, nodes, edges, is_active } = body;

        // First get the current workflow to check for n8n_id
        const { data: currentWorkflow } = await supabase
            .from("workflows")
            .select("n8n_id")
            .eq("id", params.id)
            .single();

        let n8nWorkflowId = currentWorkflow?.n8n_id;

        // Sync with n8n
        try {
            if (await n8nClient.isConfigured()) {
                const n8nData = n8nClient.convertToN8nWorkflow({
                    name,
                    nodes: nodes || [],
                    edges: edges || [],
                    is_active
                });

                if (n8nWorkflowId) {
                    // Update existing
                    await n8nClient.updateWorkflow(n8nWorkflowId, n8nData);
                } else {
                    // Create if missing in n8n
                    const newWorkflow = await n8nClient.createWorkflow(n8nData);
                    if (newWorkflow) {
                        n8nWorkflowId = newWorkflow.id;
                    }
                }

                // Sync activation state
                if (n8nWorkflowId && is_active !== undefined) {
                    await n8nClient.setWorkflowActive(n8nWorkflowId, is_active);
                }
            }
        } catch (error) {
            console.error("n8n sync error:", error);
        }

        const { data: workflow, error } = await supabase
            .from("workflows")
            .update({
                name,
                description,
                nodes,
                edges,
                is_active,
                n8n_id: n8nWorkflowId,
                updated_at: new Date().toISOString(),
            })
            .eq("id", params.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ workflow });
    } catch (error) {
        console.error("Error updating workflow:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE - Delete a workflow
export async function DELETE(
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

        // Get workflow to check n8n_id
        const { data: workflow } = await supabase
            .from("workflows")
            .select("n8n_id")
            .eq("id", params.id)
            .single();

        // Delete from n8n if exists
        if (workflow?.n8n_id && await n8nClient.isConfigured()) {
            await n8nClient.deleteWorkflow(workflow.n8n_id).catch(e => console.error("n8n delete error:", e));
        }

        const { error } = await supabase
            .from("workflows")
            .delete()
            .eq("id", params.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Workflow deleted" });
    } catch (error) {
        console.error("Error deleting workflow:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
