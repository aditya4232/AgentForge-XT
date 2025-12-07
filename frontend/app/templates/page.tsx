'use client'

import { Navbar } from "@/components/navbar";
import { useTemplates, useCloneTemplate } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MOCK_TEMPLATES = [
    {
        id: '1',
        name: 'Blog Writer Team',
        description: 'Complete blog post creation with research, writing, and SEO optimization',
        category: 'Content',
        agents: ['Researcher', 'Writer', 'SEO Optimizer'],
        use_count: 1250,
        rating: 4.8,
    },
    {
        id: '2',
        name: 'Code Review Team',
        description: 'Automated code review with security and performance analysis',
        category: 'Development',
        agents: ['Coder', 'Security Reviewer', 'Performance Optimizer'],
        use_count: 890,
        rating: 4.9,
    },
    {
        id: '3',
        name: 'Market Research Team',
        description: 'Comprehensive market analysis and reporting',
        category: 'Business',
        agents: ['Data Collector', 'Analyst', 'Report Writer'],
        use_count: 670,
        rating: 4.7,
    },
    {
        id: '4',
        name: 'Customer Support Team',
        description: 'Intelligent ticket classification and response generation',
        category: 'Support',
        agents: ['Ticket Classifier', 'Responder', 'Quality Checker'],
        use_count: 1100,
        rating: 4.6,
    },
    {
        id: '5',
        name: 'Social Media Team',
        description: 'Create engaging social media content across platforms',
        category: 'Marketing',
        agents: ['Content Creator', 'Hashtag Optimizer', 'Scheduler'],
        use_count: 950,
        rating: 4.5,
    },
    {
        id: '6',
        name: 'Data Analysis Team',
        description: 'Extract insights from data with visualization',
        category: 'Analytics',
        agents: ['Data Analyst', 'Visualizer', 'Insight Generator'],
        use_count: 780,
        rating: 4.8,
    },
];

export default function TemplatesPage() {
    const { mutate: cloneTemplate } = useCloneTemplate();

    const handleClone = (templateId: string, templateName: string) => {
        cloneTemplate(templateId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Agent Team Templates 🏪</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Pre-built agent teams ready to use. Clone and customize to your needs.
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">All</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">Content</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">Development</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">Business</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">Marketing</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">Analytics</Badge>
                </div>

                {/* Templates Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_TEMPLATES.map((template) => (
                        <Card key={template.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
                                        <Badge variant="secondary">{template.category}</Badge>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold">⭐ {template.rating}</div>
                                        <div className="text-xs text-slate-500">{template.use_count} uses</div>
                                    </div>
                                </div>
                                <CardDescription className="mt-3">
                                    {template.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-sm font-medium mb-2">Agents:</div>
                                        <div className="flex flex-wrap gap-1">
                                            {template.agents.map((agent, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                    {agent}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleClone(template.id, template.name)}
                                        className="w-full"
                                    >
                                        Clone Template
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
