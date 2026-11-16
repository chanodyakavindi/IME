import { AppShell } from "@/components/dashboard/app-shell";
import type { ReactNode } from "react";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/corrections", label: "Corrections" },
  { href: "/admin/audit", label: "Audit log" },
  { href: "/admin/passports", label: "Passports" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell area="admin" links={links}>
      {children}
    </AppShell>
  );
}
