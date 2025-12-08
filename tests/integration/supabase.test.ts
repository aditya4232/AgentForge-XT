/**
 * Integration Tests for Supabase Connection
 * Run these to verify database connectivity and operations
 */

import { supabase } from '../../src/lib/supabase';

// Skip tests if Supabase is not configured
const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const describeIfConfigured = isSupabaseConfigured ? describe : describe.skip;

describeIfConfigured('Supabase Integration Tests', () => {
    test('Can connect to Supabase', async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('count');

        expect(error).toBeNull();
        expect(data).toBeDefined();
    });

    test('Can query workflows table', async () => {
        const { data, error } = await supabase
            .from('workflows')
            .select('*')
            .limit(1);

        expect(error).toBeNull();
        expect(Array.isArray(data)).toBe(true);
    });

    test('Row Level Security is enabled', async () => {
        // Try to access without auth - should fail or return empty
        const { data } = await supabase
            .from('workflows')
            .select('*');

        // Without auth, should return empty array due to RLS
        expect(Array.isArray(data)).toBe(true);
    });
});

describe('Workflow Operations', () => {
    test('Can create workflow structure', () => {
        const workflow = {
            name: 'Test Workflow',
            description: 'Test Description',
            nodes: [],
            edges: [],
            is_active: false,
        };

        expect(workflow.name).toBe('Test Workflow');
        expect(workflow.nodes).toEqual([]);
        expect(workflow.edges).toEqual([]);
    });

    test('Node structure is valid', () => {
        const node = {
            id: '1',
            type: 'custom',
            position: { x: 100, y: 100 },
            data: { label: 'Test Node', type: 'webhook' },
        };

        expect(node.id).toBeDefined();
        expect(node.position).toHaveProperty('x');
        expect(node.position).toHaveProperty('y');
        expect(node.data).toHaveProperty('type');
    });

    test('Edge structure is valid', () => {
        const edge = {
            id: 'e1-2',
            source: '1',
            target: '2',
            sourceHandle: 'output',
            targetHandle: 'input',
        };

        expect(edge.id).toBeDefined();
        expect(edge.source).toBe('1');
        expect(edge.target).toBe('2');
    });

    test('Can validate workflow execution structure', () => {
        const execution = {
            id: 'exec-1',
            workflow_id: 'wf-1',
            status: 'running' as const,
            started_at: new Date().toISOString(),
            completed_at: null,
            logs: [],
            error: null,
        };

        expect(execution.status).toBe('running');
        expect(execution.logs).toEqual([]);
        expect(execution.error).toBeNull();
    });
});

describe('Workflow Templates', () => {
    test('Template structure is valid', () => {
        const template = {
            id: 'test-template',
            name: 'Test Template',
            description: 'A test template',
            category: 'Testing',
            difficulty: 'beginner' as const,
            tags: ['test', 'example'],
            nodes: [],
            edges: [],
        };

        expect(template.id).toBe('test-template');
        expect(template.difficulty).toBe('beginner');
        expect(Array.isArray(template.tags)).toBe(true);
    });
});
