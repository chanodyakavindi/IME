import { PLAN_CATALOG } from "@/lib/pricing";
import { latestRecordHash, sealAudit } from "@/lib/security/chain";
import { addSeconds } from "@/lib/utils";
import type {
  AppState,
  AuditEvent,
  ChecklistState,
  DevicePassport,
  EvidenceKind,
  Inspection,
  PartOrigin,
  PassportStatus,
  WaterObservation,
} from "@/types";

const DATA_VERSION = 1;

interface SeedRow {
  id: string;
  org: string;
  brand: string;
  model: string;
  identifierLast4: string;
  serialLast4: string;
  status: PassportStatus;
  createdAt: string;
  batteryHealth: number | null;
  batteryStatus: PartOrigin;
  batteryReplacedLabel: string;
  screenPart: PartOrigin;
  cameraPart: PartOrigin;
  screenTest: ChecklistState;
  cameraTest: ChecklistState;
  speakerMic: ChecklistState;
  chargingPortTest: ChecklistState;
  chargingPortPart: PartOrigin;
  biometric: ChecklistState;
  network: ChecklistState;
  waterDamage: WaterObservation;
  exterior: string;
  accessories: string;
  notes: string;
  sourceNote: string;
  technician: string;
  evidence: { label: string; kind: EvidenceKind }[];
}

const baseCheck = {
  screenTest: "passed" as const,
  cameraTest: "passed" as const,
  speakerMic: "passed" as const,
  chargingPortTest: "passed" as const,
  chargingPortPart: "original" as const,
  biometric: "passed" as const,
  network: "passed" as const,
  waterDamage: "not_observed" as const,
  exterior: "Light signs of use",
  accessories: "Cable included. Box not recorded.",
  batteryHealth: 88,
  batteryStatus: "original" as const,
  batteryReplacedLabel: "",
  screenPart: "original" as const,
  cameraPart: "original" as const,
};

