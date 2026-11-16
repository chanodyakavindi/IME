import { lookupPassport } from "@/lib/domain/passports";
import { publicIdentifier, publicSerial } from "@/lib/domain/presentation";
import type { AppState, AuditEvent, DevicePassport, EvidenceItem, Inspection, RepairEvent } from "@/types";

export interface PublicPassportView {
  ok: true;
  passport: DevicePassport;
  inspection: Inspection | null;
  repairs: RepairEvent[];
  evidence: EvidenceItem[];
  audits: AuditEvent[];
  identifier: string;
  serial: string;
}

export function buildPublicView(state: AppState, id: string): PublicPassportView | { ok: false; reason: "not_found" | "not_published" } {
  const lookup = lookupPassport(state, id);
  if (!lookup.ok || !lookup.passport) {
    return { ok: false, reason: lookup.reason === "not_published" ? "not_published" : "not_found" };
  }
  const passport = lookup.passport;
  const sort = <T extends { createdAt: string; id: string }>(items: T[]) =>
    [...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  return {
    ok: true,
    passport,
    inspection: state.inspections.find((item) => item.passportId === passport.id) ?? null,
    repairs: sort(state.repairs.filter((item) => item.passportId === passport.id && item.visibility === "public")),
    evidence: sort(state.evidence.filter((item) => item.passportId === passport.id && item.visibility === "public")),
    audits: sort(state.audits.filter((item) => item.passportId === passport.id)),
    identifier: publicIdentifier(passport.identifierLast4),
    serial: publicSerial(passport.serialLast4),
  };
}
