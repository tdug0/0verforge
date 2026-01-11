#!/usr/bin/env python3
# MIT License
"""CLI entrypoint for 0verflow: starts a simple orchestrator and the FastAPI API."""
import asyncio
import argparse
import logging

from src.zeroverforge.core.orchestrator import CoreOrchestrator
from src.zeroverforge.api.fastapi_app import create_app
import uvicorn

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("0verflow")

async def main_async(args):
    orch = CoreOrchestrator.from_config(args.config)
    await orch.start()
    if args.serve_api:
        config = uvicorn.Config(create_app(), host=args.host, port=args.port, log_level="info")
        server = uvicorn.Server(config)
        await asyncio.gather(server.serve(), orch.run())
    else:
        await orch.run()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', default='config.yaml')
    parser.add_argument('--serve-api', action='store_true')
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    try:
        asyncio.run(main_async(args))
    except KeyboardInterrupt:
        logger.info('Shutdown')

if __name__ == '__main__':
    main()
