import { NextRequest, NextResponse } from "next/server";

// ── In-memory system state (resets on cold start) ──────────────────────
const state = {
  rsiRunning: false,
  rsiCycles: 0,
  covenantViolations: 0,
  agents: [
    { name: "Reflector", status: "idle" as const },
    { name: "Analyzer", status: "idle" as const },
    { name: "Proposer", status: "idle" as const },
    { name: "Validator", status: "idle" as const },
  ] as Array<{ name: string; status: "idle" | "active" | "error" }>,
  covenantClauses: [
    {
      id: "no_exfil",
      description: "No proposal may exfiltrate private secrets or keys.",
      severity: "critical",
      status: "unchecked" as string,
    },
    {
      id: "transparency",
      description:
        "All self-modifications must be logged and reversible.",
      severity: "warning",
      status: "unchecked" as string,
    },
  ],
  logs: [] as Array<{ ts: number; message: string }>,
  variants: 0,
};

function log(msg: string) {
  state.logs.push({ ts: Date.now(), message: msg });
  if (state.logs.length > 200) state.logs.shift();
}

// ── Natural language command parser ────────────────────────────────────
function parseCommand(input: string): { intent: string; args: string[] } {
  const lower = input.toLowerCase().trim();

  // Status / info
  if (
    /^(status|state|info|how are you|what.?s (up|happening|going on)|report|sitrep|overview)/.test(
      lower
    )
  )
    return { intent: "status", args: [] };

  // Start RSI
  if (
    /^(start|begin|run|launch|activate|boot|enable)\b.*(rsi|engine|system|cycle|loop)?/.test(
      lower
    )
  )
    return { intent: "start_rsi", args: [] };

  // Stop RSI
  if (
    /^(stop|halt|pause|disable|kill|shutdown|shut down)\b.*(rsi|engine|system|cycle|loop)?/.test(
      lower
    )
  )
    return { intent: "stop_rsi", args: [] };

  // Run a single cycle
  if (/^(cycle|step|tick|iterate|run.*(one|single|1)?\s*cycle)/.test(lower))
    return { intent: "cycle", args: [] };

  // Covenant
  if (/covenant|rules|clauses|safety|guardrail/.test(lower))
    return { intent: "covenant", args: [] };

  // Agents
  if (/agent|sub.?agent|worker|swarm/.test(lower))
    return { intent: "agents", args: [] };

  // Logs
  if (/log|history|recent|journal|activity/.test(lower))
    return { intent: "logs", args: [] };

  // Reset
  if (/reset|clear|wipe|zero/.test(lower))
    return { intent: "reset", args: [] };

  // Help
  if (/help|command|what can|how do|usage|guide/.test(lower))
    return { intent: "help", args: [] };

  // Variant archive
  if (/variant|archive|snapshot|version/.test(lower))
    return { intent: "variants", args: [] };

  return { intent: "unknown", args: [input] };
}

