# MIT License
import aiohttp
import websockets
import json
from typing import Any, Dict, Callable

class AgentClient:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self._session = aiohttp.ClientSession()

    async def submit_proposal(self, proposal: Dict[str, Any]) -> Dict[str, Any]:
        async with self._session.post(f"{self.base_url}/api/v1/commands", json=proposal) as r:
            return await r.json()

    async def get_status(self) -> Dict[str, Any]:
        async with self._session.get(f"{self.base_url}/api/v1/status") as r:
            return await r.json()

    async def ws_listen(self, on_message: Callable[[Dict[str, Any]], None]):
        uri = self.base_url.replace('http', 'ws') + '/ws'
        async with websockets.connect(uri) as ws:
            async for msg in ws:
                on_message(json.loads(msg))
