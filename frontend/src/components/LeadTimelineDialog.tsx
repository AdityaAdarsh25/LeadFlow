"use client";

import { useState } from "react";
import { DiscussionForm } from "./DiscussionForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimelineEntry } from "./TimelineEntry";
import { updateLeadStatus } from "@/lib/apis";
import { useDiscussions } from "@/hooks/useDiscussions";
import { STATUS_LABELS, type Lead, type LeadStatus } from "@/lib/types";

const STATUSES = Object.keys(STATUS_LABELS) as LeadStatus[];

function TimelineBody({ lead, onChanged }: { lead: Lead; onChanged: () => void }) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [statusError, setStatusError] = useState<string | null>(null);
  const { discussions, loading, error, refresh: refreshDiscussions } = useDiscussions(lead.id);

  async function changeStatus(next: LeadStatus) {
    const previous = status;
    setStatus(next); // optimistic: update the UI right away
    setStatusError(null);
    try {
      await updateLeadStatus(lead.id, next);
      onChanged(); // refetch the list behind the dialog
    } catch (e) {
      setStatus(previous); // roll back
      setStatusError(e instanceof Error ? e.message : "Could not update status");
    }
  }

  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between gap-4 pr-6">
          <div>
            <DialogTitle>
              {lead.name}
              {lead.company && (
                <span className="font-normal text-muted-foreground"> ({lead.company})</span>
              )}
            </DialogTitle>
            <DialogDescription>{lead.phone ?? "No phone on file"}</DialogDescription>
          </div>
          <Select value={status} onValueChange={(v) => changeStatus(v as LeadStatus)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {statusError && <p className="text-sm text-red-600">{statusError}</p>}
      </DialogHeader>

      <div className="max-h-[50vh] overflow-y-auto py-2">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : discussions.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No discussions yet. Log the first one below.
          </p>
        ) : (
          <ul className="space-y-4">
            {discussions.map((d) => (
              <TimelineEntry key={d.id} item={d} />
            ))}
          </ul>
        )}
      </div>

      <DiscussionForm
            leadId={lead.id}
            onSaved={() => {
                refreshDiscussions(); // update the timeline in the dialog
                onChanged();          // update the list behind it
            }}
        />
    </>
  );
}

export function LeadTimelineDialog({
  lead,
  onClose,
  onChanged,
}: {
  lead: Lead | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  return (
    <Dialog open={lead !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        {lead && <TimelineBody key={lead.id} lead={lead} onChanged={onChanged} />}
      </DialogContent>
    </Dialog>
  );
}