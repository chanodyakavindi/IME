"use client";

import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/data/store";
import { partnerRequestSchema, type PartnerRequestValues } from "@/lib/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";

export function PartnerRequestForm({ source = "partner-application" }: { source?: string }) {
  const { saveRequest } = useStore();
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const form = useForm<PartnerRequestValues>({
    resolver: zodResolver(partnerRequestSchema),
    defaultValues: {
      organisationName: "",
      partnerType: "repair_centre",
      location: "",
      contactName: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setBusy(true);
    await wait(400);
    saveRequest({ ...values, source }, new Date().toISOString());
    setBusy(false);
    setDone(true);
  });

  if (done) {
    return (
      <div className="rounded-xl border border-teal-200 bg-teal-50 p-5" role="status">
        <h2 className="font-semibold text-navy">Request saved on this device</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          This request is stored locally and does not send email. A member of the team will follow up directly.
        </p>
        <Button className="mt-4" variant="secondary" onClick={() => { setDone(false); form.reset(); }}>
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Organisation" error={form.formState.errors.organisationName?.message}>
        <input className="field" {...form.register("organisationName")} />
      </Field>
      <Field label="Partner type" error={form.formState.errors.partnerType?.message}>
        <select className="field" {...form.register("partnerType")}>
          <option value="repair_centre">Repair centre</option>
          <option value="dealer">Used-phone dealer</option>
          <option value="enterprise">Enterprise (planned package)</option>
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City or area" error={form.formState.errors.location?.message}>
          <input className="field" {...form.register("location")} />
        </Field>
        <Field label="Contact name" error={form.formState.errors.contactName?.message}>
          <input className="field" {...form.register("contactName")} />
        </Field>
      </div>
      <Field label="Work email" error={form.formState.errors.email?.message}>
        <input className="field" type="email" autoComplete="email" {...form.register("email")} />
      </Field>
      <Field label="What should we walk through?" error={form.formState.errors.message?.message}>
        <textarea className="field min-h-28" {...form.register("message")} />
      </Field>
      <p className="text-xs leading-5 text-muted">No message is emailed. Do not enter payment details or a customer IMEI.</p>
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Request a Partnership"}</Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-navy">
      {label}
      <div className="mt-1.5">{children}</div>
      {error ? <span className="mt-1 block text-xs font-medium text-red-700">{error}</span> : null}
    </label>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
