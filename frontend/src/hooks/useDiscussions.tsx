"use client";

import { useCallback, useEffect, useState } from "react";
import { getDiscussions } from "@/lib/apis";
import type { Discussion } from "@/lib/types";

export function useDiscussions(leadId: string) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getDiscussions(leadId)
      .then((data) => {
        if (!cancelled) {
          setDiscussions(data);
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
  }, [leadId, version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  return { discussions, loading, error, refresh };
}