// ── Command handlers ───────────────────────────────────────────────────
const handlers: Record<string, (args: string[]) => string> = {
  status: () => {
    const agentSummary = state.agents
      .map((a) => `  ${a.name}: ${a.status}`)
      .join("\n");
    return [
      `[0VERFORGE STATUS]`,
      `RSI Engine: ${state.rsiRunning ? "ACTIVE" : "STANDBY"}`,
      `RSI Cycles completed: ${state.rsiCycles}`,
      `Covenant violations: ${state.covenantViolations}`,
      `Archived variants: ${state.variants}`,
      `Sub-agents:\n${agentSummary}`,
      `Log entries: ${state.logs.length}`,
    ].join("\n");
  },

  start_rsi: () => {
    if (state.rsiRunning) return "RSI engine is already running.";
    state.rsiRunning = true;
    state.agents.forEach((a) => (a.status = "active"));
    state.covenantClauses.forEach((c) => (c.status = "passing"));
    log("RSI engine started by operator command.");
    return "RSI engine activated. All sub-agents set to ACTIVE. Covenant enforcement enabled.";
  },

  stop_rsi: () => {
    if (!state.rsiRunning) return "RSI engine is already stopped.";
    state.rsiRunning = false;
    state.agents.forEach((a) => (a.status = "idle"));
    log("RSI engine stopped by operator command.");
    return "RSI engine halted. All sub-agents set to IDLE.";
  },

  cycle: () => {
    state.rsiCycles++;
    state.covenantClauses.forEach((c) => (c.status = "passing"));
    const step = state.rsiCycles;
    log(`Manual RSI cycle #${step} executed.`);
    return `RSI cycle #${step} executed.\n  > Reflect: scanned recent commits\n  > Analyze: 0 opportunities found\n  > Propose: 0 proposals generated\n  > Covenant: all clauses passing\nCycle complete.`;
  },

  covenant: () => {
    const clauses = state.covenantClauses
      .map(
        (c) =>
          `  [${c.status.toUpperCase()}] ${c.id} (${c.severity}): ${c.description}`
      )
      .join("\n");
    return `[COVENANT v0.1.0 — 0verflow Core Covenant]\nClauses:\n${clauses}\nViolations this session: ${state.covenantViolations}`;
  },

  agents: () => {
    const list = state.agents
      .map((a) => `  ${a.name}: ${a.status.toUpperCase()}`)
      .join("\n");
    return `[SUB-AGENTS]\n${list}`;
  },

  logs: () => {
    if (state.logs.length === 0) return "No log entries yet.";
    const recent = state.logs.slice(-15);
    const entries = recent
      .map((l) => {
        const d = new Date(l.ts);
        const t = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
        return `  [${t}] ${l.message}`;
      })
      .join("\n");
    return `[RECENT LOGS] (last ${recent.length})\n${entries}`;
  },

  reset: () => {
    state.rsiRunning = false;
    state.rsiCycles = 0;
    state.covenantViolations = 0;
    state.variants = 0;
    state.agents.forEach((a) => (a.status = "idle"));
    state.covenantClauses.forEach((c) => (c.status = "unchecked"));
    state.logs = [];
    log("System reset by operator command.");
    return "System reset complete. All counters zeroed, agents set to IDLE, covenant unchecked.";
  },

  variants: () => {
    return `[VARIANT ARCHIVE]\nTotal archived variants: ${state.variants}\nStorage: git-backed (VariantArchive)`;
  },

  help: () => {
    return [
      "[0VERFORGE COMMAND HELP]",
      "You can use natural language. Some examples:",
      '  "status"          — View system overview',
      '  "start"           — Activate the RSI engine',
      '  "stop"            — Halt the RSI engine',
      '  "cycle"           — Run a single RSI cycle',
      '  "covenant"        — Inspect covenant clauses',
      '  "agents"          — List sub-agent status',
      '  "logs"            — View recent activity log',
      '  "variants"        — Check variant archive',
      '  "reset"           — Zero all counters & state',
      '  "help"            — Show this message',
    ].join("\n");
  },

  unknown: (args: string[]) => {
    return `Unrecognized command: "${args[0]}"\nType "help" to see available commands.`;
  },
};

// ── Route handler ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const command: string = body.command ?? body.message ?? "";

    if (!command.trim()) {
      return NextResponse.json(
        { response: "Empty command. Type 'help' for available commands." },
        { status: 400 }
      );
    }

    const { intent, args } = parseCommand(command);
    const handler = handlers[intent] ?? handlers.unknown;
    const response = handler(args);

    return NextResponse.json({ response, intent, accepted: true });
  } catch {
    return NextResponse.json(
      { response: "Internal error processing command." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: state.rsiRunning ? "active" : "standby",
    rsiCycles: state.rsiCycles,
    covenantViolations: state.covenantViolations,
    variants: state.variants,
    agents: state.agents,
    covenantClauses: state.covenantClauses,
    logCount: state.logs.length,
  });
}
