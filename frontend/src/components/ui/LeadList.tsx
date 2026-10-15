import { LeadRow } from "./LeadRow";
import { splitLeads } from "@/lib/sort";
import type { Lead } from "@/lib/types";

export function LeadList({
  leads,
  onSelect,
}: {
  leads: Lead[];
  onSelect: (lead: Lead) => void;
}) {
  if (leads.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No leads found.
      </p>
    );
  }

  const { pinned, rest } = splitLeads(leads);

  return (
    <div className="space-y-6">
      {pinned.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold">Today&apos;s follow-ups</h2>
          <div className="space-y-2">
            {pinned.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onSelect={onSelect} />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold">All leads</h2>
          <div className="space-y-2">
            {rest.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onSelect={onSelect} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}