import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Environment configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create client only if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Helper to get supabase client with error handling
export function getSupabaseClient(): SupabaseClient {
    if (!supabase) {
        throw new Error('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.');
    }
    return supabase;
}

// ============================================
// Database Types
// ============================================

export interface Profile {
    id: string;
    firebase_uid: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserSettings {
    id: string;
    user_id: string;
    openai_api_key_encrypted: string | null;
    openai_base_url: string;
    openai_default_model: string;
    n8n_url: string;
    n8n_api_key_encrypted: string | null;
    qdrant_url: string;
    qdrant_api_key_encrypted: string | null;
    auto_save: boolean;
    notifications_enabled: boolean;
    theme: string;
    created_at: string;
    updated_at: string;
}

export interface Workflow {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    is_active: boolean;
    n8n_workflow_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface WorkflowNode {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: {
        label: string;
        type?: string;
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
    n8n_execution_id: string | null;
    status: "pending" | "running" | "success" | "failed";
    started_at: string;
    completed_at: string | null;
    duration_ms: number | null;
    logs: ExecutionLog[];
    error: string | null;
    input_data: Record<string, unknown> | null;
    output_data: Record<string, unknown> | null;
}

export interface ExecutionLog {
    nodeId: string;
    nodeName: string;
    status: "success" | "error" | "skipped";
    output?: unknown;
    error?: string;
    timestamp: string;
}

export interface NodeTemplate {
    id: string;
    type: string;
    name: string;
    description: string | null;
    icon: string;
    category: string;
    config_schema: Record<string, unknown> | null;
    is_trigger: boolean;
    n8n_node_type: string | null;
    created_at: string;
}

export interface Webhook {
    id: string;
    workflow_id: string;
    path: string;
    method: string;
    is_active: boolean;
    last_triggered_at: string | null;
    trigger_count: number;
    created_at: string;
}

export interface ApiKey {
    id: string;
    user_id: string;
    name: string;
    key_hash: string;
    key_prefix: string;
    scopes: string[];
    last_used_at: string | null;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
}

// ============================================
// Database Helper Functions
// ============================================

/**
 * Get or create a user profile from Firebase UID
 */
export async function getOrCreateProfile(
    firebaseUid: string,
    email: string,
    fullName?: string,
    avatarUrl?: string
): Promise<Profile | null> {
    const client = getSupabaseClient();

    // Try to get existing profile
    const { data: existing, error: fetchError } = await client
        .from('profiles')
        .select('*')
        .eq('firebase_uid', firebaseUid)
        .single();

    if (existing) {
        return existing as Profile;
    }

    // Create new profile
    const { data: created, error: createError } = await client
        .from('profiles')
        .insert({
            firebase_uid: firebaseUid,
            email,
            full_name: fullName || null,
            avatar_url: avatarUrl || null,
        })
        .select()
        .single();

    if (createError) {
        console.error('Error creating profile:', createError);
        return null;
    }

    return created as Profile;
}

/**
 * Get user workflows
 */
export async function getUserWorkflows(userId: string): Promise<Workflow[]> {
    const client = getSupabaseClient();

    const { data, error } = await client
        .from('workflows')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching workflows:', error);
        return [];
    }

    return data as Workflow[];
}

/**
 * Get workflow by ID
 */
export async function getWorkflow(workflowId: string): Promise<Workflow | null> {
    const client = getSupabaseClient();

    const { data, error } = await client
        .from('workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

    if (error) {
        console.error('Error fetching workflow:', error);
        return null;
    }

    return data as Workflow;
}

/**
 * Create a new workflow
 */
export async function createWorkflow(
    userId: string,
    name: string,
    description?: string
): Promise<Workflow | null> {
    const client = getSupabaseClient();

    const { data, error } = await client
        .from('workflows')
        .insert({
            user_id: userId,
            name,
            description: description || null,
            nodes: [],
            edges: [],
            is_active: false,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating workflow:', error);
        return null;
    }

    return data as Workflow;
}

/**
 * Update a workflow
 */
export async function updateWorkflow(
    workflowId: string,
    updates: Partial<Pick<Workflow, 'name' | 'description' | 'nodes' | 'edges' | 'is_active'>>
): Promise<Workflow | null> {
    const client = getSupabaseClient();

    const { data, error } = await client
        .from('workflows')
        .update(updates)
        .eq('id', workflowId)
        .select()
        .single();

    if (error) {
        console.error('Error updating workflow:', error);
        return null;
    }

    return data as Workflow;
}

/**
 * Delete a workflow
 */
export async function deleteWorkflow(workflowId: string): Promise<boolean> {
    const client = getSupabaseClient();

    const { error } = await client
        .from('workflows')
        .delete()
        .eq('id', workflowId);

    if (error) {
        console.error('Error deleting workflow:', error);
        return false;
    }

    return true;
}

/**
 * Get recent executions
 */
export async function getRecentExecutions(
    workflowId?: string,
    limit: number = 20
): Promise<Execution[]> {
    const client = getSupabaseClient();

    let query = client
        .from('executions')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(limit);

    if (workflowId) {
        query = query.eq('workflow_id', workflowId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching executions:', error);
        return [];
    }

    return data as Execution[];
}

/**
 * Create an execution record
 */
export async function createExecution(
    workflowId: string,
    inputData?: Record<string, unknown>
): Promise<Execution | null> {
    const client = getSupabaseClient();

    const { data, error } = await client
        .from('executions')
        .insert({
            workflow_id: workflowId,
            status: 'pending',
            input_data: inputData || null,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating execution:', error);
        return null;
    }

    return data as Execution;
}

/**
 * Update execution status
 */
export async function updateExecution(
    executionId: string,
    updates: Partial<Pick<Execution, 'status' | 'completed_at' | 'duration_ms' | 'logs' | 'error' | 'output_data'>>
): Promise<Execution | null> {
    const client = getSupabaseClient();

    const { data, error } = await client
        .from('executions')
        .update(updates)
        .eq('id', executionId)
        .select()
        .single();

    if (error) {
        console.error('Error updating execution:', error);
        return null;
    }

    return data as Execution;
}

/**
 * Get node templates
 */
export async function getNodeTemplates(category?: string): Promise<NodeTemplate[]> {
    const client = getSupabaseClient();

    let query = client
        .from('node_templates')
        .select('*')
        .order('category', { ascending: true });

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching node templates:', error);
        return [];
    }

    return data as NodeTemplate[];
}
