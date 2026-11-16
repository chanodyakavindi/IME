"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => undefined;
}

export function useOrigin(): string {
  return useSyncExternalStore(subscribe, () => window.location.origin, () => "http://localhost:3000");
}