const rows: SeedRow[] = [
  {
    ...baseCheck,
    id: "FP-DEMO-2026-0001",
    org: "org-abc",
    brand: "Apple",
    model: "iPhone 14",
    identifierLast4: "4821",
    serialLast4: "1098",
    status: "verified",
    createdAt: "2026-08-12T04:00:00.000Z",
    batteryHealth: 91,
    batteryStatus: "replaced",
    batteryReplacedLabel: "August 2026",
    exterior: "Moderate signs of use",
    accessories: "Charging cable included. Original box not recorded.",
    notes: "Battery replacement recorded during the inspection. Face ID responded during the test.",
    sourceNote: "Walk-in inspection for a dealer listing. Owner identity was not recorded.",
    technician: "Demo Technician",
    evidence: [
      { label: "Front screen inspection", kind: "photo" },
      { label: "Battery health screenshot", kind: "screenshot" },
      { label: "Rear camera test", kind: "photo" },
      { label: "Repair invoice reference", kind: "invoice" },
    ],
  },
  {
    ...baseCheck,
    id: "FP-DEMO-2026-0002",
    org: "org-csl",
    brand: "Samsung",
    model: "Galaxy S23",
    identifierLast4: "7740",
    serialLast4: "2204",
    status: "verified",
    createdAt: "2026-07-03T04:00:00.000Z",
    batteryHealth: 86,
    technician: "Sample Technician",
    notes: "Screen and camera tests passed. No part replacement was recorded.",
    sourceNote: "Dealer intake inspection. Owner identity was not recorded.",
    evidence: [
      { label: "Front glass check", kind: "photo" },
      { label: "Battery health screenshot", kind: "screenshot" },
      { label: "Charging test note", kind: "document" },
    ],
  },
  {
    ...baseCheck,
    id: "FP-DEMO-2026-0003",
    org: "org-abc",
    brand: "Apple",
    model: "iPhone 13",
    identifierLast4: "3319",
    serialLast4: "8841",
    status: "correction_pending",
    createdAt: "2026-08-21T04:00:00.000Z",
    batteryHealth: 79,
    batteryStatus: "unknown",
    cameraTest: "needs_attention",
    cameraPart: "unknown",
    notes: "Rear camera focus was inconsistent during the test.",
    sourceNote: "Counter inspection. Owner identity was not recorded.",
    technician: "Demo Technician",
    evidence: [
      { label: "Rear camera test", kind: "photo" },
      { label: "Exterior photo", kind: "photo" },
    ],
  },
  {
    ...baseCheck,
    id: "FP-DEMO-2026-0004",
    org: "org-wdw",
    brand: "Google",
    model: "Pixel 7",
    identifierLast4: "1904",
    serialLast4: "6620",
    status: "verified",
    createdAt: "2026-06-16T04:00:00.000Z",
    batteryHealth: 90,
    network: "not_tested",
    technician: "Sample Technician",
    notes: "Network test was not completed because a SIM was not available.",
    sourceNote: "Refurbishment bench. Owner identity was not recorded.",
    evidence: [
      { label: "Screen inspection", kind: "photo" },
      { label: "Battery health screenshot", kind: "screenshot" },
    ],
  },
  {
    ...baseCheck,
    id: "FP-DEMO-2026-0005",
    org: "org-abc",
    brand: "Xiaomi",
    model: "Redmi Note 12",
    identifierLast4: "5582",
    serialLast4: "0144",
    status: "draft",
    createdAt: "2026-09-18T04:00:00.000Z",
    batteryHealth: null,
    batteryStatus: "unknown",
    screenTest: "not_recorded",
    cameraTest: "not_recorded",
    speakerMic: "not_recorded",
    chargingPortTest: "not_tested",
    biometric: "not_tested",
    network: "not_recorded",
    waterDamage: "not_recorded",
    exterior: "Not recorded",
    technician: "Demo Technician",
    notes: "Draft checklist started and not yet published.",
    sourceNote: "Draft intake. Owner identity was not recorded.",
    evidence: [],
  },
  {
    ...baseCheck,
    id: "FP-DEMO-2026-0006",
    org: "org-wdw",
    brand: "Apple",
    model: "iPhone 12",
    identifierLast4: "9091",
    serialLast4: "4410",
    status: "suspended",
    createdAt: "2026-05-22T04:00:00.000Z",
    batteryHealth: 84,
    technician: "Sample Technician",
    notes: "Record retained after the partner review flag.",
    sourceNote: "Historical inspection. Owner identity was not recorded.",
    evidence: [{ label: "Exterior photo", kind: "photo" }],
  },
  {
    ...baseCheck,
    id: "FP-DEMO-2026-0007",
    org: "org-csl",
    brand: "Samsung",
    model: "Galaxy A54",
    identifierLast4: "2468",
    serialLast4: "1357",
    status: "correction_pending",
    createdAt: "2026-07-28T04:00:00.000Z",
    batteryHealth: 93,
    screenPart: "replaced",
    technician: "Sample Technician",
    notes: "Display assembly recorded as replaced. Invoice reference was queried later.",
    sourceNote: "Dealer listing support. Owner identity was not recorded.",
    evidence: [
      { label: "Display inspection", kind: "photo" },
      { label: "Battery health screenshot", kind: "screenshot" },
    ],
  },
  {
    ...baseCheck,
    id: "FP-DEMO-2026-0008",
    org: "org-abc",
    brand: "Apple",
    model: "iPhone 15",
    identifierLast4: "6703",
    serialLast4: "7788",
    status: "verified",
    createdAt: "2026-08-04T04:00:00.000Z",
    batteryHealth: 97,
    technician: "Demo Technician",
    notes: "Checklist completed with original parts recorded.",
    sourceNote: "Pre-sale inspection. Owner identity was not recorded.",
    evidence: [
      { label: "Front screen inspection", kind: "photo" },
      { label: "Battery health screenshot", kind: "screenshot" },
      { label: "Camera test", kind: "photo" },
      { label: "Inspection note", kind: "document" },
    ],
  },
  {
    ...baseCheck,
    id: "FP-DEMO-2026-0009",
    org: "org-wdw",
    brand: "Oppo",
    model: "Reno 8",
    identifierLast4: "8126",
    serialLast4: "9033",
    status: "verified",
    createdAt: "2026-04-27T04:00:00.000Z",
    batteryHealth: 82,
    speakerMic: "needs_attention",
    technician: "Sample Technician",
    notes: "Earpiece volume was low during the speaker test.",
    sourceNote: "Workshop inspection. Owner identity was not recorded.",
    evidence: [
      { label: "Speaker test note", kind: "document" },
      { label: "Exterior photo", kind: "photo" },
      { label: "Battery health screenshot", kind: "screenshot" },
    ],
  },
  {
    ...baseCheck,
    id: "FP-DEMO-2026-0010",
    org: "org-csl",
    brand: "Vivo",
    model: "Y27",
    identifierLast4: "4545",
    serialLast4: "1212",
    status: "verified",
    createdAt: "2026-06-09T04:00:00.000Z",
    batteryHealth: 76,
    batteryStatus: "replaced",
    batteryReplacedLabel: "June 2026",
    waterDamage: "observed",
    technician: "Sample Technician",
    notes: "Moisture indicator was visible during inspection. This does not describe hidden damage elsewhere.",
    sourceNote: "Repair intake. Owner identity was not recorded.",
    evidence: [
      { label: "Moisture indicator photo", kind: "photo" },
      { label: "Battery health screenshot", kind: "screenshot" },
    ],
  },
  {
    ...baseCheck,
    id: "FP-DEMO-2026-0011",
    org: "org-csl",
    brand: "Apple",
    model: "iPhone 11",
    identifierLast4: "3008",
    serialLast4: "6501",
    status: "verified",
    createdAt: "2026-09-02T04:00:00.000Z",
    batteryHealth: 85,
    biometric: "not_tested",
    technician: "Sample Technician",
    notes: "Biometric test was not completed.",
    sourceNote: "Trade-in inspection. Owner identity was not recorded.",
    evidence: [
      { label: "Front screen inspection", kind: "photo" },
      { label: "Battery health screenshot", kind: "screenshot" },
      { label: "Inspection note", kind: "document" },
      { label: "Repair invoice reference", kind: "invoice" },
    ],
  },
  {
    ...baseCheck,
    id: "FP-DEMO-2026-0012",
    org: "org-wdw",
    brand: "Samsung",
    model: "Galaxy S22",
    identifierLast4: "1114",
    serialLast4: "9080",
    status: "verified",
    createdAt: "2026-05-14T04:00:00.000Z",
    batteryHealth: 89,
    chargingPortPart: "replaced",
    technician: "Sample Technician",
    notes: "Charging port recorded as replaced. Function test passed.",
    sourceNote: "Refurbishment record. Owner identity was not recorded.",
    evidence: [
      { label: "Charging port photo", kind: "photo" },
      { label: "Function test note", kind: "document" },
    ],
  },
];

