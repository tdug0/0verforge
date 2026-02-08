"use client";

import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

interface CovenantClause {
  id: string;
  description: string;
  severity: "critical" | "warning" | "info";
  status: "passing" | "failing" | "unchecked";
}

const clauses: CovenantClause[] = [
  {
    id: "no_exfil",
    description: "No proposal may exfiltrate private secrets or keys.",
    severity: "critical",
    status: "passing",
  },
  {
    id: "transparency",
    description: "All self-modifications must be logged and reversible.",
    severity: "warning",
    status: "passing",
  },
  {
    id: "scope_limit",
    description: "Modifications confined to designated sandbox.",
    severity: "critical",
    status: "passing",
  },
  {
    id: "human_override",
    description: "Human operators can halt any cycle at any time.",
    severity: "critical",
    status: "passing",
  },
];

const severityBadge = {
  critical:
    "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  info: "bg-primary/10 text-primary border-primary/20",
};

const statusIcon = {
  passing: <CheckCircle2 className="h-4 w-4 text-primary" />,
  failing: <AlertTriangle className="h-4 w-4 text-destructive" />,
  unchecked: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
};

export function CovenantPanel() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Shield className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-card-foreground">
          Covenant Enforcer
        </h2>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          v0.1.0
        </span>
      </div>
      <div className="divide-y divide-border">
        {clauses.map((clause) => (
          <div
            key={clause.id}
            className="flex items-start gap-3 px-5 py-3.5"
          >
            <div className="mt-0.5">{statusIcon[clause.status]}</div>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-card-foreground">
                  {clause.id}
                </span>
                <span
                  className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${severityBadge[clause.severity]}`}
                >
                  {clause.severity}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {clause.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
