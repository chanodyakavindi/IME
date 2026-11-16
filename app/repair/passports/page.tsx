"use client";

import { PassportTable } from "@/components/dashboard/passport-table";
import { useSession } from "@/lib/auth/session";
import { useStore } from "@/lib/data/store";

export default function RepairPassportsPage() {
  const { session } = useSession();
  const { state } = useStore();
  const rows = state.passports.filter((item) => item.organisationId === session?.organisationId);
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Passports</h1>
      <p className="mb-4 mt-1 text-sm text-muted">Current records, plus any passports created in this browser.</p>
      <PassportTable rows={rows} hrefFor={(id) => `/repair/passports/${id}`} />
    </div>
  );
}
