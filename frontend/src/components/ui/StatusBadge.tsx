import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type LeadStatus } from "@/lib/types";

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  qualified: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  proposal_sent: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  won: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  lost: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge variant="secondary" className={STATUS_STYLES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  )
};
