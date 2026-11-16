"use client";

import { DemoQr } from "@/components/qr/demo-qr";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/session";
import { DISCLAIMER, STORAGE_NOTE } from "@/lib/copy";
import { useStore } from "@/lib/data/store";
import { checklistLabel, conditionRows, partLabel, waterLabel } from "@/lib/domain/presentation";
import { passportUrl } from "@/lib/qr/links";
import { identitySchema, inspectionSchema, passportDraftSchema } from "@/lib/validation/schemas";
import type { ChecklistState, EvidenceDraft, EvidenceKind, Inspection, PartOrigin, PassportDraftInput, WaterObservation } from "@/types";
import Link from "next/link";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

const STEPS = ["Device identity", "Inspection checklist", "Evidence", "Review and publish"];
const CHECKS: ChecklistState[] = ["passed", "needs_attention", "not_tested", "not_recorded"];
const PARTS: PartOrigin[] = ["original", "replaced", "unknown"];

type FormValues = Omit<PassportDraftInput, "consent" | "evidence"> & { consent: boolean };

const defaults: FormValues = {
  brand: "Apple",
  model: "",
  category: "Smartphone",
  identifierLast4: "",
  serialLast4: "",
  sourceNote: "",
  consent: false,
  screenTest: "not_recorded",
  screenPart: "unknown",
  batteryHealth: null,
  batteryStatus: "unknown",
  batteryReplacedLabel: "",
  cameraTest: "not_recorded",
  cameraPart: "unknown",
  speakerMic: "not_recorded",
  chargingPortTest: "not_recorded",
  chargingPortPart: "unknown",
  biometric: "not_recorded",
  network: "not_recorded",
  waterDamage: "not_recorded",
  exterior: "",
  accessories: "",
  notes: "",
};

