import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Profile {
    id: string;
    workos_id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
}

export interface Workflow {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface WorkflowNode {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: {
        label: string;
        config?: Record<string, unknown>;
    };
}

export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
}

export interface Execution {
    id: string;
    workflow_id: string;
    status: "pending" | "running" | "success" | "failed";
    started_at: string;
    completed_at: string | null;
    logs: ExecutionLog[];
    error: string | null;
}

export interface ExecutionLog {
    nodeId: string;
    nodeName: string;
    status: "success" | "error" | "skipped";
    output?: unknown;
    error?: string;
    timestamp: string;
}
