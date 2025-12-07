"""
WebSocket Support for Real-Time Updates
Provides live execution updates to frontend
"""

import socketio
from typing import Dict, Any

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True,
)

socket_app = socketio.ASGIApp(sio)


@sio.event
async def connect(sid, environ):
    """Handle client connection"""
    print(f"Client connected: {sid}")
    await sio.emit('connection_established', {'sid': sid}, room=sid)


@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    print(f"Client disconnected: {sid}")


@sio.event
async def subscribe_execution(sid, data: Dict[str, Any]):
    """Subscribe to execution updates"""
    execution_id = data.get('execution_id')
    if execution_id:
        await sio.enter_room(sid, f"execution_{execution_id}")
        print(f"Client {sid} subscribed to execution {execution_id}")


@sio.event
async def unsubscribe_execution(sid, data: Dict[str, Any]):
    """Unsubscribe from execution updates"""
    execution_id = data.get('execution_id')
    if execution_id:
        await sio.leave_room(sid, f"execution_{execution_id}")
        print(f"Client {sid} unsubscribed from execution {execution_id}")


async def emit_execution_update(execution_id: str, update: Dict[str, Any]):
    """Emit execution update to all subscribed clients"""
    await sio.emit(
        'execution_update',
        update,
        room=f"execution_{execution_id}"
    )


async def emit_agent_status(execution_id: str, agent_name: str, status: str, message: str = ""):
    """Emit agent status update"""
    await emit_execution_update(execution_id, {
        'type': 'agent_status',
        'agent_name': agent_name,
        'status': status,
        'message': message,
    })


async def emit_agent_thought(execution_id: str, agent_name: str, thought: str):
    """Emit agent thought/reasoning"""
    await emit_execution_update(execution_id, {
        'type': 'agent_thought',
        'agent_name': agent_name,
        'thought': thought,
    })


async def emit_execution_complete(execution_id: str, result: Dict[str, Any]):
    """Emit execution completion"""
    await emit_execution_update(execution_id, {
        'type': 'execution_complete',
        'result': result,
    })


async def emit_execution_error(execution_id: str, error: str):
    """Emit execution error"""
    await emit_execution_update(execution_id, {
        'type': 'execution_error',
        'error': error,
    })
