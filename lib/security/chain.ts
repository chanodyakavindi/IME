import type { AuditEvent } from "@/types";
import { canonicalJson, sha256Hex } from "@/lib/security/hash";

export const GENESIS_HASH = "0".repeat(64);

export interface AuditDraft {
  id: string;
  passportId: string;
  organisationId: string;
  createdAt: string;
  createdBy: string;
  userName: string;
  action: string;
  summary: string;
  previousHash: string;
  visibility?: AuditEvent["visibility"];
  evidenceCount?: number;
}

export function auditBody(event: Pick<
  AuditEvent,
  | "id"
  | "passportId"
  | "action"
  | "createdAt"
  | "createdBy"
  | "previousHash"
  | "summary"
>) {
  return {
    action: event.action,
    createdAt: event.createdAt,
    createdBy: event.createdBy,
    id: event.id,
    passportId: event.passportId,
    previousHash: event.previousHash,
    summary: event.summary,
  };
}

export function sealAudit(draft: AuditDraft): AuditEvent {
  const body = auditBody({
    id: draft.id,
    passportId: draft.passportId,
    action: draft.action,
    createdAt: draft.createdAt,
    createdBy: draft.createdBy,
    previousHash: draft.previousHash,
    summary: draft.summary,
  });
  return {
    id: draft.id,
    passportId: draft.passportId,
    organisationId: draft.organisationId,
    createdAt: draft.createdAt,
    updatedAt: draft.createdAt,
    status: "recorded",
    visibility: draft.visibility ?? "internal",
    evidenceCount: draft.evidenceCount ?? 0,
    recordHash: sha256Hex(canonicalJson(body)),
    previousHash: draft.previousHash,
    createdBy: draft.createdBy,
    userName: draft.userName,
    action: draft.action,
    summary: draft.summary,
  };
}

export function latestRecordHash(
  events: Pick<AuditEvent, "id" | "passportId" | "createdAt" | "recordHash">[],
  passportId: string,
): string {
  const related = events
    .filter((event) => event.passportId === passportId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  return related.at(-1)?.recordHash ?? GENESIS_HASH;
}

export function verifyAuditChain(events: AuditEvent[]): boolean {
  const ordered = [...events].sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
  );
  let previous = GENESIS_HASH;
  for (const event of ordered) {
    if (event.previousHash !== previous) return false;
    if (sha256Hex(canonicalJson(auditBody(event))) !== event.recordHash) return false;
    previous = event.recordHash;
  }
  return true;
}
