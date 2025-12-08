import { NextRequest, NextResponse } from 'next/server';
import { workflowTemplates, getTemplateById, getTemplatesByCategory, getAllCategories, getAllTags } from '@/lib/workflow-templates';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    try {
        // Get single template by ID
        if (id) {
            const template = getTemplateById(id);
            if (!template) {
                return NextResponse.json(
                    { error: 'Template not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ template });
        }

        // Filter by category
        if (category) {
            const templates = getTemplatesByCategory(category);
            return NextResponse.json({ templates });
        }

        // Return all templates with metadata
        return NextResponse.json({
            templates: workflowTemplates,
            categories: getAllCategories(),
            tags: getAllTags(),
            total: workflowTemplates.length,
        });
    } catch (error) {
        console.error('Error fetching templates:', error);
        return NextResponse.json(
            { error: 'Failed to fetch templates' },
            { status: 500 }
        );
    }
}
