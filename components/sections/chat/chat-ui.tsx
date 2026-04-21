import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuickActionProps } from "./types";

export function QuickAction({ icon, label, onClick }: QuickActionProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={cn(
        "h-auto min-h-11 w-full justify-start rounded-2xl px-4 py-3 text-left",
        "border-white/10 bg-white/[0.04] text-zinc-300",
        "hover:bg-white/10 hover:text-white",
        "sm:w-auto sm:justify-center sm:rounded-full sm:px-4 sm:py-2",
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="ml-2 line-clamp-2 text-xs sm:text-sm">{label}</span>
    </Button>
  );
}

export function StatusBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-3 py-1 text-xs text-[#f4e7b2]">
      {label}
    </span>
  );
}

export function InlineMetaBadge({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-zinc-300">
      <span className="shrink-0">{icon}</span>
      <span className="max-w-[140px] truncate sm:max-w-[220px] md:max-w-[280px]">
        {label}
      </span>
    </span>
  );
}