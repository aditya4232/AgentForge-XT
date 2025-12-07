/**
 * React Query Hooks
 * Custom hooks for data fetching with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './api-client'
import { toast } from 'sonner'

// Agents
export function useAgents() {
    return useQuery({
        queryKey: ['agents'],
        queryFn: () => apiClient.getAgents(),
    })
}

export function useAgent(id: string) {
    return useQuery({
        queryKey: ['agents', id],
        queryFn: () => apiClient.getAgent(id),
        enabled: !!id,
    })
}

export function useCreateAgent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: any) => apiClient.createAgent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agents'] })
            toast.success('Agent created successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create agent')
        },
    })
}

export function useUpdateAgent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            apiClient.updateAgent(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['agents'] })
            queryClient.invalidateQueries({ queryKey: ['agents', variables.id] })
            toast.success('Agent updated successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update agent')
        },
    })
}

export function useDeleteAgent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => apiClient.deleteAgent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agents'] })
            toast.success('Agent deleted successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete agent')
        },
    })
}

// Workflows
export function useWorkflows() {
    return useQuery({
        queryKey: ['workflows'],
        queryFn: () => apiClient.getWorkflows(),
    })
}

export function useWorkflow(id: string) {
    return useQuery({
        queryKey: ['workflows', id],
        queryFn: () => apiClient.getWorkflow(id),
        enabled: !!id,
    })
}

export function useCreateWorkflow() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: any) => apiClient.createWorkflow(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflows'] })
            toast.success('Workflow created successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create workflow')
        },
    })
}

// Executions
export function useExecutions(workflowId?: string) {
    return useQuery({
        queryKey: ['executions', workflowId],
        queryFn: () => apiClient.getExecutions(workflowId),
    })
}

export function useExecution(id: string) {
    return useQuery({
        queryKey: ['executions', id],
        queryFn: () => apiClient.getExecution(id),
        enabled: !!id,
        refetchInterval: 2000, // Poll every 2 seconds for active executions
    })
}

export function useCreateExecution() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: any) => apiClient.createExecution(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['executions'] })
            toast.success('Execution started')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to start execution')
        },
    })
}

// Templates
export function useTemplates(category?: string) {
    return useQuery({
        queryKey: ['templates', category],
        queryFn: () => apiClient.getTemplates(category),
    })
}

export function useTemplate(id: string) {
    return useQuery({
        queryKey: ['templates', id],
        queryFn: () => apiClient.getTemplate(id),
        enabled: !!id,
    })
}

export function useCloneTemplate() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => apiClient.cloneTemplate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflows'] })
            toast.success('Template cloned successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to clone template')
        },
    })
}
