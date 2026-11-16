"use client";

import { LineTrend, StatusChart, TrendChart } from "@/components/dashboard/charts";
import { Panel, Stat } from "@/components/dashboard/stat";
import { useStore } from "@/lib/data/store";
import {
  averageEvidence,
  correctionRate,
  countStatus,
  missingEvidence,
  openCorrections,
  partnerGrowth,
  passportTrend,
  scanTrend,
  statusDistribution,
} from "@/lib/domain/metrics";
import Link from "next/link";

export function AdminHome() {
  const { state } = useStore();
  const activeOrgs = state.organisations.filter((item) => item.status === "approved").length;
  const suspended = countStatus(state.passports, "suspended");
  const gaps = missingEvidence(state.passports);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Platform overview</h1>
        <p className="text-sm text-muted">Operational performance across the partner network.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label="Active partner organisations" value={String(activeOrgs)} hint="Current network" />
        <Stat label="Active passports" value={String(state.passports.filter((item) => item.status !== "draft").length)} hint="Current records" />
        <Stat label="Public scans" value={String(state.scans.length)} hint="Current scans" />
        <Stat label="Correction requests" value={String(openCorrections(state.corrections))} hint="Current queue" />
        <Stat label="Average evidence coverage" value={`${averageEvidence(state.passports)}%`} hint="Current quality" />
        <Stat label="Suspended records" value={String(suspended)} hint="Current issues" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Passport creation"><p className="mb-2 text-xs text-muted">Current record volume</p><TrendChart data={passportTrend(state.passports)} label="Passports" /></Panel>
        <Panel title="Public scans"><p className="mb-2 text-xs text-muted">Current scan activity</p><LineTrend data={scanTrend(state.scans)} label="Scans" /></Panel>
        <Panel title="Records by status"><StatusChart data={statusDistribution(state.passports)} /></Panel>
        <Panel title="Partner growth"><p className="mb-2 text-xs text-muted">Correction rate {correctionRate(state)}%</p><TrendChart data={partnerGrowth(state.organisations)} label="Partners" /></Panel>
      </div>
      <Panel title="Records with missing evidence" action={<Link className="text-sm font-semibold" href="/admin/passports">Review passports</Link>}>
        {gaps.length === 0 ? <p className="text-sm text-muted">Every passport has a full evidence set.</p> : (
          <ul className="space-y-2 text-sm">
            {gaps.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 border-b border-line py-2">
                <span>{item.id} · {item.brand} {item.model}</span>
                <span className="text-muted">{item.evidenceCount} / 4 files</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
