# MIT License
import subprocess
from typing import List, Dict

class GitRepoManager:
    def __init__(self, repo_path: str = '.'):
        self.repo_path = repo_path

    async def recent_commits(self, n: int = 10) -> List[Dict[str, str]]:
        out = subprocess.check_output(["git", "log", f"--max-count={n}", "--pretty=%H;%an;%s"], cwd=self.repo_path).decode()
        lines = [l for l in out.strip().splitlines() if l]
        res = []
        for l in lines:
            try:
                h, a, s = l.split(";", 2)
            except ValueError:
                continue
            res.append({"hash": h, "author": a, "subject": s})
        return res

    async def create_branch_from(self, base: str, name: str) -> str:
        subprocess.check_call(["git", "checkout", "-b", name, base], cwd=self.repo_path)
        return name

    async def apply_patch(self, patch_text: str, branch: str) -> str:
        # Simplified: write patch to file and commit
        import tempfile, os, uuid
        fname = f"/tmp/patch-{uuid.uuid4().hex}.diff"
        with open(fname, 'w') as f:
            f.write(patch_text)
        # This is a placeholder; real implementation should apply patch safely
        return "commit-placeholder"

    async def rollback(self, commit: str) -> None:
        subprocess.check_call(["git", "revert", "--no-edit", commit], cwd=self.repo_path)
