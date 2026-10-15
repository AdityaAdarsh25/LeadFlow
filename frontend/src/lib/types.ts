export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "won"
  | "lost"

export interface Lead{
    id:string;
    name: string;
    company: string | null;
    phone: string | null;
    status: LeadStatus;
    follow_up_at: string | null;
    created_at: string;
    last_note: string | null;
    last_note_at: string | null;
}

export interface Discussion {
  id: string;
  lead_id: string;
  note: string;
  follow_up_at: string | null;
  created_at: string;
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "NEW",
  contacted: "CONTACTED",
  qualified: "QUALIFIED",
  proposal_sent: "PROPOSAL SENT",
  won: "WON",
  lost: "LOST"
};
