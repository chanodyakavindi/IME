import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/page-hero";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "How It Works" };

const steps = [
  ["Partner onboarding", "A repair centre or dealer applies, and FixProof reviews the organisation before a workspace is opened. Approval is a partner check, not a government licence."],
  ["Masked device identity", "The record stores brand, model and only the last four digits of an identifier. Full IMEI numbers, serial numbers and owner identity are not collected on the public record."],
  ["Inspection checklist", "The technician records screen, battery, camera, audio, charging, biometric, network, water-damage observation and exterior condition. Each item can be passed, needs attention, not tested or not recorded."],
  ["Evidence upload", "Photos, inspection notes and invoice references can be attached. These records stay in the browser unless a secure production system handles them."],
  ["Review and verification", "The technician reviews the public preview, confirms consent, and publishes. Publication creates an append-only audit event."],
  ["Passport publication", "A passport ID, QR label and shortened record hash are created. The public page shows a FixProof Verified Record only after publication."],
  ["Buyer scan", "A buyer scans the QR code or enters the passport code. No account is required. The page shows the available history and its limits."],
  ["Correction and audit", "A buyer or partner can report a concern. An administrator approves or rejects it as a new audit entry. Earlier events are not silently overwritten."],
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Process"
        title="From inspection bench to a record a buyer can open"
        lede="FixProof sits beside the existing sale. The centre records what it inspected, the dealer shares the passport, and the buyer reads it before purchase."
      />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ol className="relative space-y-4 border-l border-line pl-6">
          {steps.map(([title, text], index) => (
            <li key={title} className="rounded-xl border border-line bg-white p-5">
              <span className="absolute -left-[0.6rem] mt-1 h-4 w-4 rounded-full border-2 border-verified bg-white" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-wide text-verified">Step {index + 1}</p>
              <h2 className="mt-1 text-lg font-semibold text-navy">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </li>
          ))}
        </ol>
        <aside className="mt-10 rounded-xl bg-amber-50 p-5 text-sm leading-6 text-ink">
          A published passport is a record of available partner information. It is not proof of ownership, a safety certificate, or a promise of future performance.
        </aside>
      </div>
    </MarketingShell>
  );
}
