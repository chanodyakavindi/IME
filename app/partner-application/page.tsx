import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { PartnerRequestForm } from "@/components/forms/partner-request-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Become a Partner" };

export default function PartnerApplicationPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Partners"
        title="Become a Partner"
        lede="Repair centres and used-phone dealers can request a walkthrough of the onboarding workflow."
      />
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <PartnerRequestForm source="partner-application" />
      </div>
    </MarketingShell>
  );
}
