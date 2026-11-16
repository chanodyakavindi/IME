import { nextNumericId } from "@/lib/domain/passports";
import type { AppState, DealerInventoryItem, InventoryStatus } from "@/types";

export function addInventoryItem(
  state: AppState,
  input: {
    organisationId: string;
    brand: string;
    model: string;
    identifierLast4: string;
    listingTitle: string;
    passportId: string | null;
    now: string;
  },
): AppState {
  const next = structuredClone(state);
  const passport = input.passportId
    ? next.passports.find((item) => item.id === input.passportId)
    : null;
  if (input.passportId && !passport) throw new Error("Passport not found.");
  const item: DealerInventoryItem = {
    id: nextNumericId("INV", next.inventory.map((entry) => entry.id)),
    organisationId: input.organisationId,
    passportId: passport?.id ?? null,
    createdAt: input.now,
    updatedAt: input.now,
    status: "available",
    brand: input.brand,
    model: input.model,
    identifierLast4: input.identifierLast4,
    listingTitle: input.listingTitle,
    inspectionDate: passport?.inspectionDate ?? null,
    evidenceCount: passport?.evidenceCount ?? 0,
    inspectionRequested: false,
  };
  next.inventory.push(item);
  return next;
}

export function setInventoryStatus(
  state: AppState,
  itemId: string,
  status: InventoryStatus,
  now: string,
): AppState {
  const next = structuredClone(state);
  const item = next.inventory.find((entry) => entry.id === itemId);
  if (!item) throw new Error("Inventory item not found.");
  item.status = status;
  item.updatedAt = now;
  return next;
}

export function linkInventoryPassport(
  state: AppState,
  itemId: string,
  passportId: string,
  now: string,
): AppState {
  const next = structuredClone(state);
  const item = next.inventory.find((entry) => entry.id === itemId);
  const passport = next.passports.find((entry) => entry.id === passportId);
  if (!item || !passport) throw new Error("Could not link that passport.");
  if (passport.visibility !== "public") throw new Error("Only a published passport can be linked.");
  item.passportId = passport.id;
  item.inspectionDate = passport.inspectionDate;
  item.evidenceCount = passport.evidenceCount;
  item.updatedAt = now;
  return next;
}

export function requestInventoryInspection(state: AppState, itemId: string, now: string): AppState {
  const next = structuredClone(state);
  const item = next.inventory.find((entry) => entry.id === itemId);
  if (!item) throw new Error("Inventory item not found.");
  item.inspectionRequested = true;
  item.updatedAt = now;
  return next;
}
