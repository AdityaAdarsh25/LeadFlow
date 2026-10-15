import { formatDateTime, timeAgo } from "@/lib/time";
import type { Discussion } from "@/lib/types";

export function TimelineEntry({ item }: { item: Discussion }) {
  return (
    <li className="relative pl-6">
      <span className="absolute left-0 top-1.5 size-2.5 rounded-full bg-primary" />
      <span className="absolute bottom-[-1rem] left-[4px] top-4 w-px bg-border" />

      <p className="text-xs text-muted-foreground">
        {formatDateTime(item.created_at)} ({timeAgo(item.created_at)})
      </p>
      <div className="mt-1 rounded-md border bg-card p-3 text-sm">
        <p className="whitespace-pre-wrap">{item.note}</p>
        {item.follow_up_at && (
          <p className="mt-2 inline-block rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Follow-up set for: {formatDateTime(item.follow_up_at)}
          </p>
        )}
      </div>
    </li>
  );
}