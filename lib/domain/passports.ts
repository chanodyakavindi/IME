import { GENESIS_HASH, latestRecordHash, sealAudit } from "@/lib/security/chain";
import { addSeconds } from "@/lib/utils";
import { passportDraftSchema } from "@/lib/validation/schemas";
import type {
  Actor,
  AppState,
  AuditEvent,
  CorrectionRequest,
  DevicePassport,
  EvidenceDraft,
  EvidenceItem,
  Inspection,
  PassportDraftInput,
  RepairEvent,
} from "@/types";

export interface PublicLookup {
  ok: boolean;
  reason: "ok" | "not_found" | "not_published";
  passport: DevicePassport | null;
}

export function lookupPassport(state: AppState, id: string): PublicLookup {
  const passport = state.passports.find((item) => item.id === id) ?? null;
  if (!passport) return { ok: false, reason: "not_found", passport: null };
  if (passport.status === "draft" || passport.visibility !== "public") {
    return { ok: false, reason: "not_published", passport };
  }
  return { ok: true, reason: "ok", passport };
}

export function nextNumericId(prefix: string, ids: string[]): string {
  const max = ids.reduce((highest, id) => {
    const match = id.match(/(\d+)$/);
    return Math.max(highest, match ? Number(match[1]) : 0);
  }, 0);
  return `${prefix}-${String(max + 1).padStart(4, "0")}`;
}

export function nextPassportId(state: AppState): string {
  return `FP-2026-${String(state.passports.length + 1).padStart(4, "0")}`;
}

function requireOrg(state: AppState, organisationId: string | null) {
  const org = state.organisations.find((item) => item.id === organisationId);
  if (!org) throw new Error("Partner organisation was not found.");
  if (org.status === "suspended") throw new Error("This partner is suspended.");
  return org;
}

function appendChain(
  audits: AuditEvent[],
  draft: Omit<Parameters<typeof sealAudit>[0], "previousHash"> & { previousHash?: string },
): AuditEvent {
  const previousHash = draft.previousHash ?? latestRecordHash(audits, draft.passportId);
  const event = sealAudit({ ...draft, previousHash });
  audits.push(event);
  return event;
}

