"use client";

import { SEED } from "@/lib/data/seed";
import {
  addInventoryItem,
  linkInventoryPassport,
  requestInventoryInspection,
  setInventoryStatus,
} from "@/lib/domain/inventory";
import {
  addRepairEvent,
  commitPassport,
  recordScan,
  reviewApplication,
  reviewCorrection,
  saveDemoRequest,
  submitCorrection,
  suspendPartner,
} from "@/lib/domain/passports";
import type { Actor, AppState, InventoryStatus, PassportDraftInput } from "@/types";
import { useSyncExternalStore, type ReactNode } from "react";

export const STORAGE_KEY = "fixproof.demo-state.v1";

type StoreValue = {
  state: AppState;
  ready: boolean;
  resetDemo: () => void;
  publishPassport: (input: PassportDraftInput, actor: Actor, now: string) => { passportId: string };
  saveDraft: (input: PassportDraftInput, actor: Actor, now: string) => { passportId: string };
  addRepair: (input: Parameters<typeof addRepairEvent>[1]) => void;
  sendCorrection: (input: Parameters<typeof submitCorrection>[1]) => void;
  decideCorrection: (input: Parameters<typeof reviewCorrection>[1]) => void;
  suspend: (organisationId: string, actor: Actor, now: string) => void;
  decideApplication: (id: string, decision: "approved" | "rejected", now: string) => void;
  saveRequest: (input: Parameters<typeof saveDemoRequest>[1], now: string) => void;
  scan: (passportId: string, source: "qr" | "manual" | "demo", now: string) => void;
  addDevice: (input: Parameters<typeof addInventoryItem>[1]) => void;
  markDevice: (itemId: string, status: InventoryStatus, now: string) => void;
  linkDevice: (itemId: string, passportId: string, now: string) => void;
  requestInspection: (itemId: string, now: string) => void;
};

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedState: AppState = SEED;

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AppState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return SEED;
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  try {
    const parsed = JSON.parse(raw) as AppState;
    cachedState = parsed.version === SEED.version ? parsed : SEED;
  } catch {
    cachedState = SEED;
  }
  return cachedState;
}

function getServerSnapshot(): AppState {
  return SEED;
}

function writeState(next: AppState) {
  const save = (value: AppState) => {
    const raw = JSON.stringify(value);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedState = value;
  };
  try {
    save(next);
  } catch {
    save({
      ...next,
      evidence: next.evidence.map((item) => ({ ...item, previewDataUrl: undefined })),
    });
  }
  emit();
}

function update(recipe: (current: AppState) => AppState) {
  writeState(recipe(getSnapshot()));
}

const actions = {
  resetDemo: () => {
    window.localStorage.removeItem(STORAGE_KEY);
    cachedRaw = null;
    cachedState = SEED;
    emit();
  },
  publishPassport: (input: PassportDraftInput, actor: Actor, now: string) => {
    const result = commitPassport(getSnapshot(), input, actor, now, "publish");
    writeState(result.state);
    return { passportId: result.passportId };
  },
  saveDraft: (input: PassportDraftInput, actor: Actor, now: string) => {
    const result = commitPassport(getSnapshot(), input, actor, now, "draft");
    writeState(result.state);
    return { passportId: result.passportId };
  },
  addRepair: (input: Parameters<typeof addRepairEvent>[1]) => update((current) => addRepairEvent(current, input)),
  sendCorrection: (input: Parameters<typeof submitCorrection>[1]) => update((current) => submitCorrection(current, input)),
  decideCorrection: (input: Parameters<typeof reviewCorrection>[1]) => update((current) => reviewCorrection(current, input)),
  suspend: (organisationId: string, actor: Actor, now: string) =>
    update((current) => suspendPartner(current, organisationId, actor, now)),
  decideApplication: (id: string, decision: "approved" | "rejected", now: string) =>
    update((current) => reviewApplication(current, id, decision, now)),
  saveRequest: (input: Parameters<typeof saveDemoRequest>[1], now: string) =>
    update((current) => saveDemoRequest(current, input, now)),
  scan: (passportId: string, source: "qr" | "manual" | "demo", now: string) =>
    update((current) => recordScan(current, passportId, source, now)),
  addDevice: (input: Parameters<typeof addInventoryItem>[1]) => update((current) => addInventoryItem(current, input)),
  markDevice: (itemId: string, status: InventoryStatus, now: string) =>
    update((current) => setInventoryStatus(current, itemId, status, now)),
  linkDevice: (itemId: string, passportId: string, now: string) =>
    update((current) => linkInventoryPassport(current, itemId, passportId, now)),
  requestInspection: (itemId: string, now: string) =>
    update((current) => requestInventoryInspection(current, itemId, now)),
};

export function StoreProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useStore(): StoreValue {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { state, ready: true, ...actions };
}
