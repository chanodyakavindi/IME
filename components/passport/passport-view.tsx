"use client";

import { Logo } from "@/components/logo";
import { DownloadableQr, DemoQr } from "@/components/qr/demo-qr";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/data/store";
import { buildPublicView } from "@/lib/domain/public-view";
import { conditionRows } from "@/lib/domain/presentation";
import { DISCLAIMER, PARTNER_HISTORY_NOTE, PROTECTION_NOTE, SAMPLE_NOTE } from "@/lib/copy";
import { hashPrefix } from "@/lib/security/hash";
import { passportUrl } from "@/lib/qr/links";
import { correctionSchema, type CorrectionValues } from "@/lib/validation/schemas";
import { formatDate, formatDateTime } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrigin } from "@/lib/hooks/use-origin";
import { Copy, Download, Printer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function PassportView({ id }: { id: string }) {
  const { state, ready, sendCorrection, scan } = useStore();
  const origin = useOrigin();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [activeEvidence, setActiveEvidence] = useState<string | null>(null);
  const form = useForm<CorrectionValues>({
    resolver: zodResolver(correctionSchema),
    defaultValues: { issueType: "Condition summary", description: "", contact: "" },
  });

  useEffect(() => {
    if (!ready) return;
    const key = `fixproof.scan.${id}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
    scan(id, "qr", new Date().toISOString());
  }, [id, ready, scan]);

  if (!ready) {
    return <p className="px-4 py-16 text-sm text-muted" role="status">Loading passport…</p>;
  }

  const view = buildPublicView(state, id);
  if (!view.ok) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-2xl font-semibold text-navy">{view.reason === "not_published" ? "This passport is not public" : "Passport not found"}</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          {view.reason === "not_published"
            ? "The code matches a draft. Drafts stay off the public page until a partner publishes them."
            : "Check the code and try again. The example record is FP-DEMO-2026-0001."}
        </p>
        <Link href="/scan" className="mt-5 inline-flex text-sm font-semibold text-navy">Scan another passport</Link>
      </div>
    );
  }

  const url = passportUrl(view.passport.id, origin);
  const rows = view.inspection ? conditionRows(view.inspection) : [];
  const verified = view.passport.status === "verified";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Public link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  }

  function downloadQr() {
    const canvas = document.getElementById("passport-qr-canvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
      toast.error("QR code is not ready");
      return;
    }
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${view.ok ? view.passport.id : "passport"}.png`;
    link.click();
  }

  return (
    <div className="bg-canvas pb-16">
      <div className="no-print border-b border-line bg-white">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Logo />
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="navy">Passport</Badge>
            <Badge>Public view</Badge>
            <Link href="/scan" className="text-sm font-semibold text-navy">Scan another passport</Link>
          </div>
        </div>
      </div>
      <article className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">{SAMPLE_NOTE}</p>
        <section className="rounded-2xl border border-line bg-white p-5">
          <p className="text-sm font-semibold text-verified">{verified ? "FixProof Verified Record" : "Verified Passport Status"}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-navy">{view.passport.id}</h1>
            <StatusBadge status={view.passport.status} />
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <Item label="Record created" value={formatDate(view.passport.createdAt)} />
            <Item label="Last updated" value={formatDate(view.passport.updatedAt)} />
            <Item label="Partner" value={view.passport.partnerName} />
            <Item label="Record hash" value={hashPrefix(view.passport.recordHash)} />
          </dl>
          <Link href="/limitations" className="mt-4 inline-flex text-sm font-semibold text-navy">Verification limitations</Link>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-semibold text-navy">Device details</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <Item label="Brand" value={view.passport.brand} />
            <Item label="Model" value={view.passport.model} />
            <Item label="Identifier" value={view.identifier} />
            <Item label="Serial" value={view.serial} />
            <Item label="Battery health" value={view.passport.batteryHealth === null ? "Not recorded" : `${view.passport.batteryHealth}%`} />
            <Item label="Inspection date" value={formatDate(view.passport.inspectionDate)} />
            <Item label="Inspection partner" value={view.passport.partnerName} />
            <Item label="Technician" value={view.passport.technicianName} />
          </dl>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-semibold text-navy">Condition summary</h2>
          <ul className="mt-4 space-y-2">
            {rows.map((row) => (
              <li key={row.label} className="flex flex-col gap-1 rounded-lg bg-canvas px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="text-muted">{row.label}</span>
                <Badge tone={row.tone}>{row.value}</Badge>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-5 text-muted">Not observed means it was not seen during this inspection. It does not prove that exposure was impossible.</p>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-semibold text-navy">Repair timeline</h2>
          {view.repairs.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No public repair events have been recorded.</p>
          ) : (
            <ol className="mt-4 space-y-4 border-l border-line pl-4">
              {view.repairs.map((event) => (
                <li key={event.id}>
                  <p className="text-xs text-muted">{formatDateTime(event.createdAt)}</p>
                  <p className="font-semibold text-navy">{event.eventType}</p>
                  <p className="text-sm text-muted">{event.partnerName} · {event.technicianName}</p>
                  <p className="mt-1 text-sm text-ink">{event.summary}</p>
                  <p className="mt-1 text-xs text-muted">{event.evidenceCount} evidence item{event.evidenceCount === 1 ? "" : "s"} · Hash {hashPrefix(event.recordHash)}</p>
                  <button type="button" className="mt-1 text-sm font-semibold text-navy" onClick={() => setActiveEvidence(event.id)}>
                    View evidence
                  </button>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-4 text-xs leading-5 text-muted">{PARTNER_HISTORY_NOTE}</p>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5" id="evidence">
          <h2 className="font-semibold text-navy">Evidence</h2>
          {view.evidence.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-line p-6 text-sm text-muted">
              No evidence files are attached to this passport.
            </div>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {view.evidence
                .filter((item) => !activeEvidence || item.repairEventId === activeEvidence || activeEvidence === "all")
                .map((item) => (
                  <li key={item.id} className="overflow-hidden rounded-xl border border-line">
                    <EvidenceThumb label={item.label} kind={item.kind} preview={item.previewDataUrl} />
                    <div className="p-3">
                      <p className="text-sm font-medium text-navy">{item.label}</p>
                      <p className="text-xs text-muted">{item.fictional ? "Sample evidence" : "Local preview"}</p>
                    </div>
                  </li>
                ))}
            </ul>
          )}
          {activeEvidence ? (
            <button type="button" className="mt-3 text-sm font-semibold text-navy" onClick={() => setActiveEvidence(null)}>
              Show all evidence
            </button>
          ) : null}
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-ink">
          <h2 className="font-semibold text-navy">Limitations</h2>
          <p className="mt-2">{DISCLAIMER}</p>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-semibold text-navy">How this record is protected</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{PROTECTION_NOTE}</p>
          <p className="mt-2 text-xs text-muted">Latest hash prefix {hashPrefix(view.passport.recordHash)}. Previous hash prefix {hashPrefix(view.passport.previousHash)}.</p>
        </section>

        <section className="print-sheet rounded-2xl border border-line bg-white p-5">
          <h2 className="font-semibold text-navy">QR label</h2>
          <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <DemoQr value={url} size={148} />
            <div className="hidden">
              <DownloadableQr value={url} canvasId="passport-qr-canvas" />
            </div>
            <div>
              <p className="font-medium text-navy">{view.passport.id}</p>
              <p className="text-sm text-muted">{view.passport.brand} {view.passport.model}</p>
              <p className="text-sm text-muted">Identifier {view.identifier}</p>
              <div className="no-print mt-3 flex flex-wrap gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => void copyLink()}><Copy className="h-4 w-4" aria-hidden />Copy link</Button>
                <Button type="button" variant="secondary" size="sm" onClick={downloadQr}><Download className="h-4 w-4" aria-hidden />Download QR</Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden />Print passport label</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="no-print rounded-2xl border border-line bg-white p-5">
          <h2 className="font-semibold text-navy">Report an issue</h2>
          {sent ? (
            <p className="mt-3 text-sm text-teal-900" role="status">Your concern was saved in this browser. It does not change the original inspection by itself.</p>
          ) : (
            <form
              className="mt-4 space-y-3"
              onSubmit={form.handleSubmit(async (values) => {
                setBusy(true);
                await new Promise((resolve) => setTimeout(resolve, 300));
                sendCorrection({
                  passportId: view.passport.id,
                  issueType: values.issueType,
                  description: values.description,
                  contact: values.contact,
                  source: "buyer",
                  actor: { id: "public", name: "Public buyer", organisationId: null },
                  now: new Date().toISOString(),
                });
                setBusy(false);
                setSent(true);
              })}
            >
              <label className="block text-sm font-medium">Issue type
                <select className="field mt-1" {...form.register("issueType")}>
                  <option>Condition summary</option>
                  <option>Evidence</option>
                  <option>Partner details</option>
                  <option>Other concern</option>
                </select>
              </label>
              <label className="block text-sm font-medium">Description
                <textarea className="field mt-1 min-h-24" {...form.register("description")} />
              </label>
              {form.formState.errors.description ? <p className="text-xs text-red-700">{form.formState.errors.description.message}</p> : null}
              <label className="block text-sm font-medium">Optional contact
                <input className="field mt-1" {...form.register("contact")} placeholder="Name or email, if you want a follow-up" />
              </label>
              <Button type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit concern"}</Button>
            </form>
          )}
        </section>
      </article>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-medium text-navy">{value}</dd>
    </div>
  );
}

function EvidenceThumb({ label, kind, preview }: { label: string; kind: string; preview?: string }) {
  if (preview) {
    return <Image src={preview} alt={label} width={320} height={112} unoptimized className="h-28 w-full object-cover" />;
  }
  const hue = kind === "invoice" ? "bg-amber-100" : kind === "screenshot" ? "bg-teal-50" : "bg-slate-100";
  return (
    <div className={`grid h-28 place-items-center px-3 text-center text-xs font-medium text-navy ${hue}`}>
      Example {kind}
    </div>
  );
}
