"use client";

import { TrendChart } from "@/components/dashboard/charts";
import { Panel, Stat } from "@/components/dashboard/stat";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/session";
import { useStore } from "@/lib/data/store";
import { evidenceCompleteness } from "@/lib/domain/presentation";
import { scanTrend, scansThisMonth } from "@/lib/domain/metrics";
import { passportUrl } from "@/lib/qr/links";
import { inventorySchema, type InventoryValues } from "@/lib/validation/schemas";
import { formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { InventoryStatus } from "@/types";

export function DealerHome() {
  const { session } = useSession();
  const { state, addDevice, markDevice, linkDevice, requestInspection } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [linkFor, setLinkFor] = useState<string | null>(null);
  const [passportChoice, setPassportChoice] = useState("FP-DEMO-2026-0001");
  const [origin, setOrigin] = useState("");
  const form = useForm<InventoryValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: { brand: "Samsung", model: "", identifierLast4: "", listingTitle: "", passportId: "" },
  });

  const orgId = session?.organisationId;
  const items = state.inventory.filter((item) => item.organisationId === orgId);
  const linkedIds = items.map((item) => item.passportId).filter((id): id is string => Boolean(id));
  const scans = state.scans.filter((scan) => linkedIds.includes(scan.passportId));
  const verified = items.filter((item) => {
    const passport = state.passports.find((entry) => entry.id === item.passportId);
    return passport?.status === "verified";
  }).length;
  const pending = items.filter((item) => !item.passportId || item.inspectionRequested).length;
  const corrections = state.corrections.filter((item) => linkedIds.includes(item.passportId) && item.status === "open").length;
  if (!orgId || !session) return null;
  const filtered = items.filter((item) => {
    const haystack = `${item.brand} ${item.model} ${item.listingTitle}`.toLowerCase();
    if (query && !haystack.includes(query.toLowerCase())) return false;
    if (status !== "all" && item.status !== status) return false;
    return true;
  });

  async function copy(id: string) {
    const url = passportUrl(id, origin || window.location.origin);
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Public link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Dealer inventory</h1>
          <p className="text-sm text-muted">Current stock for {session.organisationName}. This is not a marketplace checkout.</p>
        </div>
        <Button type="button" onClick={() => { setOrigin(window.location.origin); setOpen(true); }}>Add device</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total inventory" value={String(items.length)} hint="Current stock" />
        <Stat label="Verified devices" value={String(verified)} hint="Current records" />
        <Stat label="Pending inspection" value={String(pending)} hint="Current queue" />
        <Stat label="Open corrections" value={String(corrections)} hint="Current issues" />
      </div>
      <Panel title="Monthly buyer scans">
        <p className="mb-2 text-xs text-muted">Scan activity · September count {scansThisMonth(scans)}</p>
        <TrendChart data={scanTrend(scans)} label="Scans" />
      </Panel>
      <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
        <input className="field" placeholder="Search brand, model or title" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="field" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          {(["available", "reserved", "sold", "archived"] as InventoryStatus[]).map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      {filtered.length === 0 ? <p className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-muted">No devices match this search.</p> : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-3">Listing</th>
                <th className="px-3 py-3">Passport</th>
                <th className="px-3 py-3">Inspection</th>
                <th className="px-3 py-3">Evidence</th>
                <th className="px-3 py-3">Stock</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const passport = state.passports.find((entry) => entry.id === item.passportId);
                return (
                  <tr key={item.id} className="border-b border-line last:border-0">
                    <td className="px-3 py-3">
                      <p className="font-medium text-navy">{item.listingTitle}</p>
                      <p className="text-xs text-muted">{item.brand} {item.model} · ••••••••{item.identifierLast4}</p>
                    </td>
                    <td className="px-3 py-3">{passport ? <StatusBadge status={passport.status} /> : <span className="text-muted">Not linked</span>}</td>
                    <td className="px-3 py-3">{item.inspectionDate ? formatDate(item.inspectionDate) : "Not recorded"}{item.inspectionRequested ? " · Update requested" : ""}</td>
                    <td className="px-3 py-3">{evidenceCompleteness(item.evidenceCount)}%</td>
                    <td className="px-3 py-3">
                      <select className="field" value={item.status} onChange={(event) => markDevice(item.id, event.target.value as InventoryStatus, new Date().toISOString())}>
                        {(["available", "reserved", "sold", "archived"] as InventoryStatus[]).map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col items-start gap-1">
                        {passport ? <button type="button" className="font-semibold text-navy" onClick={() => void copy(passport.id)}>Copy public link</button> : null}
                        {passport ? <Link className="font-semibold text-navy" href={`/passport/${passport.id}`}>View passport</Link> : null}
                        <button type="button" className="font-semibold text-navy" onClick={() => setLinkFor(item.id)}>Link passport</button>
                        <button type="button" className="font-semibold text-navy" onClick={() => { requestInspection(item.id, new Date().toISOString()); toast.success("Inspection update requested"); }}>Request inspection</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4">
          <form
            className="w-full max-w-md space-y-3 rounded-xl bg-white p-5"
            onSubmit={form.handleSubmit((values) => {
              addDevice({
                organisationId: orgId,
                brand: values.brand,
                model: values.model,
                identifierLast4: values.identifierLast4,
                listingTitle: values.listingTitle,
                passportId: values.passportId || null,
                now: new Date().toISOString(),
              });
              setOpen(false);
              form.reset();
              toast.success("Device added to the demo inventory");
            })}
          >
            <h2 className="text-lg font-semibold text-navy">Add a device</h2>
            <input className="field" placeholder="Brand" {...form.register("brand")} />
            <input className="field" placeholder="Model" {...form.register("model")} />
            <input className="field" placeholder="Last four digits" {...form.register("identifierLast4")} />
            <input className="field" placeholder="Listing title" {...form.register("listingTitle")} />
            <select className="field" {...form.register("passportId")}>
              <option value="">No passport yet</option>
              {state.passports.filter((item) => item.visibility === "public").map((item) => (
                <option key={item.id} value={item.id}>{item.id} · {item.model}</option>
              ))}
            </select>
            {form.formState.errors.identifierLast4 ? <p className="text-xs text-red-700">{form.formState.errors.identifierLast4.message}</p> : null}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save device</Button>
            </div>
          </form>
        </div>
      ) : null}
      {linkFor ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5">
            <h2 className="font-semibold text-navy">Link a passport to this listing</h2>
            <select className="field mt-3" value={passportChoice} onChange={(event) => setPassportChoice(event.target.value)}>
              {state.passports.filter((item) => item.visibility === "public").map((item) => (
                <option key={item.id} value={item.id}>{item.id}</option>
              ))}
            </select>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setLinkFor(null)}>Cancel</Button>
              <Button type="button" onClick={() => { linkDevice(linkFor, passportChoice, new Date().toISOString()); setLinkFor(null); toast.success("Passport linked"); }}>Link</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
