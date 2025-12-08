import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// Secret key for cleanup authorization (set in env)
const CLEANUP_SECRET = process.env.CLEANUP_SECRET || 'agentforge-cleanup-secret';

/**
 * POST - Run cleanup tasks
 * 
 * This endpoint should be called by:
 * 1. Supabase Edge Function (cron)
 * 2. External cron job (e.g., GitHub Actions)
 * 3. Vercel Cron Jobs
 * 
 * Authorization: Bearer token or x-cleanup-secret header
 */
export async function POST(request: NextRequest) {
    try {
        // Verify authorization
        const authHeader = request.headers.get("authorization");
        const secretHeader = request.headers.get("x-cleanup-secret");

        const isAuthorized =
            authHeader === `Bearer ${CLEANUP_SECRET}` ||
            secretHeader === CLEANUP_SECRET;

        if (!isAuthorized) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!isSupabaseConfigured || !supabase) {
            return NextResponse.json({
                success: false,
                message: "Supabase not configured",
            });
        }

        const results = {
            timestamp: new Date().toISOString(),
            workflowsDeleted: 0,
            executionsDeleted: 0,
            profilesCleaned: 0,
        };

        // 1. Delete old inactive workflows (older than 15 days)
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        const { data: oldWorkflows, error: workflowError } = await supabase
            .from("workflows")
            .select("id")
            .eq("is_active", false)
            .lt("updated_at", fifteenDaysAgo.toISOString())
            .limit(100);

        if (!workflowError && oldWorkflows && oldWorkflows.length > 0) {
            const workflowIds = oldWorkflows.map(w => w.id);

            // Delete executions for these workflows first
            await supabase
                .from("executions")
                .delete()
                .in("workflow_id", workflowIds);

            // Delete the workflows
            const { error: deleteError } = await supabase
                .from("workflows")
                .delete()
                .in("id", workflowIds);

            if (!deleteError) {
                results.workflowsDeleted = workflowIds.length;
            }
        }

        // 2. Delete old executions (older than 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: oldExecutions, error: execError } = await supabase
            .from("executions")
            .select("id")
            .lt("created_at", sevenDaysAgo.toISOString())
            .limit(500);

        if (!execError && oldExecutions && oldExecutions.length > 0) {
            const { error: deleteError } = await supabase
                .from("executions")
                .delete()
                .in("id", oldExecutions.map(e => e.id));

            if (!deleteError) {
                results.executionsDeleted = oldExecutions.length;
            }
        }

        // 3. Clean up usage tracking (older than 90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        await supabase
            .from("usage_tracking")
            .delete()
            .lt("date", ninetyDaysAgo.toISOString().split("T")[0]);

        // Log the cleanup
        console.log("Cleanup completed:", results);

        return NextResponse.json({
            success: true,
            results,
        });
    } catch (error) {
        console.error("Cleanup error:", error);
        return NextResponse.json(
            { error: "Cleanup failed", details: String(error) },
            { status: 500 }
        );
    }
}

/**
 * GET - Get cleanup status and policies
 */
export async function GET() {
    return NextResponse.json({
        policies: {
            workflows: {
                inactiveRetentionDays: 15,
                description: "Inactive workflows (not updated) are deleted after 15 days",
            },
            executions: {
                retentionDays: 7,
                description: "Execution logs are deleted after 7 days",
            },
            usageTracking: {
                retentionDays: 90,
                description: "Usage statistics are kept for 90 days",
            },
        },
        note: "Active workflows with recent executions are preserved. Upgrade to Pro for unlimited retention.",
        lastCleanup: null, // Would be fetched from cleanup_logs table
    });
}
