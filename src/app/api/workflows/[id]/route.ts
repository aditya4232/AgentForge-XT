import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Get a specific workflow
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
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
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT - Update a workflow
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, description, nodes, edges, is_active } = body;

        const { data: workflow, error } = await supabase
            .from("workflows")
            .update({
                name,
                description,
                nodes,
                edges,
                is_active,
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
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE - Delete a workflow
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { error } = await supabase
            .from("workflows")
            .delete()
            .eq("id", params.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Workflow deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
