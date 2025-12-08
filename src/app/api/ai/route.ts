import { NextRequest, NextResponse } from 'next/server';
import { openAIClient } from '@/lib/openai-client';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, messages, text, options } = body;

        if (!openAIClient.isConfigured()) {
            return NextResponse.json(
                { error: 'OpenAI API key is not configured' },
                { status: 400 }
            );
        }

        switch (action) {
            case 'chat':
                if (!messages || !Array.isArray(messages)) {
                    return NextResponse.json(
                        { error: 'messages array is required' },
                        { status: 400 }
                    );
                }
                const chatResponse = await openAIClient.createChatCompletion(messages, options);
                return NextResponse.json({ response: chatResponse });

            case 'simple-chat':
                if (!text) {
                    return NextResponse.json(
                        { error: 'text is required' },
                        { status: 400 }
                    );
                }
                const simpleResponse = await openAIClient.chat(
                    text,
                    options?.systemPrompt,
                    options
                );
                return NextResponse.json({ response: simpleResponse });

            case 'embedding':
                if (!text) {
                    return NextResponse.json(
                        { error: 'text is required' },
                        { status: 400 }
                    );
                }
                const embedding = await openAIClient.createEmbedding(text, options);
                return NextResponse.json({ embedding });

            case 'function-call':
                if (!text || !options?.functions) {
                    return NextResponse.json(
                        { error: 'text and functions are required' },
                        { status: 400 }
                    );
                }
                const functionResult = await openAIClient.callFunction(
                    text,
                    options.functions,
                    options.systemPrompt
                );
                return NextResponse.json({ result: functionResult });

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Error processing AI request:', error);
        return NextResponse.json(
            { error: 'Failed to process AI request' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        configured: openAIClient.isConfigured(),
        models: [
            'gpt-4-turbo-preview',
            'gpt-4',
            'gpt-3.5-turbo',
            'text-embedding-3-small',
            'text-embedding-3-large',
        ],
    });
}
