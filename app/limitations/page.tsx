import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { DISCLAIMER, PROTECTION_NOTE } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Limitations" };

export default function LimitationsPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Limits of a FixProof record"
        title="Read the record for what it contains"
        lede={DISCLAIMER}
      />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-14 text-sm leading-7 text-ink sm:px-6">
        <h2 className="text-xl font-semibold text-navy">FixProof does not claim to be</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>A government or TRCSL certification.</li>
          <li>An Apple, Samsung or other manufacturer certification.</li>
          <li>Proof of ownership or of who may sell the device.</li>
          <li>A guarantee that a device is safe or free of defects.</li>
          <li>A guarantee of future performance, battery life or resale value.</li>
          <li>A replacement for a professional inspection at the time of purchase.</li>
          <li>A blockchain product. This platform uses an append-only hash chain in the browser.</li>
        </ul>
        <h2 className="text-xl font-semibold text-navy">Wording</h2>
        <p>Published records may show FixProof Verified Record or Verified Passport Status. Those phrases mean a participating partner published the record. They do not mean the device itself is certified.</p>
        <h2 className="text-xl font-semibold text-navy">Not observed is not proof of absence</h2>
        <p>If water damage was not observed during an inspection, the record says that. It does not prove that exposure was impossible or that hidden damage is absent.</p>
        <h2 className="text-xl font-semibold text-navy">Correction policy</h2>
        <p>Buyers and partners can submit a correction or concern. An administrator can approve or reject it and must add an internal note. The decision is stored as a new audit event. Original inspection and repair events stay in the history.</p>
        <h2 className="text-xl font-semibold text-navy">How this record is protected</h2>
        <p>{PROTECTION_NOTE}</p>
      </div>
    </MarketingShell>
  );
}
