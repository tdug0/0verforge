# MIT License
import asyncio

from src.zeroverforge.core.orchestrator import CoreOrchestrator

async def test_orchestrator_runs_once():
    orch = CoreOrchestrator()
    await orch.start()
    # run a single cycle
    await orch.rsi.cycle_once()
    await orch.shutdown()

def test_smoke():
    asyncio.run(test_orchestrator_runs_once())
