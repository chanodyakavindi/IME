import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { PartnerRequestForm } from "@/components/forms/partner-request-form";
import { PLAN_CATALOG, buyerAccessFee } from "@/lib/pricing";
import { formatLkr } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Planning assumption"
        title="Simple prices for centres and dealers"
        lede="Repair centres, dealers and refurbishers are the paying customers. Buyers open a passport for free. These figures are planning prices, not a live checkout."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-3">
        {PLAN_CATALOG.map((plan) => (
          <article key={plan.id} className="flex flex-col rounded-2xl border border-line p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">{plan.name}</h2>
              {plan.status === "planned" ? <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-review">Planned</span> : <span className="text-xs font-semibold text-verified">Available</span>}
            </div>
            <p className="mt-2 text-sm text-muted">{plan.audience}</p>
            <p className="mt-5 text-3xl font-semibold text-navy">{formatLkr(plan.monthlyLkr)}</p>
            <p className="text-sm text-muted">per partner per month</p>
            {plan.perPassportLkr ? <p className="mt-2 text-sm font-medium text-navy">{formatLkr(plan.perPassportLkr)} per device passport or inspection</p> : null}
            <ul className="mt-5 flex-1 space-y-2 text-sm text-ink">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2"><span aria-hidden className="text-verified">•</span>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <p className="rounded-xl bg-canvas p-5 text-sm text-ink">Buyer access: {formatLkr(buyerAccessFee())}. Scanning a passport does not require a subscription.</p>
      </div>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-semibold text-navy">Request a partnership</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Tell us which workflow you want to see. The form saves on this browser only.</p>
        </div>
        <div className="rounded-2xl border border-line p-5">
          <PartnerRequestForm source="pricing" />
        </div>
      </section>
    </MarketingShell>
  );
}
