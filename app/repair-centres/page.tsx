import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { buttonClass } from "@/components/ui/button";
import { formatLkr } from "@/lib/utils";
import { PASSPORT_FEE_LKR, REPAIR_MONTHLY_LKR } from "@/lib/pricing";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "For Repair Centres" };

export default function RepairCentresPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Repair centres"
        title="Make repair evidence portable"
        lede="Keep the inspection, parts notes and photos with the device, then hand the buyer a QR code instead of a chat screenshot."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2">
        {[
          ["Guided checklist", "Screen, battery, camera, charging, biometrics, network and water-damage observations, including not tested and not recorded."],
          ["Evidence timeline", "Each published inspection and later repair event stays in order, with a record hash."],
          ["QR labels", "Generate, download and print a label that opens the public passport."],
          ["Corrections", "If something needs to change, request a correction. The original event remains in the audit history."],
        ].map(([title, text]) => (
          <article key={title} className="rounded-xl border border-line p-5">
            <h2 className="font-semibold text-navy">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </article>
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <p className="text-sm text-muted">Planning price: {formatLkr(REPAIR_MONTHLY_LKR)} per centre per month, plus {formatLkr(PASSPORT_FEE_LKR)} per passport or inspection.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/sign-in" className={buttonClass("primary")}>Open the repair workspace</Link>
          <Link href="/partner-application" className={buttonClass("secondary")}>Become a Partner</Link>
        </div>
      </div>
    </MarketingShell>
  );
}
