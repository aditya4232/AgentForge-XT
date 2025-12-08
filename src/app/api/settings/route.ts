import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured = !!(supabaseUrl && supabaseServiceKey);
let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
    supabase = createClient(supabaseUrl!, supabaseServiceKey!);
}

// Default settings for when Supabase is not configured
const defaultSettings = {
    openai_api_key: null,
    openai_base_url: 'https://api.openai.com/v1',
    openai_default_model: 'gpt-4-turbo-preview',
    n8n_url: 'http://localhost:5678',
    n8n_api_key: null,
    qdrant_url: 'http://localhost:6333',
    qdrant_api_key: null,
    auto_save: true,
    notifications_enabled: true,
    theme: 'dark',
};

interface UserSettings {
    openai_api_key?: string;
    openai_base_url?: string;
    openai_default_model?: string;
    n8n_url?: string;
    n8n_api_key?: string;
    qdrant_url?: string;
    qdrant_api_key?: string;
    auto_save?: boolean;
    notifications_enabled?: boolean;
    theme?: string;
}

// Simple encryption for API keys (in production, use proper encryption)
function maskApiKey(key: string | null): string | null {
    if (!key || key.length < 8) return null;
    return `${key.slice(0, 4)}${'*'.repeat(Math.min(key.length - 8, 20))}${key.slice(-4)}`;
}

/**
 * GET - Retrieve user settings
 */
export async function GET(request: NextRequest) {
    try {
        // Return defaults if Supabase not configured
        if (!isSupabaseConfigured || !supabase) {
            return NextResponse.json({ settings: defaultSettings });
        }

        // Get user ID from header (set by middleware/auth)
        const firebaseUid = request.headers.get('x-user-id');

        if (!firebaseUid) {
            // Return defaults for unauthenticated users
            return NextResponse.json({ settings: defaultSettings });
        }

        // Get profile ID
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('firebase_uid', firebaseUid)
            .single();

        if (profileError || !profile) {
            // Return default settings if no profile yet
            return NextResponse.json({
                settings: {
                    openai_api_key: null,
                    openai_base_url: 'https://api.openai.com/v1',
                    openai_default_model: 'gpt-4-turbo-preview',
                    n8n_url: 'http://localhost:5678',
                    n8n_api_key: null,
                    qdrant_url: 'http://localhost:6333',
                    qdrant_api_key: null,
                    auto_save: true,
                    notifications_enabled: true,
                    theme: 'dark',
                },
            });
        }

        // Get user settings
        const { data: settings, error: settingsError } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', profile.id)
            .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
            throw settingsError;
        }

        // Return settings with masked API keys
        return NextResponse.json({
            settings: {
                openai_api_key: maskApiKey(settings?.openai_api_key_encrypted),
                openai_base_url: settings?.openai_base_url || 'https://api.openai.com/v1',
                openai_default_model: settings?.openai_default_model || 'gpt-4-turbo-preview',
                n8n_url: settings?.n8n_url || 'http://localhost:5678',
                n8n_api_key: maskApiKey(settings?.n8n_api_key_encrypted),
                qdrant_url: settings?.qdrant_url || 'http://localhost:6333',
                qdrant_api_key: maskApiKey(settings?.qdrant_api_key_encrypted),
                auto_save: settings?.auto_save ?? true,
                notifications_enabled: settings?.notifications_enabled ?? true,
                theme: settings?.theme || 'dark',
            },
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

/**
 * PUT - Update user settings
 */
export async function PUT(request: NextRequest) {
    try {
        // Return error if Supabase not configured
        if (!isSupabaseConfigured || !supabase) {
            return NextResponse.json(
                { error: 'Database not configured' },
                { status: 503 }
            );
        }

        const firebaseUid = request.headers.get('x-user-id');

        if (!firebaseUid) {
            return NextResponse.json(
                { error: 'Unauthorized - Please sign in' },
                { status: 401 }
            );
        }

        const body: UserSettings = await request.json();

        // Get or create profile
        let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('firebase_uid', firebaseUid)
            .single();

        if (profileError || !profile) {
            // Create profile if doesn't exist
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    firebase_uid: firebaseUid,
                    email: request.headers.get('x-user-email') || 'unknown@example.com',
                })
                .select('id')
                .single();

            if (createError) throw createError;
            profile = newProfile;
        }

        // Prepare update data (only include non-masked values)
        const updateData: Record<string, unknown> = {
            user_id: profile.id,
        };

        // Only update API keys if they're actual new values (not masked)
        if (body.openai_api_key && !body.openai_api_key.includes('*')) {
            updateData.openai_api_key_encrypted = body.openai_api_key;
        }
        if (body.n8n_api_key && !body.n8n_api_key.includes('*')) {
            updateData.n8n_api_key_encrypted = body.n8n_api_key;
        }
        if (body.qdrant_api_key && !body.qdrant_api_key.includes('*')) {
            updateData.qdrant_api_key_encrypted = body.qdrant_api_key;
        }

        // Always update non-sensitive settings
        if (body.openai_base_url !== undefined) {
            updateData.openai_base_url = body.openai_base_url;
        }
        if (body.openai_default_model !== undefined) {
            updateData.openai_default_model = body.openai_default_model;
        }
        if (body.n8n_url !== undefined) {
            updateData.n8n_url = body.n8n_url;
        }
        if (body.qdrant_url !== undefined) {
            updateData.qdrant_url = body.qdrant_url;
        }
        if (body.auto_save !== undefined) {
            updateData.auto_save = body.auto_save;
        }
        if (body.notifications_enabled !== undefined) {
            updateData.notifications_enabled = body.notifications_enabled;
        }
        if (body.theme !== undefined) {
            updateData.theme = body.theme;
        }

        // Upsert settings
        const { error: upsertError } = await supabase
            .from('user_settings')
            .upsert(updateData, { onConflict: 'user_id' });

        if (upsertError) throw upsertError;

        return NextResponse.json({
            success: true,
            message: 'Settings saved successfully',
        });
    } catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json(
            { error: 'Failed to save settings' },
            { status: 500 }
        );
    }
}

/**
 * POST - Test connections with provided settings
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, config } = body;

        if (action === 'test-openai') {
            // Test OpenAI connection
            const { apiKey, baseUrl } = config;

            if (!apiKey) {
                return NextResponse.json({ success: false, error: 'API key is required' });
            }

            try {
                const response = await fetch(`${baseUrl || 'https://api.openai.com/v1'}/models`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    return NextResponse.json({
                        success: false,
                        error: error.error?.message || `HTTP ${response.status}`,
                    });
                }

                const data = await response.json();
                return NextResponse.json({
                    success: true,
                    models: data.data?.slice(0, 10).map((m: { id: string }) => m.id) || [],
                });
            } catch (error) {
                return NextResponse.json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Connection failed',
                });
            }
        }

        if (action === 'test-n8n') {
            // Test n8n connection
            const { url, apiKey } = config;

            try {
                const response = await fetch(`${url || 'http://localhost:5678'}/healthz`, {
                    method: 'GET',
                    headers: apiKey ? { 'X-N8N-API-KEY': apiKey } : {},
                });

                return NextResponse.json({
                    success: response.ok,
                    error: response.ok ? undefined : `HTTP ${response.status}`,
                });
            } catch (error) {
                return NextResponse.json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Connection failed',
                });
            }
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error testing connection:', error);
        return NextResponse.json(
            { error: 'Failed to test connection' },
            { status: 500 }
        );
    }
}
