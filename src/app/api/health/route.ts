import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { n8nClient } from "@/lib/n8n-client";
import { openAIClient } from "@/lib/openai-client";
import { isFirebaseConfigured } from "@/lib/firebase";

export const dynamic = 'force-dynamic';

interface ServiceHealth {
    status: 'operational' | 'degraded' | 'down' | 'not_configured';
    latency?: number;
    message?: string;
}

interface HealthResponse {
    status: 'healthy' | 'degraded' | 'unhealthy';
    version: string;
    timestamp: string;
    uptime: number;
    services: {
        api: ServiceHealth;
        database: ServiceHealth;
        auth: ServiceHealth;
        ai: ServiceHealth;
        n8n: ServiceHealth;
    };
    environment: string;
}

// Track start time for uptime
const startTime = Date.now();

async function checkSupabase(): Promise<ServiceHealth> {
    if (!isSupabaseConfigured || !supabase) {
        return { status: 'not_configured', message: 'Supabase not configured' };
    }

    try {
        const start = Date.now();
        const { error } = await supabase.from('node_templates').select('count').limit(1);
        const latency = Date.now() - start;

        if (error) {
            return { status: 'degraded', latency, message: error.message };
        }
        return { status: 'operational', latency };
    } catch (error) {
        return {
            status: 'down',
            message: error instanceof Error ? error.message : 'Connection failed'
        };
    }
}

async function checkN8n(): Promise<ServiceHealth> {
    try {
        const start = Date.now();
        const isConfigured = await n8nClient.isConfigured();
        const latency = Date.now() - start;

        if (!isConfigured) {
            return {
                status: 'not_configured',
                latency,
                message: 'n8n not running or accessible'
            };
        }
        return { status: 'operational', latency };
    } catch (error) {
        return {
            status: 'down',
            message: error instanceof Error ? error.message : 'Connection failed'
        };
    }
}

function checkAI(): ServiceHealth {
    if (!openAIClient.isConfigured()) {
        return {
            status: 'not_configured',
            message: 'OpenAI API key not configured'
        };
    }
    return { status: 'operational' };
}

function checkAuth(): ServiceHealth {
    if (!isFirebaseConfigured) {
        return {
            status: 'not_configured',
            message: 'Firebase not configured'
        };
    }
    return { status: 'operational' };
}

function getOverallStatus(services: HealthResponse['services']): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(services);

    // Critical services
    const apiDown = services.api.status === 'down';
    const dbDown = services.database.status === 'down';
    const authDown = services.auth.status === 'down';

    if (apiDown || (dbDown && authDown)) {
        return 'unhealthy';
    }

    // Any degraded or down non-critical service
    const hasIssues = statuses.some(s => s.status === 'degraded' || s.status === 'down');
    const hasNotConfigured = statuses.some(s => s.status === 'not_configured');

    if (hasIssues) {
        return 'degraded';
    }

    return 'healthy';
}

export async function GET() {
    const [database, n8n] = await Promise.all([
        checkSupabase(),
        checkN8n(),
    ]);

    const services = {
        api: { status: 'operational' as const },
        database,
        auth: checkAuth(),
        ai: checkAI(),
        n8n,
    };

    const response: HealthResponse = {
        status: getOverallStatus(services),
        version: process.env.npm_package_version || "1.0.0",
        timestamp: new Date().toISOString(),
        uptime: Math.floor((Date.now() - startTime) / 1000),
        services,
        environment: process.env.NODE_ENV || 'development',
    };

    // Return appropriate status code
    const statusCode = response.status === 'unhealthy' ? 503 : 200;

    return NextResponse.json(response, { status: statusCode });
}
