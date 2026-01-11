"""
# MIT License
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from typing import Dict, Any
from src.zeroverforge.core.orchestrator import CoreOrchestrator

router = APIRouter(prefix='/api/v1')

_orch = CoreOrchestrator.from_config(None)

@router.get('/status')
async def status():
    return JSONResponse({"status": "ok", "rsi_running": True})

@router.post('/commands')
async def submit_command(payload: Dict[str, Any]):
    pid = payload.get('id') or 'manual-' + str(hash(str(payload)))
    return JSONResponse({"accepted": True, "payload_id": pid})

class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        try:
            self.active.remove(ws)
        except ValueError:
            pass

    async def broadcast(self, msg: Dict[str, Any]):
        living = []
        for ws in list(self.active):
            try:
                await ws.send_json(msg)
                living.append(ws)
            except Exception:
                pass
        self.active = living

manager = ConnectionManager()

@router.websocket('/ws')
async def websocket_endpoint(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            msg = await ws.receive_text()
            await ws.send_text(msg)
    except WebSocketDisconnect:
        manager.disconnect(ws)
"""