function buildSeed(): AppState {
  const organisations: AppState["organisations"] = [
    org("org-abc", "ABC Mobile Care", "repair_centre", "Kadawatha", "approved", "active", "repair-centre", "2026-04-02T00:00:00.000Z"),
    org("org-csl", "Colombo Screen Lab", "repair_centre", "Colombo 03", "approved", "active", "repair-centre", "2026-04-18T00:00:00.000Z"),
    org("org-wdw", "Western Device Works", "repair_centre", "Negombo", "approved", "trial", "repair-centre", "2026-05-06T00:00:00.000Z"),
    org("org-lpe", "LankaPhone Exchange", "dealer", "Kadawatha", "approved", "active", "dealer", "2026-05-20T00:00:00.000Z"),
    org("org-cpm", "City Preowned Mobiles", "dealer", "Colombo 07", "approved", "active", "dealer", "2026-06-11T00:00:00.000Z"),
  ];
  const users: AppState["users"] = [
    user("user-tech", "Demo Technician", "technician", "org-abc"),
    user("user-dealer", "Demo Dealer", "dealer", "org-lpe"),
    user("user-admin", "Demo Administrator", "admin", null),
  ];
  const passports: DevicePassport[] = [];
  const inspections: Inspection[] = [];
  const repairs: AppState["repairs"] = [];
  const evidence: AppState["evidence"] = [];
  const audits: AuditEvent[] = [];
  const labels: AppState["labels"] = [];
  const corrections: AppState["corrections"] = [];

  rows.forEach((row, index) => {
    const partner = organisations.find((item) => item.id === row.org);
    if (!partner) throw new Error("Missing partner");
    const published = row.status !== "draft";
    const draftAudit = pushAudit(audits, {
      passportId: row.id,
      organisationId: row.org,
      createdAt: row.createdAt,
      createdBy: row.org === "org-abc" ? "user-tech" : "user-seed",
      userName: row.technician,
      action: "passport.draft_created",
      summary: `Draft created for ${row.brand} ${row.model}.`,
      visibility: "internal",
      evidenceCount: row.evidence.length,
    });
    let latest = draftAudit;
    if (published) {
      latest = pushAudit(audits, {
        passportId: row.id,
        organisationId: row.org,
        createdAt: addSeconds(row.createdAt, 2),
        createdBy: draftAudit.createdBy,
        userName: row.technician,
        action: "passport.published",
        summary: `Inspection published with ${row.evidence.length} evidence item${row.evidence.length === 1 ? "" : "s"}.`,
        visibility: "public",
        evidenceCount: row.evidence.length,
      });
      repairs.push({
        id: `REP-${String(repairs.length + 1).padStart(4, "0")}`,
        passportId: row.id,
        organisationId: row.org,
        createdAt: latest.createdAt,
        updatedAt: latest.createdAt,
        status: "recorded",
        visibility: "public",
        evidenceCount: row.evidence.length,
        recordHash: latest.recordHash,
        previousHash: latest.previousHash,
        createdBy: latest.createdBy,
        eventType: "Inspection published",
        partnerName: partner.name,
        technicianName: row.technician,
        summary: row.notes,
      });
      if (row.batteryStatus === "replaced") {
        const battery = pushAudit(audits, {
          passportId: row.id,
          organisationId: row.org,
          createdAt: addSeconds(row.createdAt, 3),
          createdBy: latest.createdBy,
          userName: row.technician,
          action: "repair.recorded",
          summary: `Battery recorded as replaced${row.batteryReplacedLabel ? ` (${row.batteryReplacedLabel})` : ""}.`,
          visibility: "public",
          evidenceCount: row.evidence.length,
        });
        latest = battery;
        repairs.push({
          id: `REP-${String(repairs.length + 1).padStart(4, "0")}`,
          passportId: row.id,
          organisationId: row.org,
          createdAt: battery.createdAt,
          updatedAt: battery.createdAt,
          status: "recorded",
          visibility: "public",
          evidenceCount: 1,
          recordHash: battery.recordHash,
          previousHash: battery.previousHash,
          createdBy: battery.createdBy,
          eventType: "Battery replacement recorded",
          partnerName: partner.name,
          technicianName: row.technician,
          summary: battery.summary,
        });
      }
      labels.push({
        id: `QR-${String(labels.length + 1).padStart(4, "0")}`,
        passportId: row.id,
        organisationId: row.org,
        createdAt: latest.createdAt,
        updatedAt: latest.createdAt,
        status: "active",
        visibility: "public",
        urlPath: `/passport/${row.id}`,
        createdBy: latest.createdBy,
      });
    }
    if (row.status === "suspended") {
      latest = pushAudit(audits, {
        passportId: row.id,
        organisationId: row.org,
        createdAt: addSeconds(row.createdAt, 4),
        createdBy: "user-admin",
        userName: "Demo Administrator",
        action: "partner.suspended",
        summary: "Record marked suspended for the demonstration queue. Earlier events were kept.",
        visibility: "public",
        evidenceCount: row.evidence.length,
      });
    }
    const repairId = repairs.find((item) => item.passportId === row.id)?.id ?? "none";
    row.evidence.forEach((item) => {
      evidence.push({
        id: `EV-${String(evidence.length + 1).padStart(4, "0")}`,
        passportId: row.id,
        repairEventId: repairId,
        organisationId: row.org,
        createdAt: row.createdAt,
        updatedAt: row.createdAt,
        status: "available",
        visibility: published ? "public" : "internal",
        evidenceCount: 1,
        recordHash: latest.recordHash,
        previousHash: latest.previousHash,
        createdBy: latest.createdBy,
        label: item.label,
        kind: item.kind,
        note: "Fictional demonstration evidence. This is not a photograph of a customer device.",
        fictional: true,
      });
    });
    inspections.push({
      id: `INS-${String(index + 1).padStart(4, "0")}`,
      passportId: row.id,
      organisationId: row.org,
      createdAt: row.createdAt,
      updatedAt: latest.createdAt,
      status: published ? "completed" : "draft",
      visibility: published ? "public" : "internal",
      createdBy: latest.createdBy,
      screenTest: row.screenTest,
      screenPart: row.screenPart,
      batteryHealth: row.batteryHealth,
      batteryStatus: row.batteryStatus,
      batteryReplacedLabel: row.batteryReplacedLabel,
      cameraTest: row.cameraTest,
      cameraPart: row.cameraPart,
      speakerMic: row.speakerMic,
      chargingPortTest: row.chargingPortTest,
      chargingPortPart: row.chargingPortPart,
      biometric: row.biometric,
      network: row.network,
      waterDamage: row.waterDamage,
      exterior: row.exterior,
      accessories: row.accessories,
      notes: row.notes,
    });
    passports.push({
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: latest.createdAt,
      status: row.status,
      organisationId: row.org,
      visibility: published ? "public" : "internal",
      evidenceCount: row.evidence.length,
      recordHash: latest.recordHash,
      previousHash: latest.previousHash,
      createdBy: latest.createdBy,
      brand: row.brand,
      model: row.model,
      category: "Smartphone",
      identifierLast4: row.identifierLast4,
      serialLast4: row.serialLast4,
      sourceNote: row.sourceNote,
      partnerName: partner.name,
      technicianName: row.technician,
      inspectionDate: row.createdAt.slice(0, 10),
      batteryHealth: row.batteryHealth,
      isDemo: true,
    });
  });

  addCorrection(corrections, audits, passports, {
    passportId: "FP-DEMO-2026-0003",
    now: "2026-08-22T09:00:00.000Z",
    status: "open",
    source: "buyer",
    issueType: "Condition summary",
    description: "The camera result is unclear for a buyer reading the public record.",
    contact: "",
    actorId: "public",
    actorName: "Public buyer",
    note: "",
    finalStatus: "correction_pending",
  });
  addCorrection(corrections, audits, passports, {
    passportId: "FP-DEMO-2026-0007",
    now: "2026-09-04T09:00:00.000Z",
    status: "open",
    source: "partner",
    issueType: "Missing evidence",
    description: "The display replacement needs the invoice reference attached.",
    contact: "workshop@example.test",
    actorId: "user-tech",
    actorName: "Sample Technician",
    note: "",
    finalStatus: "correction_pending",
  });
  addCorrection(corrections, audits, passports, {
    passportId: "FP-DEMO-2026-0010",
    now: "2026-06-12T09:00:00.000Z",
    status: "rejected",
    source: "buyer",
    issueType: "Water damage wording",
    description: "A reader asked whether the observation meant the device was definitely exposed.",
    contact: "",
    actorId: "public",
    actorName: "Public buyer",
    note: "Wording already says the observation was during inspection. No record change made.",
    finalStatus: "verified",
  });
  addCorrection(corrections, audits, passports, {
    passportId: "FP-DEMO-2026-0004",
    now: "2026-06-20T09:00:00.000Z",
    status: "approved",
    source: "partner",
    issueType: "Checklist update",
    description: "Network test should stay marked as not tested.",
    contact: "bench@example.test",
    actorId: "user-admin",
    actorName: "Demo Administrator",
    note: "Approved as a new audit entry. The original inspection event was not overwritten.",
    finalStatus: "verified",
  });

  const scans = buildScans(passports);
  const inventory = [
    inventoryItem("INV-0001", "org-lpe", "FP-DEMO-2026-0001", "available", passports, false),
    inventoryItem("INV-0002", "org-lpe", "FP-DEMO-2026-0008", "reserved", passports, false),
    inventoryItem("INV-0003", "org-lpe", "FP-DEMO-2026-0002", "sold", passports, false),
    {
      id: "INV-0004",
      organisationId: "org-lpe",
      passportId: null,
      createdAt: "2026-09-12T04:00:00.000Z",
      updatedAt: "2026-09-12T04:00:00.000Z",
      status: "available" as const,
      brand: "Xiaomi",
      model: "Redmi 13C",
      identifierLast4: "6060",
      listingTitle: "Redmi 13C — inspection not linked",
      inspectionDate: null,
      evidenceCount: 0,
      inspectionRequested: true,
    },
    inventoryItem("INV-0005", "org-lpe", "FP-DEMO-2026-0011", "archived", passports, false),
    inventoryItem("INV-0006", "org-cpm", "FP-DEMO-2026-0007", "available", passports, false),
  ];

  return {
    version: DATA_VERSION,
    users,
    organisations,
    applications: [
      {
        id: "APP-0001",
        organisationName: "Harbour Device Clinic",
        partnerType: "repair_centre",
        location: "Wattala",
        contactName: "Demo Applicant",
        email: "harbour@example.test",
        message: "Requesting a Western Province pilot walkthrough for a two-bench repair shop.",
        status: "pending",
        createdAt: "2026-09-10T04:00:00.000Z",
        updatedAt: "2026-09-10T04:00:00.000Z",
      },
      {
        id: "APP-0002",
        organisationName: "Hill Country Resale",
        partnerType: "dealer",
        location: "Kandy",
        contactName: "Demo Applicant",
        email: "hill@example.test",
        message: "Asked to join before the Western Province pilot area was confirmed.",
        status: "rejected",
        createdAt: "2026-08-02T04:00:00.000Z",
        updatedAt: "2026-08-08T04:00:00.000Z",
      },
    ],
    requests: [],
    plans: PLAN_CATALOG,
    passports,
    inspections,
    repairs,
    evidence,
    corrections,
    audits,
    labels,
    inventory,
    scans,
  };
}

