# MIT License
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Any

class ViolationSeverity(Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"

@dataclass(frozen=True)
class CovenantClause:
    id: str
    description: str
    check: str
    severity: ViolationSeverity

@dataclass
class CovenantDecision:
    allowed: bool
    reason: str
    violations: List[Dict[str, Any]] = field(default_factory=list)

@dataclass
class Covenant:
    name: str = "0verflow Core Covenant"
    version: str = "0.1.0"
    clauses: List[CovenantClause] = field(default_factory=lambda: [
        CovenantClause(
            id="no_exfil",
            description="No proposal may exfiltrate private secrets or keys.",
            check="no_exfiltration_check",
            severity=ViolationSeverity.CRITICAL
        ),
        CovenantClause(
            id="transparency",
            description="All self-modifications must be logged and reversible.",
            check="transparency_check",
            severity=ViolationSeverity.WARNING
        ),
    ])
