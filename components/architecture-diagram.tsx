"use client";

import {
  GitBranch,
  Database,
  Shield,
  RotateCcw,
  Network,
  ArrowRight,
} from "lucide-react";

const modules = [
  {
    name: "CoreOrchestrator",
    icon: <Network className="h-4 w-4" />,
    desc: "Central coordination hub",
  },
  {
    name: "RSIEngine",
    icon: <RotateCcw className="h-4 w-4" />,
    desc: "Reflect > Analyze > Propose > Validate > Apply",
  },
  {
    name: "CovenantEnforcer",
    icon: <Shield className="h-4 w-4" />,
    desc: "Safety & policy guardrails",
  },
  {
    name: "GitRepoManager",
    icon: <GitBranch className="h-4 w-4" />,
    desc: "Version control & rollback",
  },
  {
    name: "VariantArchive",
    icon: <Database className="h-4 w-4" />,
    desc: "Historical variant scoring",
  },
];

export function ArchitectureDiagram() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Network className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-card-foreground">
          System Architecture
        </h2>
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-2">
          {modules.map((mod, i) => (
            <div key={mod.name}>
              <div className="flex items-center gap-3 rounded-md border border-border bg-secondary/50 px-4 py-3">
                <div className="text-primary">{mod.icon}</div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-mono text-xs text-card-foreground font-medium">
                    {mod.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {mod.desc}
                  </span>
                </div>
              </div>
              {i < modules.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight className="h-3 w-3 text-muted-foreground rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