export function commitPassport(
  state: AppState,
  input: PassportDraftInput,
  actor: Actor,
  now: string,
  mode: "draft" | "publish",
): { state: AppState; passportId: string } {
  const parsed = passportDraftSchema.parse(input);
  const org = requireOrg(state, actor.organisationId);
  const next: AppState = structuredClone(state);
  const passportId = nextPassportId(next);
  const audits = next.audits;
  const created = appendChain(audits, {
    id: nextNumericId("AUD", audits.map((item) => item.id)),
    passportId,
    organisationId: org.id,
    createdAt: now,
    createdBy: actor.id,
    userName: actor.name,
    action: "passport.draft_created",
    summary: `Draft created for ${parsed.brand} ${parsed.model}.`,
    visibility: "internal",
    evidenceCount: input.evidence.length,
  });

  const evidence = buildEvidence(next, input.evidence, {
    passportId,
    organisationId: org.id,
    createdBy: actor.id,
    createdAt: addSeconds(now, 1),
    repairEventId: "pending",
  });

  let recordHash = created.recordHash;
  let previousHash = created.previousHash;
  let status: DevicePassport["status"] = "draft";
  let visibility: DevicePassport["visibility"] = "internal";
  const inspectionStatus = mode === "publish" ? "completed" : "draft";

  if (mode === "publish") {
    const published = appendChain(audits, {
      id: nextNumericId("AUD", audits.map((item) => item.id)),
      passportId,
      organisationId: org.id,
      createdAt: addSeconds(now, 2),
      createdBy: actor.id,
      userName: actor.name,
      action: "passport.published",
      summary: `Inspection published with ${evidence.length} evidence item${evidence.length === 1 ? "" : "s"}.`,
      visibility: "public",
      evidenceCount: evidence.length,
    });
    recordHash = published.recordHash;
    previousHash = published.previousHash;
    status = "verified";
    visibility = "public";
    const repair = makeRepair(next, {
      passportId,
      organisationId: org.id,
      createdAt: published.createdAt,
      createdBy: actor.id,
      eventType: "Inspection published",
      partnerName: org.name,
      technicianName: actor.name,
      summary: parsed.notes || "Inspection checklist completed and published.",
      evidenceCount: evidence.length,
      recordHash: published.recordHash,
      previousHash: published.previousHash,
      visibility: "public",
    });
    evidence.forEach((item) => {
      item.repairEventId = repair.id;
    });
    next.labels.push({
      id: nextNumericId("QR", next.labels.map((item) => item.id)),
      passportId,
      organisationId: org.id,
      createdAt: published.createdAt,
      updatedAt: published.createdAt,
      status: "active",
      visibility: "public",
      urlPath: `/passport/${passportId}`,
      createdBy: actor.id,
    });
  }

  const inspection: Inspection = {
    id: nextNumericId("INS", next.inspections.map((item) => item.id)),
    passportId,
    organisationId: org.id,
    createdAt: now,
    updatedAt: now,
    status: inspectionStatus,
    visibility,
    createdBy: actor.id,
    screenTest: parsed.screenTest,
    screenPart: parsed.screenPart,
    batteryHealth: parsed.batteryHealth,
    batteryStatus: parsed.batteryStatus,
    batteryReplacedLabel: parsed.batteryReplacedLabel,
    cameraTest: parsed.cameraTest,
    cameraPart: parsed.cameraPart,
    speakerMic: parsed.speakerMic,
    chargingPortTest: parsed.chargingPortTest,
    chargingPortPart: parsed.chargingPortPart,
    biometric: parsed.biometric,
    network: parsed.network,
    waterDamage: parsed.waterDamage,
    exterior: parsed.exterior,
    accessories: parsed.accessories,
    notes: parsed.notes,
  };

  const passport: DevicePassport = {
    id: passportId,
    createdAt: now,
    updatedAt: now,
    status,
    organisationId: org.id,
    visibility,
    evidenceCount: evidence.length,
    recordHash,
    previousHash,
    createdBy: actor.id,
    brand: parsed.brand,
    model: parsed.model,
    category: parsed.category,
    identifierLast4: parsed.identifierLast4,
    serialLast4: parsed.serialLast4,
    sourceNote: parsed.sourceNote,
    partnerName: org.name,
    technicianName: actor.name,
    inspectionDate: now.slice(0, 10),
    batteryHealth: parsed.batteryHealth,
    isDemo: false,
  };

  next.passports.push(passport);
  next.inspections.push(inspection);
  next.evidence.push(...evidence);
  return { state: next, passportId };
}

function buildEvidence(
  state: AppState,
  drafts: EvidenceDraft[],
  base: {
    passportId: string;
    organisationId: string;
    createdBy: string;
    createdAt: string;
    repairEventId: string;
  },
): EvidenceItem[] {
  const ids = state.evidence.map((item) => item.id);
  return drafts.map((draft) => {
    const id = nextNumericId("EV", ids);
    ids.push(id);
    return {
      id,
      passportId: base.passportId,
    repairEventId: base.repairEventId,
    organisationId: base.organisationId,
    createdAt: base.createdAt,
    updatedAt: base.createdAt,
    status: "available",
    visibility: "public",
    evidenceCount: 1,
    recordHash: GENESIS_HASH,
    previousHash: GENESIS_HASH,
    createdBy: base.createdBy,
      label: draft.label,
      kind: draft.kind,
      note: draft.note,
      fictional: false,
      previewDataUrl: draft.previewDataUrl,
    };
  });
}

function makeRepair(
  state: AppState,
  input: Omit<RepairEvent, "id" | "updatedAt" | "status">,
): RepairEvent {
  const repair: RepairEvent = {
    ...input,
    id: nextNumericId("REP", state.repairs.map((item) => item.id)),
    updatedAt: input.createdAt,
    status: "recorded",
  };
  state.repairs.push(repair);
  return repair;
}

