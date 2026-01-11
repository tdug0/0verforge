# MIT License
from typing import Dict, Any, List
from .git_manager import GitRepoManager

class VariantArchive:
    def __init__(self, git: GitRepoManager):
        self.git = git
        self._store: List[Dict[str, Any]] = []

    async def record_variant(self, commit: str, metadata: Dict[str, Any]):
        self._store.append({"commit": commit, "meta": metadata})

    async def record_cycle(self, reflection, analysis, proposals, results):
        self._store.append({"cycle": {"reflection": reflection, "analysis": analysis, "results": results}})

    async def flush(self):
        pass
