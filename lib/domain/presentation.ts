import { maskIdentifier, maskSerial } from "@/lib/security/mask";
import { percent } from "@/lib/utils";
import type { ChecklistState, Inspection, PartOrigin } from "@/types";

export const EXPECTED_EVIDENCE = 4;

export function evidenceCompleteness(count: number): number {
  return Math.min(100, percent(count, EXPECTED_EVIDENCE));
}

export function checklistLabel(state: ChecklistState): string {
  if (state === "passed") return "Passed";
  if (state === "needs_attention") return "Needs attention";
  if (state === "not_tested") return "Not tested";
  return "Not recorded";
}

export function partLabel(part: PartOrigin, replacedLabel = ""): string {
  if (part === "original") return "Original";
  if (part === "unknown") return "Unknown";
  return replacedLabel ? `Replaced — ${replacedLabel}` : "Replaced";
}

export function waterLabel(value: Inspection["waterDamage"]): string {
  if (value === "not_observed") return "Not observed during inspection";
  if (value === "observed") return "Observed during inspection";
  if (value === "not_tested") return "Not tested";
  return "Not recorded";
}

export interface ConditionRow {
  label: string;
  value: string;
  tone: "ok" | "warn" | "neutral" | "alert";
}

export function conditionRows(inspection: Inspection): ConditionRow[] {
  const charging =
    inspection.chargingPortTest === "passed"
      ? "Passed visual/function test"
      : checklistLabel(inspection.chargingPortTest);
  const biometric =
    inspection.biometric === "passed" ? "Tested" : checklistLabel(inspection.biometric);

  return [
    { label: "Screen", value: partLabel(inspection.screenPart), tone: toneForPart(inspection.screenPart) },
    {
      label: "Battery",
      value: partLabel(inspection.batteryStatus, inspection.batteryReplacedLabel),
      tone: toneForPart(inspection.batteryStatus),
    },
    { label: "Camera", value: partLabel(inspection.cameraPart), tone: toneForPart(inspection.cameraPart) },
    { label: "Water damage observation", value: waterLabel(inspection.waterDamage), tone: "neutral" },
    { label: "Charging port", value: charging, tone: toneForCheck(inspection.chargingPortTest) },
    { label: "Face ID or biometric test", value: biometric, tone: toneForCheck(inspection.biometric) },
    { label: "Exterior condition", value: inspection.exterior, tone: "neutral" },
    { label: "Items not recorded", value: unrecordedSummary(inspection), tone: "neutral" },
  ];
}

function toneForPart(part: PartOrigin): ConditionRow["tone"] {
  if (part === "original") return "ok";
  if (part === "replaced") return "warn";
  return "neutral";
}

function toneForCheck(state: ChecklistState): ConditionRow["tone"] {
  if (state === "passed") return "ok";
  if (state === "needs_attention") return "warn";
  return "neutral";
}

function unrecordedSummary(inspection: Inspection): string {
  const missing: string[] = [];
  const checks: [string, ChecklistState][] = [
    ["Screen test", inspection.screenTest],
    ["Camera test", inspection.cameraTest],
    ["Speaker and microphone", inspection.speakerMic],
    ["Charging port", inspection.chargingPortTest],
    ["Biometric test", inspection.biometric],
    ["Network test", inspection.network],
  ];
  checks.forEach(([label, state]) => {
    if (state === "not_recorded" || state === "not_tested") missing.push(`${label}: ${checklistLabel(state)}`);
  });
  if (inspection.screenPart === "unknown") missing.push("Screen part: Unknown");
  if (inspection.batteryStatus === "unknown") missing.push("Battery part: Unknown");
  if (inspection.cameraPart === "unknown") missing.push("Camera part: Unknown");
  if (inspection.waterDamage === "not_recorded" || inspection.waterDamage === "not_tested") {
    missing.push(`Water damage: ${waterLabel(inspection.waterDamage)}`);
  }
  return missing.length ? missing.join("; ") : "None in this checklist";
}

export function publicIdentifier(last4: string): string {
  return maskIdentifier(last4);
}

export function publicSerial(last4: string): string {
  return maskSerial(last4);
}
