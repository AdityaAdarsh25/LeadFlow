import type { Discussion, Lead, LeadStatus } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";


export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") {
        message = body.detail;
      } else if (Array.isArray(body.detail)) {
        message = body.detail.map((d: { msg: string }) => d.msg).join(", ");
      }
    } catch {
      // body wasn't JSON, keep the generic message
    }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}
export function getLeads(params: { status?: LeadStatus; q?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.q) qs.set("q", params.q);
  const query = qs.toString();
  return request<Lead[]>(`/leads${query ? `?${query}` : ""}`);
}

export function createLead(data: {
  name: string;
  company?: string;
  phone?: string;
  status?: LeadStatus;
}) {
  return request<Lead>("/leads", { method: "POST", body: JSON.stringify(data) });
}

export function updateLeadStatus(id: string, status: LeadStatus) {
  return request<Lead>(`/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function getDiscussions(leadId: string) {
  return request<Discussion[]>(`/leads/${leadId}/discussions`);
}

export function addDiscussion(
  leadId: string,
  data: { note: string; follow_up_at?: string | null },
) {
  return request<Discussion>(`/leads/${leadId}/discussions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}