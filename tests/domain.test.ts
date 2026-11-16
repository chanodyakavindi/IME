import { SEED } from "@/lib/data/seed";
import { buildPublicView } from "@/lib/domain/public-view";
import { commitPassport, lookupPassport, reviewCorrection, submitCorrection } from "@/lib/domain/passports";
import { buyerAccessFee, repairCentreEstimate } from "@/lib/pricing";
import { passportUrl } from "@/lib/qr/links";
import { stopScannerSafely } from "@/lib/qr/scanner";
import { canAccess } from "@/lib/security/access";
import { verifyAuditChain } from "@/lib/security/chain";
import { sha256Hex } from "@/lib/security/hash";
import { maskIdentifier, maskSerial } from "@/lib/security/mask";
import type { Actor, PassportDraftInput } from "@/types";
import { describe, expect, it, vi } from "vitest";

const actor: Actor = { id: "user-tech", name: "Demo Technician", organisationId: "org-abc" };
const now = "2026-09-26T10:00:00.000Z";

const draft: PassportDraftInput = {
  brand: "Samsung",
  model: "Galaxy A15",
  category: "Smartphone",
  identifierLast4: "2468",
  serialLast4: "1357",
  sourceNote: "Counter inspection for a dealer listing.",
  consent: true,
  screenTest: "passed",
  screenPart: "original",
  batteryHealth: 90,
  batteryStatus: "original",
  batteryReplacedLabel: "",
  cameraTest: "passed",
  cameraPart: "original",
  speakerMic: "passed",
  chargingPortTest: "passed",
  chargingPortPart: "original",
  biometric: "not_tested",
  network: "passed",
  waterDamage: "not_observed",
  exterior: "Light signs of use",
  accessories: "Cable included.",
  notes: "Checklist completed for the prototype.",
  evidence: [{ label: "Front photo", kind: "photo", note: "Local preview" }],
};

describe("public passports", () => {
  it("loads the seeded demo passport", () => {
    const view = buildPublicView(SEED, "FP-DEMO-2026-0001");
    expect(view.ok).toBe(true);
    if (!view.ok) return;
    expect(view.passport.brand).toBe("Apple");
    expect(view.passport.model).toBe("iPhone 14");
    expect(view.passport.status).toBe("verified");
    expect(view.evidence.length).toBeGreaterThan(0);
  });

  it("rejects an unknown code and an unpublished draft", () => {
    expect(lookupPassport(SEED, "FP-DEMO-2026-9999").reason).toBe("not_found");
    expect(lookupPassport(SEED, "FP-DEMO-2026-0005").reason).toBe("not_published");
    expect(buildPublicView(SEED, "FP-NOPE").ok).toBe(false);
  });

  it("shows only masked identifiers", () => {
    const view = buildPublicView(SEED, "FP-DEMO-2026-0001");
    if (!view.ok) throw new Error("expected demo passport");
    expect(maskIdentifier("4821")).toBe("••••••••4821");
    expect(maskSerial("1098")).toBe("••••1098");
    expect(view.identifier).toBe("••••••••4821");
    expect(view.serial).toBe("••••1098");
    expect(view.passport.identifierLast4).toHaveLength(4);
    expect(view.identifier.replace(/•/g, "")).toHaveLength(4);
  });
});

describe("passport workflow", () => {
  it("creates and publishes a passport with a QR path and hash chain", () => {
    const created = commitPassport(SEED, draft, actor, now, "draft");
    expect(created.passportId).toBe("FP-2026-0013");
    expect(created.state.passports.find((item) => item.id === created.passportId)?.status).toBe("draft");

    const published = commitPassport(SEED, draft, actor, now, "publish");
    const passport = published.state.passports.find((item) => item.id === published.passportId);
    expect(passport?.status).toBe("verified");
    expect(passport?.visibility).toBe("public");
    expect(passportUrl(published.passportId, "https://fixproof.demo")).toBe(
      "https://fixproof.demo/passport/FP-2026-0013",
    );
    const chain = published.state.audits.filter((item) => item.passportId === published.passportId);
    expect(verifyAuditChain(chain)).toBe(true);
    expect(buildPublicView(published.state, published.passportId).ok).toBe(true);
  });

  it("keeps the seeded demo chain intact", () => {
    const chain = SEED.audits.filter((item) => item.passportId === "FP-DEMO-2026-0001");
    expect(verifyAuditChain(chain)).toBe(true);
    expect(sha256Hex("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    expect(sha256Hex("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
});

describe("corrections", () => {
  it("submits a buyer concern and approves it without rewriting the original repair", () => {
    const submitted = submitCorrection(SEED, {
      passportId: "FP-DEMO-2026-0001",
      issueType: "Evidence",
      description: "The battery screenshot caption is hard to read.",
      contact: "",
      source: "buyer",
      actor: { id: "public", name: "Public buyer", organisationId: null },
      now,
    });
    const request = submitted.corrections.find((item) => item.description.includes("battery screenshot"));
    expect(request?.status).toBe("open");
    const before = submitted.repairs.filter((item) => item.passportId === "FP-DEMO-2026-0001").map((item) => item.summary);
    const approved = reviewCorrection(submitted, {
      requestId: request!.id,
      decision: "approved",
      note: "Caption clarified in a new audit entry.",
      actor: { id: "user-admin", name: "Demo Administrator", organisationId: null },
      now: "2026-09-26T11:00:00.000Z",
    });
    const after = approved.repairs.filter((item) => item.passportId === "FP-DEMO-2026-0001").map((item) => item.summary);
    expect(after).toEqual(before);
    expect(approved.corrections.find((item) => item.id === request!.id)?.status).toBe("approved");
    expect(verifyAuditChain(approved.audits.filter((item) => item.passportId === "FP-DEMO-2026-0001"))).toBe(true);
  });
});

describe("qr scanner", () => {
  it("does not stop a scanner that never started", async () => {
    const stop = vi.fn(async () => undefined);
    await stopScannerSafely({ getState: () => 1, stop });
    expect(stop).not.toHaveBeenCalled();
  });

  it("stops a running scanner and ignores a second stop", async () => {
    const stop = vi.fn(async () => {
      throw "Cannot stop, scanner is not running or paused.";
    });
    await expect(stopScannerSafely({ getState: () => 2, stop })).resolves.toBeUndefined();
    expect(stop).toHaveBeenCalledOnce();
  });
});

describe("access and pricing", () => {
  it("keeps each demo role in its own workspace", () => {
    expect(canAccess("technician", "repair")).toBe(true);
    expect(canAccess("technician", "admin")).toBe(false);
    expect(canAccess("dealer", "dealer")).toBe(true);
    expect(canAccess("dealer", "repair")).toBe(false);
    expect(canAccess("admin", "admin")).toBe(true);
    expect(canAccess(null, "admin")).toBe(false);
  });

  it("prices the repair centre plan in LKR", () => {
    expect(repairCentreEstimate(0)).toBe(6500);
    expect(repairCentreEstimate(2)).toBe(9500);
    expect(repairCentreEstimate(10)).toBe(21500);
    expect(buyerAccessFee()).toBe(0);
    expect(() => repairCentreEstimate(-1)).toThrow();
  });
});
