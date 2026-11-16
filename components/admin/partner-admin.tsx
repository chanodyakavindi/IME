"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/session";
import { useStore } from "@/lib/data/store";
import { useState } from "react";
import { toast } from "sonner";

export function PartnerAdmin() {
  const { session } = useSession();
  const { state, suspend, decideApplication, resetDemo } = useStore();
  const [pendingSuspend, setPendingSuspend] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-navy">Partners</h1>
        <Button type="button" variant="secondary" onClick={() => { resetDemo(); toast.success("Data reset"); }}>Reset data</Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-3">Partner</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Location</th>
              <th className="px-3 py-3">Verification</th>
              <th className="px-3 py-3">Subscription</th>
              <th className="px-3 py-3">Passports</th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {state.organisations.map((org) => (
              <tr key={org.id} className="border-b border-line last:border-0">
                <td className="px-3 py-3 font-medium text-navy">{org.name}</td>
                <td className="px-3 py-3">{org.type === "repair_centre" ? "Repair centre" : "Dealer"}</td>
                <td className="px-3 py-3">{org.location}</td>
                <td className="px-3 py-3">{org.status}</td>
                <td className="px-3 py-3">{org.subscriptionStatus} · {org.planId}</td>
                <td className="px-3 py-3">{state.passports.filter((item) => item.organisationId === org.id).length}</td>
                <td className="px-3 py-3">
                  {org.status === "suspended" ? "Suspended" : (
                    <button type="button" className="font-semibold text-red-700" onClick={() => setPendingSuspend(org.id)}>Suspend</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="font-semibold text-navy">Partner applications</h2>
        <ul className="mt-3 space-y-3">
          {state.applications.map((application) => (
            <li key={application.id} className="rounded-lg bg-canvas p-3 text-sm">
              <p className="font-medium text-navy">{application.organisationName} · {application.status}</p>
              <p className="text-muted">{application.location} · {application.email}</p>
              <p className="mt-1">{application.message}</p>
              {application.status === "pending" ? (
                <div className="mt-2 flex gap-2">
                  <Button size="sm" type="button" onClick={() => { decideApplication(application.id, "approved", new Date().toISOString()); toast.success("Application approved"); }}>Approve</Button>
                  <Button size="sm" variant="secondary" type="button" onClick={() => { decideApplication(application.id, "rejected", new Date().toISOString()); toast.success("Application rejected"); }}>Reject</Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
      {pendingSuspend ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-5">
            <h2 className="font-semibold text-navy">Suspend this partner?</h2>
            <p className="mt-2 text-sm text-muted">Published passports from this partner will show a suspended status. Existing audit events stay in place.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={() => setPendingSuspend(null)}>Cancel</Button>
              <Button
                variant="danger"
                type="button"
                disabled={busy}
                onClick={async () => {
                  if (!session) return;
                  setBusy(true);
                  await new Promise((resolve) => setTimeout(resolve, 300));
                  suspend(pendingSuspend, { id: session.userId, name: session.name, organisationId: null }, new Date().toISOString());
                  setBusy(false);
                  setPendingSuspend(null);
                  toast.success("Partner suspended");
                }}
              >
                {busy ? "Suspending…" : "Confirm suspension"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
