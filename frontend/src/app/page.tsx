"use client";

import { useState } from "react";
import { LeadList } from "@/components/ui/LeadList";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusFilter } from "@/components/ui/StatusFilter";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLeads } from "@/hooks/useLeads";
import type { LeadStatus } from "@/lib/types";

export default function Page() {
  const [status, setStatus] = useState<LeadStatus | undefined>(undefined);
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search.trim());

  const { leads, loading, error } = useLeads(status, q || undefined);

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">LeadFlow</h1>

      <SearchBar value={search} onChange={setSearch} />
      <StatusFilter value={status} onChange={setStatus} />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <LeadList leads={leads} onSelect={(lead) => console.log(lead)} />
      )}
    </main>
  );
}