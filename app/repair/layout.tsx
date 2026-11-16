import { AppShell } from "@/components/dashboard/app-shell";
import type { ReactNode } from "react";

const links = [
  { href: "/repair", label: "Dashboard" },
  { href: "/repair/passports", label: "Passports" },
  { href: "/repair/passports/new", label: "New passport" },
  { href: "/repair/labels", label: "QR labels" },
];

export default function RepairLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell area="repair" links={links}>
      {children}
    </AppShell>
  );
}