function org(
  id: string,
  name: string,
  type: AppState["organisations"][number]["type"],
  location: string,
  status: AppState["organisations"][number]["status"],
  subscriptionStatus: AppState["organisations"][number]["subscriptionStatus"],
  planId: string,
  createdAt: string,
): AppState["organisations"][number] {
  return { id, name, type, location, status, subscriptionStatus, planId, createdAt, updatedAt: createdAt };
}

function user(
  id: string,
  name: string,
  role: AppState["users"][number]["role"],
  organisationId: string | null,
): AppState["users"][number] {
  return {
    id,
    name,
    role,
    organisationId,
    createdAt: "2026-04-02T00:00:00.000Z",
    updatedAt: "2026-04-02T00:00:00.000Z",
    status: "active",
  };
}

function pushAudit(
  audits: AuditEvent[],
  input: Omit<AuditEvent, "id" | "updatedAt" | "status" | "recordHash" | "previousHash">,
): AuditEvent {
  const event = sealAudit({
    ...input,
    id: `AUD-${String(audits.length + 1).padStart(4, "0")}`,
    previousHash: latestRecordHash(audits, input.passportId),
  });
  audits.push(event);
  return event;
}

function addCorrection(
  corrections: AppState["corrections"],
  audits: AuditEvent[],
  passports: DevicePassport[],
  input: {
    passportId: string;
    now: string;
    status: AppState["corrections"][number]["status"];
    source: "buyer" | "partner";
    issueType: string;
    description: string;
    contact: string;
    actorId: string;
    actorName: string;
    note: string;
    finalStatus: PassportStatus;
  },
) {
  const passport = passports.find((item) => item.id === input.passportId);
  if (!passport) throw new Error("Missing passport");
  const submitted = pushAudit(audits, {
    passportId: passport.id,
    organisationId: passport.organisationId,
    createdAt: input.now,
    createdBy: input.actorId,
    userName: input.actorName,
    action: "correction.submitted",
    summary: `${input.issueType}: ${input.description}`,
    visibility: "internal",
    evidenceCount: 0,
  });
  let record = submitted;
  if (input.status !== "open") {
    record = pushAudit(audits, {
      passportId: passport.id,
      organisationId: passport.organisationId,
      createdAt: addSeconds(input.now, 1),
      createdBy: "user-admin",
      userName: "Demo Administrator",
      action: input.status === "approved" ? "correction.approved" : "correction.rejected",
      summary: input.note,
      visibility: "internal",
      evidenceCount: 0,
    });
  }
  corrections.push({
    id: `CR-${String(corrections.length + 1).padStart(4, "0")}`,
    passportId: passport.id,
    organisationId: passport.organisationId,
    createdAt: input.now,
    updatedAt: record.createdAt,
    status: input.status,
    visibility: "internal",
    evidenceCount: 0,
    recordHash: record.recordHash,
    previousHash: record.previousHash,
    createdBy: input.actorId,
    requesterName: input.actorName,
    issueType: input.issueType,
    description: input.description,
    contact: input.contact,
    source: input.source,
    internalNote: input.note,
  });
  passport.status = input.finalStatus;
  passport.updatedAt = record.createdAt;
  passport.recordHash = record.recordHash;
  passport.previousHash = record.previousHash;
}

