import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { PartnerRequestForm } from "@/components/forms/partner-request-form";
import { OPERATING_BASE } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Contact"
        title="Talk to the team"
        lede="Use the form for a partner request. It stays on this device. We do not publish personal phone numbers or personal email addresses."
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.7fr_1.3fr]">
        <address className="rounded-xl border border-line p-5 text-sm not-italic leading-6 text-ink">
          <p className="font-semibold text-navy">Proposed operating base</p>
          {OPERATING_BASE.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </address>
        <div className="rounded-xl border border-line p-5">
          <PartnerRequestForm source="contact" />
        </div>
      </div>
    </MarketingShell>
  );
}
