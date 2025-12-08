import { NextRequest, NextResponse } from 'next/server';
import { n8nClient } from '@/lib/n8n-client';

export async function GET() {
    try {
        const isConfigured = await n8nClient.isConfigured();

        if (!isConfigured) {
            return NextResponse.json({
                status: 'disconnected',
                message: 'n8n is not running or not accessible',
            });
        }

        const workflows = await n8nClient.getWorkflows();
        const executions = await n8nClient.getExecutions(undefined, 10);

        return NextResponse.json({
            status: 'connected',
            workflows: workflows.length,
            recentExecutions: executions.length,
            url: process.env.NEXT_PUBLIC_N8N_URL || 'http://localhost:5678',
        });
    } catch (error) {
        console.error('Error checking n8n status:', error);
        return NextResponse.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, workflowId, data } = body;

        switch (action) {
            case 'execute':
                if (!workflowId) {
                    return NextResponse.json(
                        { error: 'workflowId is required' },
                        { status: 400 }
                    );
                }
                const execution = await n8nClient.executeWorkflow(workflowId, data);
                return NextResponse.json({ execution });

            case 'sync':
                // Sync workflow from AgentForge to n8n
                if (!data) {
                    return NextResponse.json(
                        { error: 'workflow data is required' },
                        { status: 400 }
                    );
                }
                const n8nWorkflow = n8nClient.convertToN8nWorkflow(data);
                const created = await n8nClient.createWorkflow(n8nWorkflow);
                return NextResponse.json({ workflow: created });

            case 'activate':
                if (!workflowId) {
                    return NextResponse.json(
                        { error: 'workflowId is required' },
                        { status: 400 }
                    );
                }
                const activated = await n8nClient.setWorkflowActive(workflowId, true);
                return NextResponse.json({ success: activated });

            case 'deactivate':
                if (!workflowId) {
                    return NextResponse.json(
                        { error: 'workflowId is required' },
                        { status: 400 }
                    );
                }
                const deactivated = await n8nClient.setWorkflowActive(workflowId, false);
                return NextResponse.json({ success: deactivated });

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error processing n8n action:', error);
        return NextResponse.json(
            { error: 'Failed to process action' },
            { status: 500 }
        );
    }
}
