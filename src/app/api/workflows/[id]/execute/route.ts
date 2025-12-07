import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST - Execute a workflow
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
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

        // Simulate workflow execution
        const nodes = workflow.nodes || [];
        const logs: any[] = [];

        for (const node of nodes) {
            logs.push({
                nodeId: node.id,
                nodeName: node.data?.label || node.type,
                status: "success",
                timestamp: new Date().toISOString(),
            });
        }

        // Update execution with completion
        await supabase
            .from("executions")
            .update({
                status: "success",
                completed_at: new Date().toISOString(),
                logs,
            })
            .eq("id", execution.id);

        return NextResponse.json({
            execution: {
                ...execution,
                status: "success",
                logs,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
