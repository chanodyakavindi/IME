import { AppShell } from "@/components/dashboard/app-shell";
import type { ReactNode } from "react";

export default function DealerLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell area="dealer" links={[{ href: "/dealer", label: "Inventory" }]}>
      {children}
    </AppShell>
  );
}
