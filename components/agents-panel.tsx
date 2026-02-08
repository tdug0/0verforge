"use client";

import { Bot, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Agent {
  name: string;
  role: string;
  status: "running" | "idle" | "stopped";
  interval: string;
  lastActive: string;
}

const statusDot = {
  running: "text-primary",
  idle: "text-amber-500",
  stopped: "text-destructive",
};

interface AgentsPanelProps {
  agents?: Agent[];
}

export function AgentsPanel({ agents = [] }: AgentsPanelProps) {
  const activeCount = agents.filter((a) => a.status === "running").length;

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Bot className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-card-foreground">
          Sub-Agents
        </h2>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {activeCount}/{agents.length} active
        </span>
      </div>
      <div className="divide-y divide-border">
        {agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-5">
            <Bot className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No agents registered</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Agents will appear when the orchestrator starts
            </p>
          </div>
        ) : (
          agents.map((agent) => (
            <div
              key={agent.name}
              className="flex items-center gap-3 px-5 py-3.5"
            >
              <Circle
                className={cn(
                  "h-2.5 w-2.5 fill-current",
                  statusDot[agent.status]
                )}
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
          ))
        )}
      </div>
    </div>
  );
}
