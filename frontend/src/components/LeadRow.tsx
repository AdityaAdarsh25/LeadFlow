"use client";

import { StatusBadge } from "./StatusBadge";
import { formatFollowUp, isDueToday, isOverdue, timeAgo } from "@/lib/time";
import type { Lead } from "@/lib/types";

export function LeadRow({
  lead,
  onSelect,
}: {
  lead: Lead;
  onSelect: (lead: Lead) => void;
}) {
  const overdue = isOverdue(lead.follow_up_at);
  const dueToday = isDueToday(lead.follow_up_at);
  
  const tone = overdue
  ? "border-l-4 border-red-200 border-l-red-500 bg-red-50 hover:bg-red-100 dark:border-red-900 dark:border-l-red-500 dark:bg-red-950/30 dark:hover:bg-red-950/50"
  : dueToday
    ? "border-l-4 border-amber-200 border-l-amber-500 bg-amber-50 hover:bg-amber-100 dark:border-amber-900 dark:border-l-amber-500 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
    : "bg-card hover:bg-accent";

  return (
    <button
    type="button"
    onClick={() => onSelect(lead)}
    className={`w-full rounded-lg border p-4 text-left transition-colors ${tone}`}
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
              : dueToday
                ? "font-medium text-amber-700 dark:text-amber-400"
                : "text-muted-foreground"
          }
        >
          {overdue ? "Overdue: " : dueToday ? "Due today: " : "Follow-up: "}
          {formatFollowUp(lead.follow_up_at)}
        </span>
      )}
      </div>
    </button>
  );
}