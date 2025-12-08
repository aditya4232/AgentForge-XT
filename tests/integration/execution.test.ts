/**
 * Integration Tests for Workflow Execution
 */

import { POST } from '@/app/api/workflows/[id]/execute/route';
import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn(),
    },
    isSupabaseConfigured: true,
}));

jest.mock('@/lib/n8n-client', () => ({
    n8nClient: {
        isConfigured: jest.fn().mockReturnValue(Promise.resolve(false)), // Force local execution
        executeWorkflow: jest.fn(),
    },
}));

jest.mock('@/lib/openai-client', () => ({
    openAIClient: {
        isConfigured: jest.fn().mockReturnValue(true),
        chat: jest.fn().mockResolvedValue("AI Test Response"),
    },
}));

describe('Workflow Local Execution', () => {
    let mockSupabaseFrom: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSupabaseFrom = (supabase as any).from;
    });

    test('should execute AI chat node correctly', async () => {
        const workflowId = 'test-wf-id';
        const executionId = 'test-exec-id';

        // Mock DB responses
        const mockSelect = jest.fn();
        const mockInsert = jest.fn();
        const mockUpdate = jest.fn();
        const mockEq = jest.fn();
        const mockSingle = jest.fn();

        // Chain mocking
        mockSupabaseFrom.mockReturnValue({
            select: mockSelect,
            insert: mockInsert,
            update: mockUpdate,
        });

        // Workflow fetch mock
        mockSelect.mockReturnValue({
            eq: mockEq.mockReturnValue({
                single: mockSingle.mockResolvedValue({
                    data: {
                        id: workflowId,
                        nodes: [
                            { id: '1', data: { type: 'webhook', label: 'Start' } },
                            { id: '2', data: { type: 'ai_chat', config: { model: 'gpt-4' } } }
                        ],
                        edges: [
                            { source: '1', target: '2' }
                        ],
                        n8n_id: null
                    },
                    error: null
                })
            })
        });

        // Execution creation mock
        mockInsert.mockReturnValue({
            select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                    data: { id: executionId },
                    error: null
                })
            })
        });

        // Execution update mock
        mockUpdate.mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null })
        });

        // Create Request
        const req = new NextRequest(`http://localhost:3000/api/workflows/${workflowId}/execute`, {
            method: 'POST'
        });

        const response = await POST(req, { params: { id: workflowId } });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.execution.status).toBe('success');
        expect(data.execution.logs).toHaveLength(2); // Webhook + AI Chat
        expect(data.execution.logs[1].message).toContain('AI Responded');
    });
});
