import { formatDistanceToNowStrict, isToday, isPast } from "date-fns";

/** "2 days ago", "3 hours ago" */
export function timeAgo(iso: string | null): string {
  if (!iso) return "";
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
}

/** follow-up falls on today's date in the viewer's local timezone */
export function isDueToday(iso: string | null): boolean {
  return iso !== null && isToday(new Date(iso));
}

/** follow-up time has already passed */
export function isOverdue(iso: string | null): boolean {
  return iso !== null && isPast(new Date(iso));
}

/** "May 6, 2:00 PM" */
export function formatFollowUp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}