"use client";

import { Input } from "@/components/ui/input";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      type="search"
      placeholder="Search leads by name…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}