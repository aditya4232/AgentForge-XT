import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - List all workflows for the authenticated user
export async function GET(request: NextRequest) {
    try {
        // In production, get user from Firebase auth token
        const { data: workflows, error } = await supabase
            .from("workflows")
            .select("*")
            .order("updated_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ workflows });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Create a new workflow
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, nodes = [], edges = [] } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // In production, get user_id from Firebase auth
        const { data: workflow, error } = await supabase
            .from("workflows")
            .insert({
                name,
                description,
                nodes,
                edges,
                is_active: false,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ workflow }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
