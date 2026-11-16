import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Badge({
  icon: Icon,
  children,
  tone = "neutral",
}: {
  icon?: LucideIcon;
  children: ReactNode;
  tone?: "ok" | "warn" | "neutral" | "alert" | "navy";
}) {
  const tones = {
    ok: "bg-teal-50 text-teal-900 ring-teal-200",
    warn: "bg-amber-50 text-amber-950 ring-amber-200",
    neutral: "bg-slate-100 text-slate-700 ring-slate-200",
    alert: "bg-red-50 text-red-900 ring-red-200",
    navy: "bg-navy text-white ring-navy",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", tones[tone])}>
      {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden /> : null}
      {children}
    </span>
  );
}
