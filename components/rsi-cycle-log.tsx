"use client";

import { RotateCcw, GitMerge, Ban, Undo2 } from "lucide-react";

interface CycleEntry {
  id: number;
  timestamp: string;
  status: "merged" | "vetoed" | "rolled_back" | "invalid";
  proposal: string;
  detail: string;
}

const entries: CycleEntry[] = [
  {
    id: 1,
    timestamp: "2026-02-09 14:32:01",
    status: "merged",
    proposal: "Optimize reflect() query batching",
    detail: "Performance +12% on commit analysis",
  },
  {
    id: 2,
    timestamp: "2026-02-09 14:27:44",
    status: "vetoed",
    proposal: "Add external HTTP call in analyze()",
    detail: "Blocked by no_exfil covenant clause",
  },
  {
    id: 3,
    timestamp: "2026-02-09 14:23:18",
    status: "merged",
    proposal: "Cache recent_commits result",
    detail: "Reduced git subprocess calls by 40%",
  },
  {
    id: 4,
    timestamp: "2026-02-09 14:18:55",
    status: "rolled_back",
    proposal: "Refactor CovenantEnforcer loop",
    detail: "Post-evaluation regression detected",
  },
  {
    id: 5,
    timestamp: "2026-02-09 14:14:30",
    status: "merged",
    proposal: "Add type hints to SubAgent",
    detail: "Code quality score +5",
  },
  {
    id: 6,
    timestamp: "2026-02-09 14:10:02",
    status: "invalid",
    proposal: "Modify core covenant clauses",
    detail: "Validation failed: immutable config",
  },
];

const statusConfig = {
  merged: {
    icon: <GitMerge className="h-3.5 w-3.5" />,
    label: "Merged",
    classes: "text-primary bg-primary/10",
  },
  vetoed: {
    icon: <Ban className="h-3.5 w-3.5" />,
    label: "Vetoed",
    classes: "text-destructive bg-destructive/10",
  },
  rolled_back: {
    icon: <Undo2 className="h-3.5 w-3.5" />,
    label: "Rolled Back",
    classes: "text-amber-500 bg-amber-500/10",
  },
  invalid: {
    icon: <Ban className="h-3.5 w-3.5" />,
    label: "Invalid",
    classes: "text-muted-foreground bg-muted",
  },
};

export function RSICycleLog() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <RotateCcw className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-card-foreground">
          RSI Cycle Log
        </h2>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {entries.length} cycles
        </span>
      </div>
      <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
        {entries.map((entry) => {
          const cfg = statusConfig[entry.status];
          return (
            <div key={entry.id} className="flex items-start gap-3 px-5 py-3.5">
              <div
                className={`mt-0.5 flex items-center justify-center rounded p-1 ${cfg.classes}`}
              >
                {cfg.icon}
              </div>
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-card-foreground font-medium truncate">
                    {entry.proposal}
                  </span>
                  <span
                    className={`shrink-0 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${cfg.classes}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{entry.timestamp}</span>
                  <span className="hidden sm:inline">-</span>
                  <span className="hidden sm:inline truncate">
                    {entry.detail}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
