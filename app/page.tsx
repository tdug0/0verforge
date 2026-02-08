import {
  Activity,
  GitBranch,
  RotateCcw,
  Bot,
  Shield,
  Cpu,
} from "lucide-react";
import { StatusCard } from "@/components/status-card";
import { CovenantPanel } from "@/components/covenant-panel";
import { RSICycleLog } from "@/components/rsi-cycle-log";
import { AgentsPanel } from "@/components/agents-panel";
import { ArchitectureDiagram } from "@/components/architecture-diagram";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground tracking-tight font-mono">
                0verforge
              </h1>
              <p className="text-xs text-muted-foreground">
                Recursive Self-Improving Agent System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-card-foreground font-mono">
                RSI Active
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            title="System Status"
            value="Online"
            description="All subsystems operational"
            status="online"
            icon={<Activity className="h-4 w-4" />}
          />
          <StatusCard
            title="RSI Cycles"
            value="1,247"
            description="6 in last hour"
            status="online"
            icon={<RotateCcw className="h-4 w-4" />}
          />
          <StatusCard
            title="Active Agents"
            value="3 / 4"
            description="1 idle (archiver-01)"
            status="warning"
            icon={<Bot className="h-4 w-4" />}
          />
          <StatusCard
            title="Git Commits"
            value="89"
            description="12 merged from RSI"
            status="online"
            icon={<GitBranch className="h-4 w-4" />}
          />
        </div>

        {/* Main Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column - Cycle Log */}
          <div className="lg:col-span-2">
            <RSICycleLog />
          </div>

          {/* Right column - Covenant */}
          <div>
            <CovenantPanel />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AgentsPanel />
          <ArchitectureDiagram />
        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-border pt-4 pb-6">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-xs text-muted-foreground font-mono">
              0verforge v0.1.0 &middot; Core Covenant Active
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-primary" />
              <span>All modifications logged and reversible</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
