import type { Lead } from "./types";
import { isDueToday } from "./time";

export function splitLeads(leads: Lead[]) {
  const pinned = leads
    .filter((l) => isDueToday(l.follow_up_at))
    .sort(
      (a, b) =>
        new Date(a.follow_up_at!).getTime() - new Date(b.follow_up_at!).getTime(),
    );
  const rest = leads.filter((l) => !isDueToday(l.follow_up_at));
  return { pinned, rest };
}