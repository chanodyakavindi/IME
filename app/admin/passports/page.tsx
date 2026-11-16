"use client";

import { PassportTable } from "@/components/dashboard/passport-table";
import { useStore } from "@/lib/data/store";

export default function AdminPassportsPage() {
  const { state } = useStore();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Passport activity</h1>
      <p className="mb-4 mt-1 text-sm text-muted">Sample records across participating centres.</p>
      <PassportTable rows={state.passports} hrefFor={(id) => `/passport/${id}`} />
    </div>
  );
}
