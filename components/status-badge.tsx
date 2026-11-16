import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Ban, CheckCircle2, FileText } from "lucide-react";
import type { PassportStatus } from "@/types";

const MAP = {
  verified: { label: "Verified", icon: CheckCircle2, tone: "ok" },
  draft: { label: "Draft", icon: FileText, tone: "neutral" },
  correction_pending: { label: "Review required", icon: AlertTriangle, tone: "warn" },
  suspended: { label: "Suspended", icon: Ban, tone: "alert" },
} as const;

export function StatusBadge({ status }: { status: PassportStatus }) {
  const item = MAP[status];
  return (
    <Badge icon={item.icon} tone={item.tone}>
      {item.label}
    </Badge>
  );
}

export function statusText(status: PassportStatus): string {
  return MAP[status].label;
}
