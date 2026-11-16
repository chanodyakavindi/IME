import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/page-hero";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Privacy notice"
        title="Public records stay masked"
        lede="This platform is built so a public passport does not reveal a full IMEI, a full serial number, an owner identity or payment details."
      />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-14 text-sm leading-7 text-ink sm:px-6">
        <p>Device identity on the platform is limited to brand, model and the last four digits of an identifier. Consent is required before a technician publishes a passport.</p>
        <p>Buyer concern forms may include an optional contact note. That note is stored in this browser and is not shown on the public passport.</p>
        <p>Sign-in does not use passwords. Do not enter real credentials, card numbers or customer identity documents.</p>
        <p>Partner requests are saved locally and are not emailed. Evidence uploads remain local previews unless a future production system moves them to access-controlled storage.</p>
        <p>Partner records, technician details and device identifiers in the seeded record are fictional.</p>
      </div>
    </MarketingShell>
  );
}