export function addRepairEvent(
  state: AppState,
  input: {
    passportId: string;
    eventType: string;
    summary: string;
    actor: Actor;
    now: string;
  },
): AppState {
  const next = structuredClone(state);
  const passport = next.passports.find((item) => item.id === input.passportId);
  if (!passport) throw new Error("Passport not found.");
  if (passport.organisationId !== input.actor.organisationId) {
    throw new Error("This passport belongs to another partner.");
  }
  const org = requireOrg(next, input.actor.organisationId);
  const audit = appendChain(next.audits, {
    id: nextNumericId("AUD", next.audits.map((item) => item.id)),
    passportId: passport.id,
    organisationId: org.id,
    createdAt: input.now,
    createdBy: input.actor.id,
    userName: input.actor.name,
    action: "repair.recorded",
    summary: input.summary,
    visibility: passport.visibility,
    evidenceCount: passport.evidenceCount,
  });
  makeRepair(next, {
    passportId: passport.id,
    organisationId: org.id,
    createdAt: input.now,
    createdBy: input.actor.id,
    eventType: input.eventType,
    partnerName: org.name,
    technicianName: input.actor.name,
    summary: input.summary,
    evidenceCount: 0,
    recordHash: audit.recordHash,
    previousHash: audit.previousHash,
    visibility: passport.visibility,
  });
  passport.updatedAt = input.now;
  passport.recordHash = audit.recordHash;
  passport.previousHash = audit.previousHash;
  return next;
}

export function submitCorrection(
  state: AppState,
  input: {
    passportId: string;
    issueType: string;
    description: string;
    contact: string;
    source: "buyer" | "partner";
    actor: Actor;
    now: string;
  },
): AppState {
  const next = structuredClone(state);
  const passport = next.passports.find((item) => item.id === input.passportId);
  if (!passport) throw new Error("Passport not found.");
  const audit = appendChain(next.audits, {
    id: nextNumericId("AUD", next.audits.map((item) => item.id)),
    passportId: passport.id,
    organisationId: passport.organisationId,
    createdAt: input.now,
    createdBy: input.actor.id,
    userName: input.actor.name,
    action: "correction.submitted",
    summary: `${input.issueType}: ${input.description}`,
    visibility: "internal",
    evidenceCount: 0,
  });
  const request: CorrectionRequest = {
    id: nextNumericId("CR", next.corrections.map((item) => item.id)),
    passportId: passport.id,
    organisationId: passport.organisationId,
    createdAt: input.now,
    updatedAt: input.now,
    status: "open",
    visibility: "internal",
    evidenceCount: 0,
    recordHash: audit.recordHash,
    previousHash: audit.previousHash,
    createdBy: input.actor.id,
    requesterName: input.actor.name,
    issueType: input.issueType,
    description: input.description,
    contact: input.contact,
    source: input.source,
    internalNote: "",
  };
  next.corrections.push(request);
  if (passport.status === "verified") passport.status = "correction_pending";
  passport.updatedAt = input.now;
  passport.recordHash = audit.recordHash;
  passport.previousHash = audit.previousHash;
  return next;
}

