# MIT License
from typing import Dict, Any, List
import asyncio
from .git_manager import GitRepoManager
from .archive import VariantArchive
from .rsi_engine import RSIEngine
from .covenant_enforcer import CovenantEnforcer
from .covenant import Covenant
from .agents import SubAgent

class CoreOrchestrator:
    def __init__(self, config: Dict[str, Any] | None = None):
        self.config = config or {}
        self.git = GitRepoManager('.')
        self.archive = VariantArchive(self.git)
        covenant = Covenant()
        self.covenant_enforcer = CovenantEnforcer(covenant)
        self.rsi = RSIEngine(self.git, self.archive, self.covenant_enforcer, config=self.config)
        self.agents: List[SubAgent] = []
        self._stop = False

    @classmethod
    def from_config(cls, path: str | None = None) -> 'CoreOrchestrator':
        # simple placeholder loader
        return cls()

    async def start(self):
        # start background tasks (agents) if any
        return

    async def run(self):
        while not self._stop:
            await self.rsi.cycle_once()
            await asyncio.sleep(self.config.get('rsi_interval_s', 5))

    async def shutdown(self):
        self._stop = True