export function NewPassportForm() {
  const { session } = useSession();
  const { publishPassport, saveDraft } = useStore();
  const [step, setStep] = useState(0);
  const [evidence, setEvidence] = useState<EvidenceDraft[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [publishedId, setPublishedId] = useState("");
  const [origin, setOrigin] = useState("http://localhost:3000");
  const form = useForm<FormValues>({ defaultValues: defaults });

  if (!session) return null;
  const actor = {
    id: session.userId,
    name: session.name,
    organisationId: session.organisationId,
  };

  async function nextStep() {
    setError("");
    if (step === 0) {
      const parsed = identitySchema.safeParse({ ...form.getValues(), consent: form.getValues("consent") ? true : false });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Check the device details.");
        return;
      }
    }
    if (step === 1) {
      const parsed = inspectionSchema.safeParse(form.getValues());
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Check the inspection fields.");
        return;
      }
    }
    setStep((value) => Math.min(value + 1, STEPS.length - 1));
  }

  function payload(): PassportDraftInput {
    const values = form.getValues();
    const health = values.batteryHealth;
    return {
      ...values,
      consent: true,
      batteryHealth: health === null || Number.isNaN(Number(health)) ? null : Number(health),
      evidence,
    };
  }

  async function publish() {
    setBusy(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 400));
    const parsed = passportDraftSchema.safeParse(payload());
    if (!parsed.success) {
      setBusy(false);
      setConfirming(false);
      setError(parsed.error.issues[0]?.message ?? "The passport is incomplete.");
      return;
    }
    try {
      setOrigin(window.location.origin);
      const result = publishPassport(payload(), actor, new Date().toISOString());
      setPublishedId(result.passportId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not publish the passport.");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  if (publishedId) {
    const url = passportUrl(publishedId, origin);
    return (
      <section className="rounded-xl border border-teal-200 bg-white p-6" role="status">
        <p className="text-sm font-semibold text-verified">Passport published</p>
        <h2 className="mt-2 text-2xl font-semibold text-navy">{publishedId}</h2>
        <p className="mt-2 text-sm text-muted">The public page is live in this browser. A QR label is ready to print or download from the passport.</p>
        <div className="mt-4"><DemoQr value={url} size={148} /></div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/passport/${publishedId}`} className="text-sm font-semibold text-navy">Open public passport</Link>
          <Link href={`/repair/passports/${publishedId}`} className="text-sm font-semibold text-navy">Review audit history</Link>
          <button type="button" className="text-sm font-semibold text-navy" onClick={() => window.print()}>Print QR label</button>
        </div>
      </section>
    );
  }

  const values = form.getValues();

  return (
    <div>
      <ol className="mb-6 grid gap-2 sm:grid-cols-4" aria-label="Progress">
        {STEPS.map((label, index) => (
          <li key={label} className={`rounded-lg px-3 py-2 text-sm ${index === step ? "bg-navy text-white" : index < step ? "bg-teal-50 text-teal-900" : "bg-white text-muted ring-1 ring-line"}`}>
            <span className="font-semibold">{index + 1}.</span> {label}
          </li>
        ))}
      </ol>
      {error ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{error}</p> : null}
      {step === 0 ? (
        <div className="grid gap-4 rounded-xl border border-line bg-white p-5">
          <label className="text-sm font-medium">Brand
            <select className="field mt-1" {...form.register("brand")}>
              {["Apple", "Samsung", "Google", "Xiaomi", "Oppo", "Vivo", "Other"].map((brand) => <option key={brand}>{brand}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">Model<input className="field mt-1" {...form.register("model")} /></label>
          <label className="text-sm font-medium">Device category
            <select className="field mt-1" {...form.register("category")}>
              <option>Smartphone</option>
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Last four identifier digits<input className="field mt-1" inputMode="numeric" maxLength={4} {...form.register("identifierLast4")} /></label>
            <label className="text-sm font-medium">Last four serial digits<input className="field mt-1" inputMode="numeric" maxLength={4} {...form.register("serialLast4")} /></label>
          </div>
          <p className="text-xs text-muted">Do not enter a full IMEI or serial number.</p>
          <label className="text-sm font-medium">Purchase or source note<textarea className="field mt-1 min-h-20" {...form.register("sourceNote")} /></label>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" {...form.register("consent")} />
            <span>I confirm this record uses only a masked device identifier, contains no owner identity, and may be shown on a public passport after publishing.</span>
          </label>
          <FieldErrors names={["brand", "model", "identifierLast4", "serialLast4", "sourceNote", "consent"]} form={form} />
        </div>
      ) : null}
      {step === 1 ? (
        <div className="space-y-4 rounded-xl border border-line bg-white p-5">
          <Choice name="screenTest" legend="Screen condition" options={CHECKS} form={form} />
          <Choice name="screenPart" legend="Screen part" options={PARTS} form={form} />
          <label className="block text-sm font-medium">Battery health %
            <input className="field mt-1" type="number" min={0} max={100} {...form.register("batteryHealth", { setValueAs: (value) => (value === "" || value === null ? null : Number(value)) })} />
          </label>
          <Choice name="batteryStatus" legend="Battery status" options={PARTS} form={form} />
          <label className="block text-sm font-medium">Replacement timing, if replaced<input className="field mt-1" {...form.register("batteryReplacedLabel")} placeholder="August 2026" /></label>
          <Choice name="cameraTest" legend="Camera test" options={CHECKS} form={form} />
          <Choice name="cameraPart" legend="Camera part" options={PARTS} form={form} />
          <Choice name="speakerMic" legend="Speaker and microphone" options={CHECKS} form={form} />
          <Choice name="chargingPortTest" legend="Charging-port test" options={CHECKS} form={form} />
          <Choice name="chargingPortPart" legend="Charging-port part" options={PARTS} form={form} />
          <Choice name="biometric" legend="Biometric test" options={CHECKS} form={form} />
          <Choice name="network" legend="Network and SIM test" options={CHECKS} form={form} />
          <Choice name="waterDamage" legend="Water-damage observation" options={["not_observed", "observed", "not_tested", "not_recorded"]} form={form} />
          <label className="block text-sm font-medium">Exterior condition<input className="field mt-1" {...form.register("exterior")} /></label>
          <label className="block text-sm font-medium">Accessories included<input className="field mt-1" {...form.register("accessories")} /></label>
          <label className="block text-sm font-medium">Inspector notes<textarea className="field mt-1 min-h-24" {...form.register("notes")} /></label>
        </div>
      ) : null}
      {step === 2 ? (
        <div className="rounded-xl border border-line bg-white p-5">
          <p className="text-sm text-muted">{STORAGE_NOTE}</p>
          <input
            className="mt-4 block text-sm"
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []).slice(0, 8);
              void Promise.all(files.map(readEvidence)).then((items) => setEvidence(items));
            }}
          />
          {evidence.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-line p-4 text-sm text-muted">No files selected. You can still publish, and the public page will show an empty evidence state.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {evidence.map((item) => <li key={item.label} className="rounded-lg bg-canvas px-3 py-2">{item.label} · {item.kind}</li>)}
            </ul>
          )}
        </div>
      ) : null}
      {step === 3 ? (
        <div className="space-y-4 rounded-xl border border-line bg-white p-5">
          <h2 className="font-semibold text-navy">{values.brand} {values.model || "Unnamed model"}</h2>
          <p className="text-sm text-muted">Identifier ••••••••{values.identifierLast4 || "----"} · Evidence files {evidence.length}</p>
          <ul className="space-y-1 text-sm">
            {conditionRows(previewInspection(values)).slice(0, 6).map((row) => (
              <li key={row.label}>{row.label}: {row.value}</li>
            ))}
          </ul>
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-950">{DISCLAIMER}</p>
          <p className="text-sm text-muted">Public view will show the partner name, masked identifier and this checklist. Owner identity is not included.</p>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {step > 0 ? <Button type="button" variant="secondary" onClick={() => setStep((value) => value - 1)}>Back</Button> : null}
        {step < 3 ? <Button type="button" onClick={() => void nextStep()}>Continue</Button> : null}
        {step === 3 ? (
          <>
            <Button type="button" variant="secondary" onClick={() => {
              try {
                const id = saveDraft(payload(), actor, new Date().toISOString()).passportId;
                setError("");
                setPublishedId("");
                toast.success(`Draft ${id} saved in this browser.`);
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : "Could not save the draft.");
              }
            }}>Save draft</Button>
            <Button type="button" onClick={() => setConfirming(true)}>Publish passport</Button>
          </>
        ) : null}
      </div>
      {confirming ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/40 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="publish-title" className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h2 id="publish-title" className="text-lg font-semibold text-navy">Publish this passport?</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Publishing makes the masked record public and adds an audit event. It does not certify ownership or future performance.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setConfirming(false)}>Cancel</Button>
              <Button type="button" onClick={() => void publish()} disabled={busy}>{busy ? "Publishing…" : "Confirm and publish"}</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FieldErrors({ names, form }: { names: (keyof FormValues)[]; form: UseFormReturn<FormValues> }) {
  return (
    <ul className="text-xs text-red-700">
      {names.map((name) => {
        const message = form.formState.errors[name]?.message;
        return message ? <li key={name}>{String(message)}</li> : null;
      })}
    </ul>
  );
}

function Choice<T extends string>({
  name,
  legend,
  options,
  form,
}: {
  name: keyof FormValues;
  legend: string;
  options: readonly T[];
  form: UseFormReturn<FormValues>;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-navy">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm">
            <input type="radio" value={option} {...form.register(name)} />
            {labelFor(option)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function labelFor(option: string): string {
  if (option === "not_observed" || option === "observed" || option === "not_tested" || option === "not_recorded" || option === "passed" || option === "needs_attention") {
    if (option === "not_observed" || option === "observed") return waterLabel(option);
    return checklistLabel(option as ChecklistState);
  }
  return partLabel(option as PartOrigin);
}

function previewInspection(values: FormValues): Inspection {
  return {
    id: "preview",
    passportId: "preview",
    organisationId: "preview",
    createdAt: "",
    updatedAt: "",
    status: "draft",
    visibility: "internal",
    createdBy: "preview",
    screenTest: values.screenTest,
    screenPart: values.screenPart,
    batteryHealth: values.batteryHealth,
    batteryStatus: values.batteryStatus,
    batteryReplacedLabel: values.batteryReplacedLabel,
    cameraTest: values.cameraTest,
    cameraPart: values.cameraPart,
    speakerMic: values.speakerMic,
    chargingPortTest: values.chargingPortTest,
    chargingPortPart: values.chargingPortPart,
    biometric: values.biometric,
    network: values.network,
    waterDamage: values.waterDamage as WaterObservation,
    exterior: values.exterior || "Not recorded",
    accessories: values.accessories || "Not recorded",
    notes: values.notes,
  };
}

async function readEvidence(file: File): Promise<EvidenceDraft> {
  const kind: EvidenceKind = file.type === "application/pdf" ? "document" : file.name.toLowerCase().includes("battery") ? "screenshot" : "photo";
  let previewDataUrl: string | undefined;
  if (file.type.startsWith("image/") && file.size < 400_000) {
    previewDataUrl = await file.arrayBuffer().then((buffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      bytes.forEach((value) => {
        binary += String.fromCharCode(value);
      });
      return `data:${file.type};base64,${btoa(binary)}`;
    });
  }
  return { label: file.name, kind, note: "Local preview stored in this browser.", previewDataUrl };
}
