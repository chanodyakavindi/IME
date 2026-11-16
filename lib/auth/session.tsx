"use client";

import { canAccess, homePath } from "@/lib/security/access";
import type { AppArea, DemoRole } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

export const SESSION_KEY = "fixproof.demo-session";

export interface DemoSession {
  role: DemoRole;
  userId: string;
  name: string;
  organisationId: string | null;
  organisationName: string | null;
}

export const DEMO_ACCOUNTS: DemoSession[] = [
  {
    role: "technician",
    userId: "user-tech",
    name: "Demo Technician",
    organisationId: "org-abc",
    organisationName: "ABC Mobile Care",
  },
  {
    role: "dealer",
    userId: "user-dealer",
    name: "Demo Dealer",
    organisationId: "org-lpe",
    organisationName: "LankaPhone Exchange",
  },
  {
    role: "admin",
    userId: "user-admin",
    name: "Demo Administrator",
    organisationId: null,
    organisationName: null,
  },
];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedSession: DemoSession | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function read(raw: string | null): DemoSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DemoSession;
    return DEMO_ACCOUNTS.find((account) => account.role === parsed.role) ?? null;
  } catch {
    return null;
  }
}

function getSnapshot(): DemoSession | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (raw === cachedRaw) return cachedSession;
  cachedRaw = raw;
  cachedSession = read(raw);
  return cachedSession;
}

function getServerSnapshot(): DemoSession | null {
  return null;
}

function signIn(role: DemoRole) {
  const account = DEMO_ACCOUNTS.find((item) => item.role === role);
  if (!account) return;
  const raw = JSON.stringify(account);
  window.localStorage.setItem(SESSION_KEY, raw);
  cachedRaw = raw;
  cachedSession = account;
  emit();
}

function signOut() {
  window.localStorage.removeItem(SESSION_KEY);
  cachedRaw = null;
  cachedSession = null;
  emit();
}

export function SessionProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useSession() {
  const session = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { session, ready: true, signIn, signOut };
}

export function RoleGate({
  area,
  children,
}: {
  area: AppArea;
  children: ReactNode;
}) {
  const { session, ready } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = canAccess(session?.role ?? null, area);

  useEffect(() => {
    if (!ready || allowed) return;
    const next = encodeURIComponent(pathname);
    router.replace(`/sign-in?next=${next}`);
  }, [allowed, pathname, ready, router]);

  if (!ready || !allowed) {
    return (
      <div className="grid min-h-[50vh] place-items-center px-6 text-sm text-muted" role="status">
        Checking demo session
      </div>
    );
  }

  return children;
}

export function roleHome(role: DemoRole): string {
  return homePath(role);
}
