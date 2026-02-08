"use client";

import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string;
  description?: string;
  status?: "online" | "offline" | "warning" | "idle";
  icon: React.ReactNode;
}

const statusColors = {
  online: "bg-primary",
  offline: "bg-destructive",
  warning: "bg-amber-500",
  idle: "bg-muted-foreground",
};

export function StatusCard({
  title,
  value,
  description,
  status,
  icon,
}: StatusCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {status && (
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                statusColors[status]
              )}
            />
          )}
          <span className="text-muted-foreground">{icon}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-semibold text-card-foreground font-mono tracking-tight">
          {value}
        </span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
    </div>
  );
}
