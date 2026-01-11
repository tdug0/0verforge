# MIT License
from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse

from ..core.orchestrator import CoreOrchestrator

app = FastAPI()
_orch = CoreOrchestrator()

@app.get('/api/v1/status')
async def status():
    return JSONResponse({"status": "ok", "rsi_running": True})

@app.post('/api/v1/commands')
async def commands(payload: dict):
    # naive accept
    return JSONResponse({"accepted": True, "payload_id": payload.get('id')})

@app.websocket('/ws')
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        await ws.send_json({"event": "welcome"})
        while True:
            data = await ws.receive_text()
            await ws.send_text(data)
    except Exception:
        await ws.close()

def create_app() -> FastAPI:
    return app
