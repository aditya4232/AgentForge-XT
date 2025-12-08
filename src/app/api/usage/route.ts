import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

interface UsageStats {
    period: 'day' | 'week' | 'month';
    aiCalls: number;
    executions: number;
    storage: number;
    workflows: { active: number; total: number };
    dailyBreakdown: { date: string; aiCalls: number; executions: number }[];
}

// Mock data for when Supabase isn't configured
const getMockUsage = (): UsageStats => ({
    period: 'week',
    aiCalls: 312,
    executions: 156,
    storage: 12500000, // 12.5MB in bytes
    workflows: { active: 3, total: 8 },
    dailyBreakdown: [
        { date: '2024-12-02', aiCalls: 45, executions: 23 },
        { date: '2024-12-03', aiCalls: 52, executions: 31 },
        { date: '2024-12-04', aiCalls: 38, executions: 18 },
        { date: '2024-12-05', aiCalls: 61, executions: 29 },
        { date: '2024-12-06', aiCalls: 55, executions: 25 },
        { date: '2024-12-07', aiCalls: 23, executions: 12 },
        { date: '2024-12-08', aiCalls: 38, executions: 18 },
    ],
});

// GET - Get usage statistics for the current user
export async function GET(request: NextRequest) {
    try {
        const firebaseUid = request.headers.get("x-user-id");
        const period = request.nextUrl.searchParams.get("period") || "week";

        // Return mock data if Supabase not configured
        if (!isSupabaseConfigured || !supabase) {
            return NextResponse.json({
                success: true,
                usage: getMockUsage(),
                limits: {
                    aiCalls: { used: 312, limit: 5000, period: 'month' },
                    workflows: { used: 8, limit: 10 },
                    storage: { used: 12500000, limit: 52428800 }, // 50MB
                    retention: { workflows: 15, executions: 7 }, // days
                },
            });
        }

        if (!firebaseUid) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get user profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("firebase_uid", firebaseUid)
            .single();

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        // Calculate date range
        const now = new Date();
        let startDate: Date;
        switch (period) {
            case "day":
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case "month":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "week":
            default:
                startDate = new Date(now.setDate(now.getDate() - 7));
        }

        // Get usage data
        const { data: usageData } = await supabase
            .from("usage_tracking")
            .select("*")
            .eq("user_id", profile.id)
            .gte("date", startDate.toISOString().split("T")[0])
            .order("date", { ascending: true });

        // Get workflow counts
        const { data: workflows } = await supabase
            .from("workflows")
            .select("id, is_active")
            .eq("user_id", profile.id);

        const workflowStats = {
            active: workflows?.filter(w => w.is_active).length || 0,
            total: workflows?.length || 0,
        };

        // Calculate totals
        const totals = (usageData || []).reduce(
            (acc, day) => ({
                aiCalls: acc.aiCalls + (day.ai_calls || 0),
                executions: acc.executions + (day.executions || 0),
                storage: Math.max(acc.storage, day.storage_bytes || 0),
            }),
            { aiCalls: 0, executions: 0, storage: 0 }
        );

        // Format daily breakdown
        const dailyBreakdown = (usageData || []).map(day => ({
            date: day.date,
            aiCalls: day.ai_calls || 0,
            executions: day.executions || 0,
        }));

        return NextResponse.json({
            success: true,
            usage: {
                period,
                ...totals,
                workflows: workflowStats,
                dailyBreakdown,
            },
            limits: {
                aiCalls: { used: totals.aiCalls, limit: 5000, period: 'month' },
                workflows: { used: workflowStats.total, limit: 10 },
                storage: { used: totals.storage, limit: 52428800 }, // 50MB
                retention: { workflows: 15, executions: 7 }, // days
            },
        });
    } catch (error) {
        console.error("Error fetching usage:", error);
        return NextResponse.json(
            { error: "Failed to fetch usage data" },
            { status: 500 }
        );
    }
}

// POST - Increment usage counters (called from other API routes)
export async function POST(request: NextRequest) {
    try {
        const firebaseUid = request.headers.get("x-user-id");
        const body = await request.json();
        const { aiCalls = 0, executions = 0, storageBytes = 0 } = body;

        if (!isSupabaseConfigured || !supabase) {
            // Just acknowledge if Supabase not configured
            return NextResponse.json({ success: true, tracked: false });
        }

        if (!firebaseUid) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get user profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("firebase_uid", firebaseUid)
            .single();

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        // Upsert usage tracking
        const today = new Date().toISOString().split("T")[0];

        const { error } = await supabase
            .from("usage_tracking")
            .upsert(
                {
                    user_id: profile.id,
                    date: today,
                    ai_calls: aiCalls,
                    executions: executions,
                    storage_bytes: storageBytes,
                },
                {
                    onConflict: "user_id,date",
                    ignoreDuplicates: false,
                }
            );

        if (error) {
            console.error("Error tracking usage:", error);
            return NextResponse.json(
                { error: "Failed to track usage" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, tracked: true });
    } catch (error) {
        console.error("Error in usage tracking:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
