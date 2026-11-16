import { evidenceCompleteness } from "@/lib/domain/presentation";
import { monthKey, percent } from "@/lib/utils";
import type { AppState, PassportStatus } from "@/types";

export const CHART_MONTHS = [
  { key: "2026-04", label: "Apr" },
  { key: "2026-05", label: "May" },
  { key: "2026-06", label: "Jun" },
  { key: "2026-07", label: "Jul" },
  { key: "2026-08", label: "Aug" },
  { key: "2026-09", label: "Sep" },
] as const;

export function passportTrend(passports: AppState["passports"]) {
  return CHART_MONTHS.map((month) => ({
    label: month.label,
    count: passports.filter((passport) => monthKey(passport.createdAt) === month.key).length,
  }));
}

export function scanTrend(scans: AppState["scans"]) {
  return CHART_MONTHS.map((month) => ({
    label: month.label,
    count: scans.filter((scan) => monthKey(scan.createdAt) === month.key).length,
  }));
}

export function statusDistribution(passports: AppState["passports"]) {
  const order: { status: PassportStatus; name: string; fill: string }[] = [
    { status: "verified", name: "Verified", fill: "#0F766E" },
    { status: "draft", name: "Draft", fill: "#64748B" },
    { status: "correction_pending", name: "Review required", fill: "#B45309" },
    { status: "suspended", name: "Suspended", fill: "#B91C1C" },
  ];
  return order.map((item) => ({
    name: item.name,
    fill: item.fill,
    value: passports.filter((passport) => passport.status === item.status).length,
  }));
}

export function partnerGrowth(organisations: AppState["organisations"]) {
  let running = 0;
  return CHART_MONTHS.map((month) => {
    running += organisations.filter(
      (org) => monthKey(org.createdAt) === month.key && org.status !== "rejected",
    ).length;
    return { label: month.label, count: running };
  });
}

export function correctionRate(state: Pick<AppState, "corrections" | "passports">): number {
  const published = state.passports.filter((passport) => passport.status !== "draft").length;
  if (published === 0) return 0;
  return Math.round((state.corrections.length / published) * 1000) / 10;
}

export function averageEvidence(passports: AppState["passports"]): number {
  if (passports.length === 0) return 0;
  const total = passports.reduce(
    (sum, passport) => sum + evidenceCompleteness(passport.evidenceCount),
    0,
  );
  return Math.round(total / passports.length);
}

export function countStatus(passports: AppState["passports"], status: PassportStatus): number {
  return passports.filter((passport) => passport.status === status).length;
}

export function scansThisMonth(scans: AppState["scans"], month = "2026-09"): number {
  return scans.filter((scan) => monthKey(scan.createdAt) === month).length;
}

export function createdThisMonth(passports: AppState["passports"], month = "2026-09"): number {
  return passports.filter((passport) => monthKey(passport.createdAt) === month).length;
}

export function openCorrections(corrections: AppState["corrections"]): number {
  return corrections.filter((item) => item.status === "open").length;
}

export function missingEvidence(passports: AppState["passports"]) {
  return passports.filter((passport) => evidenceCompleteness(passport.evidenceCount) < 100);
}

export function coverageLabel(count: number): string {
  return `${evidenceCompleteness(count)}%`;
}

export function share(part: number, total: number): string {
  return `${percent(part, total)}%`;
}
