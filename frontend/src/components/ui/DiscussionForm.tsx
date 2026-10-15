"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addDiscussion } from "@/lib/apis";

export function DiscussionForm({
  leadId,
  onSaved,
}: {
  leadId: string;
  onSaved: () => void;
}) {
  const [note, setNote] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;

    setSaving(true);
    setError(null);
    try {
      await addDiscussion(leadId, {
        note: note.trim(),
        follow_up_at: followUp ? new Date(followUp).toISOString() : null,
      });
      setNote("");
      setFollowUp("");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t pt-4">
      <Textarea
        placeholder="Log a new discussion…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Follow-up
          <Input
            type="datetime-local"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            className="w-auto"
          />
        </label>
        <Button type="submit" disabled={saving || !note.trim()}>
          {saving ? "Saving…" : "Save note"}
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}