export function reviewCorrection(
  state: AppState,
  input: {
    requestId: string;
    decision: "approved" | "rejected";
    note: string;
    actor: Actor;
    now: string;
  },
): AppState {
  const next = structuredClone(state);
  const request = next.corrections.find((item) => item.id === input.requestId);
  if (!request) throw new Error("Correction request not found.");
  if (request.status !== "open") throw new Error("This request is already closed.");
  const passport = next.passports.find((item) => item.id === request.passportId);
  if (!passport) throw new Error("Passport not found.");
  const originalRepairs = next.repairs
    .filter((item) => item.passportId === passport.id)
    .map((item) => ({ id: item.id, summary: item.summary, recordHash: item.recordHash }));
  const audit = appendChain(next.audits, {
    id: nextNumericId("AUD", next.audits.map((item) => item.id)),
    passportId: passport.id,
    organisationId: passport.organisationId,
    createdAt: input.now,
    createdBy: input.actor.id,
    userName: input.actor.name,
    action: input.decision === "approved" ? "correction.approved" : "correction.rejected",
    summary: input.note,
    visibility: "internal",
    evidenceCount: 0,
  });
  request.status = input.decision;
  request.internalNote = input.note;
  request.updatedAt = input.now;
  request.recordHash = audit.recordHash;
  request.previousHash = audit.previousHash;
  const stillOpen = next.corrections.some(
    (item) => item.passportId === passport.id && item.status === "open",
  );
  if (!stillOpen && passport.status === "correction_pending") passport.status = "verified";
  passport.updatedAt = input.now;
  passport.recordHash = audit.recordHash;
  passport.previousHash = audit.previousHash;
  const after = next.repairs.filter((item) => item.passportId === passport.id);
  originalRepairs.forEach((original) => {
    const current = after.find((item) => item.id === original.id);
    if (!current || current.summary !== original.summary || current.recordHash !== original.recordHash) {
      throw new Error("Original repair events cannot be overwritten.");
    }
  });
  return next;
}

export function suspendPartner(state: AppState, organisationId: string, actor: Actor, now: string): AppState {
  const next = structuredClone(state);
  const org = next.organisations.find((item) => item.id === organisationId);
  if (!org) throw new Error("Partner not found.");
  org.status = "suspended";
  org.updatedAt = now;
  next.passports
    .filter((passport) => passport.organisationId === organisationId && passport.status !== "draft")
    .forEach((passport, index) => {
      const audit = appendChain(next.audits, {
        id: nextNumericId("AUD", next.audits.map((item) => item.id)),
        passportId: passport.id,
        organisationId,
        createdAt: addSeconds(now, index),
        createdBy: actor.id,
        userName: actor.name,
        action: "partner.suspended",
        summary: `${org.name} was suspended. Existing events were retained.`,
        visibility: "public",
        evidenceCount: passport.evidenceCount,
      });
      passport.status = "suspended";
      passport.updatedAt = audit.createdAt;
      passport.recordHash = audit.recordHash;
      passport.previousHash = audit.previousHash;
    });
  return next;
}

export function reviewApplication(
  state: AppState,
  applicationId: string,
  decision: "approved" | "rejected",
  now: string,
): AppState {
  const next = structuredClone(state);
  const application = next.applications.find((item) => item.id === applicationId);
  if (!application) throw new Error("Application not found.");
  application.status = decision;
  application.updatedAt = now;
  if (decision === "approved") {
    const id = nextNumericId("ORG", next.organisations.map((item) => item.id));
    next.organisations.push({
      id,
      name: application.organisationName,
      type: application.partnerType,
      location: application.location,
      status: "approved",
      subscriptionStatus: "trial",
      planId: application.partnerType === "dealer" ? "dealer" : "repair-centre",
      createdAt: now,
      updatedAt: now,
    });
  }
  return next;
}

export function saveDemoRequest(
  state: AppState,
  input: Omit<AppState["requests"][number], "id" | "status" | "createdAt" | "updatedAt">,
  now: string,
): AppState {
  const next = structuredClone(state);
  next.requests.push({
    ...input,
    id: nextNumericId("REQ", next.requests.map((item) => item.id)),
    status: "received",
    createdAt: now,
    updatedAt: now,
  });
  return next;
}

export function recordScan(
  state: AppState,
  passportId: string,
  source: AppState["scans"][number]["source"],
  now: string,
): AppState {
  const passport = state.passports.find((item) => item.id === passportId);
  if (!passport || passport.visibility !== "public") return state;
  const next = structuredClone(state);
  next.scans.push({
    id: nextNumericId("SCN", next.scans.map((item) => item.id)),
    passportId,
    organisationId: passport.organisationId,
    createdAt: now,
    updatedAt: now,
    status: "recorded",
    visibility: "internal",
    createdBy: "public",
    source,
  });
  return next;
}
