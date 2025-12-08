import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// GET - List all workflows for the authenticated user
export async function GET(request: NextRequest) {
    try {
        // Check if Supabase is configured
        if (!isSupabaseConfigured || !supabase) {
            return NextResponse.json({
                workflows: [],
                message: "Database not configured. Please set up Supabase.",
            });
        }

        // Get user from headers (set by middleware/auth)
        const firebaseUid = request.headers.get("x-user-id");

        // In production, filter by user_id through profile
        let query = supabase.from("workflows").select("*");

        // If we have a user ID, try to filter by their workflows
        if (firebaseUid) {
            // First get the user's profile ID
            const { data: profile } = await supabase
                .from("profiles")
                .select("id")
                .eq("firebase_uid", firebaseUid)
                .single();

            if (profile) {
                query = query.eq("user_id", profile.id);
            }
        }

        const { data: workflows, error } = await query.order("updated_at", { ascending: false });

        if (error) {
            console.error("Error fetching workflows:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            workflows: workflows || [],
            total: workflows?.length || 0,
        });
    } catch (error) {
        console.error("Error in GET /api/workflows:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Create a new workflow
export async function POST(request: NextRequest) {
    try {
        if (!isSupabaseConfigured || !supabase) {
            return NextResponse.json(
                { error: "Database not configured" },
                { status: 503 }
            );
        }

        const firebaseUid = request.headers.get("x-user-id");
        if (!firebaseUid) {
            return NextResponse.json(
                { error: "Unauthorized - Please sign in" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, description, nodes = [], edges = [] } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Get or create user profile
        let { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("firebase_uid", firebaseUid)
            .single();

        if (!profile) {
            // Create profile if doesn't exist
            const { data: newProfile, error: createError } = await supabase
                .from("profiles")
                .insert({
                    firebase_uid: firebaseUid,
                    email: request.headers.get("x-user-email") || "unknown@example.com",
                })
                .select("id")
                .single();

            if (createError) {
                console.error("Error creating profile:", createError);
                return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 });
            }
            profile = newProfile;
        }

        // Create workflow
        const { data: workflow, error } = await supabase
            .from("workflows")
            .insert({
                user_id: profile.id,
                name,
                description,
                nodes,
                edges,
                is_active: false,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating workflow:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ workflow }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/workflows:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
