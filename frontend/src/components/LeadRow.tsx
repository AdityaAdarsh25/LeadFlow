"use client";

import { StatusBadge } from "./StatusBadge";
import { formatFollowUp, isOverdue, timeAgo } from "@/lib/time";
import type { Lead } from "@/lib/types";

export function LeadRow({
  lead,
  onSelect,
}: {
  lead: Lead;
  onSelect: (lead: Lead) => void;
}) {
  const overdue = isOverdue(lead.follow_up_at);

  return (
    <button
      type="button"
      onClick={() => onSelect(lead)}
      className={`w-full rounded-lg border p-4 text-left transition-colors ${
    overdue
      ? "border-l-4 border-red-200 border-l-red-500 bg-red-100 hover:bg-red-200 dark:border-red-900 dark:border-l-red-500 dark:bg-red-950/30 dark:hover:bg-red-950/50"
      : "bg-card hover:bg-accent"
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">
            {lead.name}
            {lead.company && (
              <span className="font-normal text-muted-foreground"> ({lead.company})</span>
            )}
          </p>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {lead.last_note ?? "No discussions yet"}
          </p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {lead.last_note_at ? timeAgo(lead.last_note_at) : ""}
        </span>
        {lead.follow_up_at && (
          <span
            className={
              overdue
                ? "font-medium text-red-600 dark:text-red-400"
                : "text-muted-foreground"
            }
          >
            {overdue ? "Overdue: " : "Follow-up: "}
            {formatFollowUp(lead.follow_up_at)}
          </span>
        )}
      </div>
    </button>
  );
}