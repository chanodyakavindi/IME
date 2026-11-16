"use client";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/session";
import { useStore } from "@/lib/data/store";
import { hashPrefix } from "@/lib/security/hash";
import { verifyAuditChain } from "@/lib/security/chain";
import { formatDateTime } from "@/lib/utils";
import { repairEventSchema } from "@/lib/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export function PassportManage({ id }: { id: string }) {
  const { session } = useSession();
  const { state, addRepair, sendCorrection } = useStore();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const passport = state.passports.find((item) => item.id === id);
  const form = useForm<z.infer<typeof repairEventSchema>>({
    resolver: zodResolver(repairEventSchema),
    defaultValues: { eventType: "Repair note", summary: "", partNote: "" },
  });

  if (!passport || passport.organisationId !== session?.organisationId) {
    return <p className="text-sm text-muted">That passport is not in this repair-centre workspace.</p>;
  }
  const audits = state.audits.filter((item) => item.passportId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const repairs = state.repairs.filter((item) => item.passportId === id);
  const intact = verifyAuditChain(audits);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">{passport.brand} {passport.model}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold text-navy">{passport.id}</h1>
          <StatusBadge status={passport.status} />
        </div>
        <p className="mt-2 text-sm text-muted">Chain check: {intact ? "Hashes link to the previous event" : "Review required"} · {hashPrefix(passport.recordHash)}</p>
        {passport.visibility === "public" ? <Link className="mt-2 inline-flex text-sm font-semibold" href={`/passport/${passport.id}`}>Open public view</Link> : <p className="mt-2 text-sm text-muted">Drafts are not on the public page.</p>}
      </div>
      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="font-semibold text-navy">Audit history</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {audits.map((event) => (
            <li key={event.id} className="border-b border-line pb-3 last:border-0">
              <p className="font-medium text-navy">{event.action}</p>
              <p className="text-muted">{formatDateTime(event.createdAt)} · {event.userName}</p>
              <p>{event.summary}</p>
              <p className="text-xs text-muted">Previous {hashPrefix(event.previousHash)} · New {hashPrefix(event.recordHash)}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="font-semibold text-navy">Add a repair event</h2>
        <form
          className="mt-3 space-y-3"
          onSubmit={form.handleSubmit(async (values) => {
            setBusy(true);
            await new Promise((resolve) => setTimeout(resolve, 250));
            addRepair({
              passportId: passport.id,
              eventType: values.eventType,
              summary: `${values.summary}${values.partNote ? ` Parts: ${values.partNote}.` : ""}`,
              actor: { id: session.userId, name: session.name, organisationId: session.organisationId },
              now: new Date().toISOString(),
            });
            setBusy(false);
            form.reset();
            toast.success("Repair event added to the audit timeline");
          })}
        >
          <input className="field" {...form.register("eventType")} />
          <textarea className="field min-h-20" placeholder="What was recorded?" {...form.register("summary")} />
          <input className="field" placeholder="Parts: original, replaced or unknown" {...form.register("partNote")} />
          {form.formState.errors.summary ? <p className="text-xs text-red-700">{form.formState.errors.summary.message}</p> : null}
          <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Add repair event"}</Button>
        </form>
      </section>
      {passport.status !== "draft" ? (
        <section className="rounded-xl border border-line bg-white p-4">
          <h2 className="font-semibold text-navy">Request a correction</h2>
          <p className="mt-1 text-sm text-muted">This adds a new audit entry. It does not erase the {repairs.length} existing repair event{repairs.length === 1 ? "" : "s"}.</p>
          <form
            className="mt-3 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const description = String(data.get("description") ?? "");
              if (description.trim().length < 12) {
                setMessage("Describe the correction in a short sentence.");
                return;
              }
              sendCorrection({
                passportId: passport.id,
                issueType: "Partner correction",
                description,
                contact: "",
                source: "partner",
                actor: { id: session.userId, name: session.name, organisationId: session.organisationId },
                now: new Date().toISOString(),
              });
              setMessage("Correction request submitted.");
              event.currentTarget.reset();
            }}
          >
            <textarea name="description" className="field min-h-20" placeholder="What should be reviewed?" />
            {message ? <p className="text-sm text-muted" role="status">{message}</p> : null}
            <Button type="submit" variant="secondary">Submit correction request</Button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
