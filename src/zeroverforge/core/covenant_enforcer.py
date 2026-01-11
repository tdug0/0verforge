# MIT License
from typing import Callable, Dict, Any
from .covenant import Covenant, CovenantDecision, CovenantClause, ViolationSeverity

Checker = Callable[[Dict[str, Any]], Dict[str, Any]]

class CovenantEnforcer:
    def __init__(self, covenant: Covenant, checkers: Dict[str, Checker] | None = None):
        self.covenant = covenant
        self.checkers = checkers or {}

    async def evaluate(self, proposal: Dict[str, Any]) -> CovenantDecision:
        violations = []
        for clause in self.covenant.clauses:
            checker = self.checkers.get(clause.check)
            if not checker:
                if clause.severity == ViolationSeverity.CRITICAL:
                    return CovenantDecision(allowed=False, reason=f"Missing checker for {clause.id}", violations=[{"clause": clause.id}])
                else:
                    violations.append({"clause": clause.id, "reason": "missing_checker"})
                    continue
            try:
                res = checker(proposal)
            except Exception as e:
                if clause.severity == ViolationSeverity.CRITICAL:
                    return CovenantDecision(allowed=False, reason=str(e), violations=[{"clause": clause.id, "error": str(e)}])
                violations.append({"clause": clause.id, "error": str(e)})
                continue
            if not res.get('ok', False):
                violations.append({"clause": clause.id, "detail": res.get('detail', '')})
                if clause.severity == ViolationSeverity.CRITICAL:
                    return CovenantDecision(allowed=False, reason=f"Critical violation {clause.id}", violations=violations)
        allowed = True
        reason = "OK"
        if violations:
            reason = "Allowed with warnings"
        return CovenantDecision(allowed=allowed, reason=reason, violations=violations)
