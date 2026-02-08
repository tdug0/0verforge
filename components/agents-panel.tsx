"use client";

import { Bot, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Agent {
  name: string;
  role: string;
  status: "running" | "idle" | "stopped";
  interval: string;
  lastActive: string;
}

const agents: Agent[] = [
  {
    name: "reflector-01",
    role: "Commit analysis & metrics collection",
    status: "running",
    interval: "5s",
    lastActive: "2s ago",
  },
  {
    name: "proposer-01",
    role: "Code improvement proposals",
    status: "running",
    interval: "10s",
    lastActive: "4s ago",
  },
  {
    name: "validator-01",
    role: "Proposal safety & correctness checks",
    status: "running",
    interval: "10s",
    lastActive: "6s ago",
  },
  {
    name: "archiver-01",
    role: "Variant history & scoring",
    status: "idle",
    interval: "30s",
    lastActive: "18s ago",
  },
];

const statusDot = {
  running: "text-primary",
  idle: "text-amber-500",
  stopped: "text-destructive",
};

export function AgentsPanel() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Bot className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-card-foreground">
          Sub-Agents
        </h2>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {agents.filter((a) => a.status === "running").length}/
          {agents.length} active
        </span>
      </div>
      <div className="divide-y divide-border">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="flex items-center gap-3 px-5 py-3.5"
          >
            <Circle
              className={cn("h-2.5 w-2.5 fill-current", statusDot[agent.status])}
            />
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-card-foreground">
                  {agent.name}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">
                  {agent.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {agent.role}
              </p>
            </div>
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <span className="text-[10px] font-mono text-muted-foreground">
                {agent.interval}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {agent.lastActive}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
