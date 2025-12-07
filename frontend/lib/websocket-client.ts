/**
 * WebSocket Client
 * Real-time communication with backend
 */

'use client'

import { io, Socket } from 'socket.io-client'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'

class WebSocketClient {
    private socket: Socket | null = null
    private listeners: Map<string, Set<Function>> = new Map()

    connect() {
        if (this.socket?.connected) return

        this.socket = io(`${WS_URL}/ws`, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        })

        this.socket.on('connect', () => {
            console.log('WebSocket connected')
        })

        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected')
        })

        this.socket.on('execution_update', (data) => {
            this.emit('execution_update', data)
        })

        this.socket.on('connection_established', (data) => {
            console.log('Connection established:', data)
        })
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    subscribeToExecution(executionId: string) {
        if (!this.socket) this.connect()
        this.socket?.emit('subscribe_execution', { execution_id: executionId })
    }

    unsubscribeFromExecution(executionId: string) {
        this.socket?.emit('unsubscribe_execution', { execution_id: executionId })
    }

    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }
        this.listeners.get(event)?.add(callback)
    }

    off(event: string, callback: Function) {
        this.listeners.get(event)?.delete(callback)
    }

    private emit(event: string, data: any) {
        this.listeners.get(event)?.forEach((callback) => callback(data))
    }
}

export const wsClient = new WebSocketClient()
