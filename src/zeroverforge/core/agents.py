# MIT License
from typing import Dict, Any
import asyncio

class SubAgent:
    def __init__(self, name: str, config: Dict[str, Any] | None = None):
        self.name = name
        self.config = config or {}
        self._running = False

    @classmethod
    def create(cls, cfg: Dict[str, Any]) -> 'SubAgent':
        return SubAgent(cfg.get('name', 'agent'))

    async def run(self, orchestrator):
        self._running = True
        while self._running:
            await asyncio.sleep(self.config.get('interval', 10))

    async def stop(self):
        self._running = False
