"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createLead } from "@/lib/apis";

function AddLeadForm({
  onCreated,
  onCancel,
}: {
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError(null);
    try {
      await createLead({
        name: name.trim(),
        company: company.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the lead");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="lead-name" className="text-sm font-medium">
          Name <span className="text-red-600">*</span>
        </label>
        <Input
          id="lead-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          autoFocus
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="lead-company" className="text-sm font-medium">
          Company
        </label>
        <Input
          id="lead-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          maxLength={120}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="lead-phone" className="text-sm font-medium">
          Phone
        </label>
        <Input
          id="lead-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={20}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !name.trim()}>
          {saving ? "Adding…" : "Add lead"}
        </Button>
      </div>
    </form>
  );
}

export function AddLeadDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new lead</DialogTitle>
          <DialogDescription>
            Only the name is required. New leads start with the status New.
          </DialogDescription>
        </DialogHeader>
        <AddLeadForm
          onCancel={onClose}
          onCreated={() => {
            onCreated();
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}