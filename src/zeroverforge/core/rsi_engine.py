# MIT License
from typing import Dict, Any, List
from .git_manager import GitRepoManager
from .covenant_enforcer import CovenantEnforcer
from .archive import VariantArchive

class RSIEngine:
    def __init__(self, git: GitRepoManager, archive: VariantArchive, covenant: CovenantEnforcer, config: Dict[str, Any] | None = None):
        self.git = git
        self.archive = archive
        self.covenant = covenant
        self.config = config or {}

    async def cycle_once(self) -> List[Dict[str, Any]]:
        reflection = await self.reflect()
        analysis = await self.analyze(reflection)
        proposals = await self.propose(analysis)
        results = []
        for p in proposals:
            cov = await self.covenant.evaluate(p)
            if not cov.allowed:
                results.append({"proposal": p, "status": "vetoed", "reason": cov.reason})
                continue
            valid = await self.validate(p)
            if not valid.get('ok', False):
                results.append({"proposal": p, "status": "invalid", "details": valid})
                continue
            apply_res = await self.apply_staged(p)
            post = await self.post_evaluate(apply_res)
            if not post.get('ok', False):
                await self.git.rollback(apply_res.get('commit'))
                results.append({"proposal": p, "status": "rolled_back", "post": post})
            else:
                await self.archive.record_variant(apply_res.get('commit'), {"meta": p, "scores": post.get('scores')})
                results.append({"proposal": p, "status": "merged", "post": post})
        return results

    async def reflect(self) -> Dict[str, Any]:
        commits = await self.git.recent_commits(10)
        return {"commits": commits, "metrics": {}}

    async def analyze(self, reflection: Dict[str, Any]) -> Dict[str, Any]:
        return {"opportunities": []}

    async def propose(self, analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        return []

    async def validate(self, proposal: Dict[str, Any]) -> Dict[str, Any]:
        return {"ok": True}

    async def apply_staged(self, proposal: Dict[str, Any]) -> Dict[str, Any]:
        return {"ok": True, "branch": "staging/tmp", "commit": "cmt123"}

    async def post_evaluate(self, apply_res: Dict[str, Any]) -> Dict[str, Any]:
        return {"ok": True, "scores": {"performance": 1.0}}
