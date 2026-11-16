"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/session";
import { useStore } from "@/lib/data/store";
import { reviewNoteSchema } from "@/lib/validation/schemas";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function CorrectionQueue() {
  const { session } = useSession();
  const { state, decideCorrection } = useStore();
  const [selected, setSelected] = useState(state.corrections.find((item) => item.status === "open")?.id ?? state.corrections[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const request = state.corrections.find((item) => item.id === selected);
  const passport = state.passports.find((item) => item.id === request?.passportId);

  async function decide(decision: "approved" | "rejected") {
    if (!session || !request) return;
    const parsed = reviewNoteSchema.safeParse({ note });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Add a note.");
      return;
    }
    setBusy(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      decideCorrection({
        requestId: request.id,
        decision,
        note: parsed.data.note,
        actor: { id: session.userId, name: session.name, organisationId: null },
        now: new Date().toISOString(),
      });
      toast.success(decision === "approved" ? "Correction approved as a new audit entry" : "Correction rejected");
      setNote("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update the request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-navy">Corrections</h1>
        {state.corrections.length === 0 ? <p className="text-sm text-muted">The queue is empty.</p> : state.corrections.map((item) => (
          <button key={item.id} type="button" onClick={() => setSelected(item.id)} className={`block w-full rounded-lg border px-3 py-2 text-left text-sm ${item.id === selected ? "border-navy bg-white" : "border-line bg-white"}`}>
            <span className="font-medium text-navy">{item.passportId}</span>
            <span className="mt-1 block text-xs uppercase text-muted">{item.status}</span>
          </button>
        ))}
      </div>
      {request && passport ? (
        <section className="rounded-xl border border-line bg-white p-5">
          <p className="text-sm text-muted">{request.issueType} · {request.source}</p>
          <h2 className="mt-1 text-xl font-semibold text-navy">{passport.brand} {passport.model}</h2>
          <p className="mt-3 text-sm leading-6">{request.description}</p>
          <p className="mt-2 text-xs text-muted">Contact: {request.contact || "Not provided"}</p>
          <Link className="mt-3 inline-flex text-sm font-semibold" href={`/passport/${passport.id}`}>Open affected passport</Link>
          {request.status === "open" ? (
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-medium">Internal note
                <textarea className="field mt-1 min-h-24" value={note} onChange={(event) => setNote(event.target.value)} />
              </label>
              {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
              <div className="flex gap-2">
                <Button type="button" disabled={busy} onClick={() => void decide("approved")}>{busy ? "Saving…" : "Approve correction"}</Button>
                <Button type="button" variant="secondary" disabled={busy} onClick={() => void decide("rejected")}>Reject correction</Button>
              </div>
            </div>
          ) : <p className="mt-4 text-sm text-muted">Internal note: {request.internalNote || "None"}</p>}
        </section>
      ) : <p className="text-sm text-muted">Select a request.</p>}
    </div>
  );
}
