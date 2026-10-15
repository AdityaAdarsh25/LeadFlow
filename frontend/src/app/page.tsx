"use client";

import { useState } from "react";
import { LeadList } from "@/components/LeadList";
import { SearchBar } from "@/components/SearchBar";
import { StatusFilter } from "@/components/StatusFilter";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLeads } from "@/hooks/useLeads";
import { LeadTimelineDialog } from "@/components/LeadTimelineDialog";
import type { Lead, LeadStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AddLeadDialog } from "@/components/AddLeadDialog";


export default function Page() {
  const [status, setStatus] = useState<LeadStatus | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const q = useDebouncedValue(search.trim());
  const { leads, loading, error, refresh } = useLeads(status, q || undefined);

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">LeadFlow</h1>
        <Button onClick={() => setAddOpen(true)}>Add lead</Button>
    </div>

      <SearchBar value={search} onChange={setSearch} />
      <StatusFilter value={status} onChange={setStatus} />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <LeadList leads={leads} onSelect={setSelected} />
      )}
      <LeadTimelineDialog
          lead={selected}
          onClose={() => setSelected(null)}
          onChanged={refresh}
        />
        <AddLeadDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onCreated={refresh}
        />
    </main>
  );
}