function buildScans(passports: DevicePassport[]): AppState["scans"] {
  const publicPassports = passports.filter((item) => item.visibility === "public");
  const plan = [
    ["2026-04", 18],
    ["2026-05", 27],
    ["2026-06", 34],
    ["2026-07", 41],
    ["2026-08", 52],
    ["2026-09", 29],
  ] as const;
  const scans: AppState["scans"] = [];
  plan.forEach(([month, count], monthIndex) => {
    for (let index = 0; index < count; index += 1) {
      const passport = publicPassports[(monthIndex * 7 + index) % publicPassports.length];
      const day = String((index % 27) + 1).padStart(2, "0");
      const minute = String(index % 60).padStart(2, "0");
      scans.push({
        id: `SCN-${String(scans.length + 1).padStart(4, "0")}`,
        passportId: passport.id,
        organisationId: passport.organisationId,
        createdAt: `${month}-${day}T08:${minute}:00.000Z`,
        updatedAt: `${month}-${day}T08:${minute}:00.000Z`,
        status: "recorded",
        visibility: "internal",
        createdBy: "public",
        source: index % 5 === 0 ? "manual" : "qr",
      });
    }
  });
  return scans;
}

function inventoryItem(
  id: string,
  organisationId: string,
  passportId: string,
  status: AppState["inventory"][number]["status"],
  passports: DevicePassport[],
  inspectionRequested: boolean,
): AppState["inventory"][number] {
  const passport = passports.find((item) => item.id === passportId);
  if (!passport) throw new Error("Missing inventory passport");
  return {
    id,
    organisationId,
    passportId,
    createdAt: passport.createdAt,
    updatedAt: passport.updatedAt,
    status,
    brand: passport.brand,
    model: passport.model,
    identifierLast4: passport.identifierLast4,
    listingTitle: `${passport.brand} ${passport.model} — passport linked`,
    inspectionDate: passport.inspectionDate,
    evidenceCount: passport.evidenceCount,
    inspectionRequested,
  };
}

export const SEED: AppState = buildSeed();
export const DATA_VERSION_NUMBER = DATA_VERSION;
