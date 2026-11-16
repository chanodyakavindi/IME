"use client";

import { StatusChart, TrendChart } from "@/components/dashboard/charts";
import { Panel, Stat } from "@/components/dashboard/stat";
import { buttonClass } from "@/components/ui/button";
import { useSession } from "@/lib/auth/session";
import { useStore } from "@/lib/data/store";
import {
  averageEvidence,
  countStatus,
  createdThisMonth,
  openCorrections,
  passportTrend,
  statusDistribution,
} from "@/lib/domain/metrics";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

export function RepairHome() {
  const { session } = useSession();
  const { state } = useStore();
  if (!session?.organisationId) return null;
  const rows = state.passports.filter((item) => item.organisationId === session.organisationId);
  const corrections = state.corrections.filter((item) => item.organisationId === session.organisationId);
  const activity = state.audits
    .filter((item) => item.organisationId === session.organisationId)
    .slice(-5)
    .reverse();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Repair centre</h1>
          <p className="text-sm text-muted">Overview for {session.organisationName}.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/repair/passports/new" className={buttonClass("primary", "sm")}>Create New Passport</Link>
          <Link href="/repair/labels" className={buttonClass("secondary", "sm")}>Print QR Labels</Link>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active passports" value={String(rows.filter((item) => item.status === "verified" || item.status === "correction_pending").length)} hint="Current records" />
        <Stat label="Created in September 2026" value={String(createdThisMonth(rows))} hint="Current period" />
        <Stat label="Evidence completeness" value={`${averageEvidence(rows)}%`} hint="Current quality" />
        <Stat label="Open corrections" value={String(openCorrections(corrections))} hint="Current queue" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Monthly passports"><p className="mb-2 text-xs text-muted">Current record volume</p><TrendChart data={passportTrend(rows)} label="Passports" /></Panel>
        <Panel title="Status distribution"><p className="mb-2 text-xs text-muted">Verified {countStatus(rows, "verified")} · Draft {countStatus(rows, "draft")}</p><StatusChart data={statusDistribution(rows)} /></Panel>
      </div>
      <Panel title="Recent activity">
        {activity.length === 0 ? <p className="text-sm text-muted">No activity yet.</p> : (
          <ul className="space-y-3 text-sm">
            {activity.map((item) => (
              <li key={item.id} className="flex flex-col gap-1 border-b border-line pb-3 last:border-0 sm:flex-row sm:justify-between">
                <span className="font-medium text-navy">{item.action}</span>
                <span className="text-muted">{item.passportId} · {formatDateTime(item.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
