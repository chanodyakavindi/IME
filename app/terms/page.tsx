import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { DISCLAIMER } from "@/lib/copy";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Terms"
        title="Terms of use"
        lede="These terms describe how the service is used. They are intended for a trusted partner and buyer environment."
      />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-14 text-sm leading-7 text-ink sm:px-6">
        <p>{DISCLAIMER}</p>
        <p>Partners are responsible for the accuracy of information they submit. Buyers remain responsible for their own purchase decision.</p>
        <p>Planning prices shown in Sri Lankan Rupees are assumptions for discussion. The platform does not take payment.</p>
        <p>Corrections follow the <Link href="/limitations" className="font-semibold text-navy">correction policy</Link>. Audit history is append-only within the platform.</p>
        <p>You may not use the platform to store real customer identity, full device identifiers or payment-card data.</p>
      </div>
    </MarketingShell>
  );
}
