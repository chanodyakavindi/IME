"use client";

import { SessionProvider } from "@/lib/auth/session";
import { StoreProvider } from "@/lib/data/store";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <SessionProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow"
        >
          Skip to content
        </a>
        {children}
        <Toaster position="top-center" />
      </SessionProvider>
    </StoreProvider>
  );
}
