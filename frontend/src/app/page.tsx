"use client";

import { useState } from "react";
import { LeadList } from "@/components/ui/LeadList";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusFilter } from "@/components/ui/StatusFilter";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLeads } from "@/hooks/useLeads";
import { LeadTimelineDialog } from "@/components/ui/LeadTimelineDialog";
import type { Lead, LeadStatus } from "@/lib/types";


export default function Page() {
  const [status, setStatus] = useState<LeadStatus | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const q = useDebouncedValue(search.trim());
  const { leads, loading, error, refresh } = useLeads(status, q || undefined);

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">LeadFlow</h1>

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
    </main>
  );
}