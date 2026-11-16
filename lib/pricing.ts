import type { SubscriptionPlan } from "@/types";

export const REPAIR_MONTHLY_LKR = 6500;
export const PASSPORT_FEE_LKR = 1500;
export const DEALER_MONTHLY_LKR = 15000;
export const ENTERPRISE_MONTHLY_LKR = 25000;

export const PLAN_CATALOG: SubscriptionPlan[] = [
  {
    id: "repair-centre",
    name: "Repair Centre Plan",
    audience: "Repair centres and refurbishers",
    monthlyLkr: REPAIR_MONTHLY_LKR,
    perPassportLkr: PASSPORT_FEE_LKR,
    status: "available",
    features: [
      "Partner dashboard",
      "Guided inspection checklist",
      "QR labels",
      "Evidence timeline",
      "Correction requests",
    ],
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "dealer",
    name: "Dealer Plan",
    audience: "Used-phone dealers",
    monthlyLkr: DEALER_MONTHLY_LKR,
    perPassportLkr: null,
    status: "available",
    features: [
      "Inventory view",
      "Passport links",
      "Listing verification status",
      "Dealer dashboard",
      "Buyer-facing sharing tools",
    ],
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    audience: "Multi-branch partners",
    monthlyLkr: ENTERPRISE_MONTHLY_LKR,
    perPassportLkr: null,
    status: "planned",
    features: [
      "Batch reporting",
      "Future API access",
      "Organisation-level reporting",
    ],
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
  },
];

export function repairCentreEstimate(passportCount: number): number {
  if (!Number.isInteger(passportCount) || passportCount < 0) {
    throw new Error("Passport count must be a non-negative integer.");
  }
  return REPAIR_MONTHLY_LKR + passportCount * PASSPORT_FEE_LKR;
}

export function buyerAccessFee(): number {
  return 0;
}
