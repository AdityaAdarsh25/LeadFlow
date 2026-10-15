"use client";

import { Button } from "@/components/ui/button";
import { STATUS_LABELS, type LeadStatus } from "@/lib/types";

const STATUSES = Object.keys(STATUS_LABELS) as LeadStatus[];

export function StatusFilter({
  value,
  onChange,
}: {
  value: LeadStatus | undefined;
  onChange: (status: LeadStatus | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant={value === undefined ? "default" : "outline"}
        onClick={() => onChange(undefined)}
      >
        All
      </Button>
      {STATUSES.map((s) => (
        <Button
          key={s}
          size="sm"
          variant={value === s ? "default" : "outline"}
          onClick={() => onChange(s)}
        >
          {STATUS_LABELS[s]}
        </Button>
      ))}
    </div>
  );
}