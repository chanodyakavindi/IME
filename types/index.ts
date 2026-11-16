export type DemoRole = "technician" | "dealer" | "admin";

export type AppArea = "repair" | "dealer" | "admin";

export type PassportStatus =
  | "draft"
  | "verified"
  | "correction_pending"
  | "suspended";

export type ChecklistState =
  | "passed"
  | "needs_attention"
  | "not_tested"
  | "not_recorded";

export type PartOrigin = "original" | "replaced" | "unknown";

export type WaterObservation =
  | "not_observed"
  | "observed"
  | "not_tested"
  | "not_recorded";

export type PartnerType = "repair_centre" | "dealer";

export type PartnerStatus = "pending" | "approved" | "rejected" | "suspended";

export type SubscriptionStatus =
  | "active"
  | "trial"
  | "past_due"
  | "planned"
  | "cancelled";

export type PlanAvailability = "available" | "planned";

export type Visibility = "public" | "internal";

export type InventoryStatus = "available" | "reserved" | "sold" | "archived";

export type CorrectionStatus = "open" | "approved" | "rejected";

export type EvidenceKind = "photo" | "document" | "invoice" | "screenshot";

export interface User {
  id: string;
  name: string;
  role: DemoRole;
  organisationId: string | null;
  createdAt: string;
  updatedAt: string;
  status: "active";
}

export interface Organisation {
  id: string;
  name: string;
  type: PartnerType;
  location: string;
  status: PartnerStatus;
  subscriptionStatus: SubscriptionStatus;
  planId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  audience: string;
  monthlyLkr: number;
  perPassportLkr: number | null;
  status: PlanAvailability;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PartnerApplication {
  id: string;
  organisationName: string;
  partnerType: PartnerType;
  location: string;
  contactName: string;
  email: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface DemoRequest {
  id: string;
  organisationName: string;
  partnerType: PartnerType | "enterprise";
  location: string;
  contactName: string;
  email: string;
  message: string;
  source: string;
  status: "received";
  createdAt: string;
  updatedAt: string;
}

export interface DevicePassport {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: PassportStatus;
  organisationId: string;
  visibility: Visibility;
  evidenceCount: number;
  recordHash: string;
  previousHash: string;
  createdBy: string;
  brand: string;
  model: string;
  category: string;
  identifierLast4: string;
  serialLast4: string;
  sourceNote: string;
  partnerName: string;
  technicianName: string;
  inspectionDate: string;
  batteryHealth: number | null;
  isDemo: boolean;
}

export interface Inspection {
  id: string;
  passportId: string;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "completed";
  visibility: Visibility;
  createdBy: string;
  screenTest: ChecklistState;
  screenPart: PartOrigin;
  batteryHealth: number | null;
  batteryStatus: PartOrigin;
  batteryReplacedLabel: string;
  cameraTest: ChecklistState;
  cameraPart: PartOrigin;
  speakerMic: ChecklistState;
  chargingPortTest: ChecklistState;
  chargingPortPart: PartOrigin;
  biometric: ChecklistState;
  network: ChecklistState;
  waterDamage: WaterObservation;
  exterior: string;
  accessories: string;
  notes: string;
}

export interface RepairEvent {
  id: string;
  passportId: string;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
  status: "recorded";
  visibility: Visibility;
  evidenceCount: number;
  recordHash: string;
  previousHash: string;
  createdBy: string;
  eventType: string;
  partnerName: string;
  technicianName: string;
  summary: string;
}

export interface EvidenceItem {
  id: string;
  passportId: string;
  repairEventId: string;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
  status: "available";
  visibility: Visibility;
  evidenceCount: number;
  recordHash: string;
  previousHash: string;
  createdBy: string;
  label: string;
  kind: EvidenceKind;
  note: string;
  fictional: boolean;
  previewDataUrl?: string;
}

export interface CorrectionRequest {
  id: string;
  passportId: string;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
  status: CorrectionStatus;
  visibility: "internal";
  evidenceCount: number;
  recordHash: string;
  previousHash: string;
  createdBy: string;
  requesterName: string;
  issueType: string;
  description: string;
  contact: string;
  source: "buyer" | "partner";
  internalNote: string;
}

export interface AuditEvent {
  id: string;
  passportId: string;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
  status: "recorded";
  visibility: Visibility;
  evidenceCount: number;
  recordHash: string;
  previousHash: string;
  createdBy: string;
  userName: string;
  action: string;
  summary: string;
}

export interface QrLabel {
  id: string;
  passportId: string;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
  status: "active";
  visibility: Visibility;
  urlPath: string;
  createdBy: string;
}

export interface DealerInventoryItem {
  id: string;
  organisationId: string;
  passportId: string | null;
  createdAt: string;
  updatedAt: string;
  status: InventoryStatus;
  brand: string;
  model: string;
  identifierLast4: string;
  listingTitle: string;
  inspectionDate: string | null;
  evidenceCount: number;
  inspectionRequested: boolean;
}

export interface PublicScanEvent {
  id: string;
  passportId: string;
  organisationId: string;
  createdAt: string;
  updatedAt: string;
  status: "recorded";
  visibility: "internal";
  createdBy: "public";
  source: "qr" | "manual" | "demo";
}

export interface AppState {
  version: number;
  users: User[];
  organisations: Organisation[];
  applications: PartnerApplication[];
  requests: DemoRequest[];
  plans: SubscriptionPlan[];
  passports: DevicePassport[];
  inspections: Inspection[];
  repairs: RepairEvent[];
  evidence: EvidenceItem[];
  corrections: CorrectionRequest[];
  audits: AuditEvent[];
  labels: QrLabel[];
  inventory: DealerInventoryItem[];
  scans: PublicScanEvent[];
}

export interface Actor {
  id: string;
  name: string;
  organisationId: string | null;
}

export interface EvidenceDraft {
  label: string;
  kind: EvidenceKind;
  note: string;
  previewDataUrl?: string;
}

export interface PassportDraftInput {
  brand: string;
  model: string;
  category: string;
  identifierLast4: string;
  serialLast4: string;
  sourceNote: string;
  consent: true;
  screenTest: ChecklistState;
  screenPart: PartOrigin;
  batteryHealth: number | null;
  batteryStatus: PartOrigin;
  batteryReplacedLabel: string;
  cameraTest: ChecklistState;
  cameraPart: PartOrigin;
  speakerMic: ChecklistState;
  chargingPortTest: ChecklistState;
  chargingPortPart: PartOrigin;
  biometric: ChecklistState;
  network: ChecklistState;
  waterDamage: WaterObservation;
  exterior: string;
  accessories: string;
  notes: string;
  evidence: EvidenceDraft[];
}
