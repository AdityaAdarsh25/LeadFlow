"use client";

import { useCallback, useEffect, useState } from "react";
import { getLeads } from "@/lib/apis";
import type { Lead, LeadStatus } from "@/lib/types";

export function useLeads(status?: LeadStatus, q?: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getLeads({ status, q })
      .then((data) => {
        if (!cancelled) {
          setLeads(data);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, q, version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  return { leads, loading, error, refresh };
}