"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Terminal, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "system";
  content: string;
  timestamp: Date;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_OVERFORGE_API_URL ?? "http://localhost:8000";

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content:
        "0verforge online. Awaiting instructions. You can issue natural language commands to inspect, configure, or control the RSI system.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/commands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userMsg.id, command: trimmed }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const sysMsg: Message = {
        id: crypto.randomUUID(),
        role: "system",
        content:
          data.response ??
          data.message ??
          (data.accepted
            ? `Command accepted (id: ${data.payload_id ?? userMsg.id}). Processing...`
            : "Command was not accepted. Check system logs."),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, sysMsg]);
    } catch {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: "system",
        content:
          "Connection to 0verforge backend unavailable. Ensure the FastAPI server is running at " +
          BACKEND_URL,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "system",
        content: "Chat cleared. 0verforge awaiting instructions.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card h-full">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Terminal className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-card-foreground">
          Command Interface
        </h2>
        <span className="ml-auto flex items-center gap-2">
          <button
            onClick={clearChat}
            className="text-muted-foreground hover:text-card-foreground transition-colors"
            aria-label="Clear chat"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-[300px] max-h-[500px]"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex flex-col gap-1",
              msg.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground font-mono text-xs"
              )}
            >
              {msg.content}
            </div>
            <span className="text-[10px] text-muted-foreground font-mono px-1">
              {msg.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start">
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3.5 py-2.5">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span className="text-xs font-mono text-muted-foreground">
                Processing...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a command to 0verforge..."
            rows={1}
            className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Press Enter to send. Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}
