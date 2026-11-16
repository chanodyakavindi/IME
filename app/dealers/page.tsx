import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { buttonClass } from "@/components/ui/button";
import { DEALER_MONTHLY_LKR } from "@/lib/pricing";
import { formatLkr } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "For Dealers" };

export default function DealersPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Used-phone dealers"
        title="Sell with confidence"
        lede="Show the passport status beside a listing, copy the public link, and ask a centre for an updated inspection when the record is thin."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3">
        {[
          ["Inventory with status", "Mark a device available, reserved, sold or archived without turning FixProof into a checkout."],
          ["Passport links", "Link a published passport and see inspection date plus evidence completeness."],
          ["Buyer sharing", "Copy the public URL. The buyer does not need an account to read it."],
        ].map(([title, text]) => (
          <article key={title} className="rounded-xl border border-line p-5">
            <h2 className="font-semibold text-navy">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </article>
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <p className="text-sm text-muted">Planning price: {formatLkr(DEALER_MONTHLY_LKR)} per dealer per month.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/sign-in" className={buttonClass("primary")}>Open the dealer workspace</Link>
          <Link href="/pricing" className={buttonClass("secondary")}>Compare plans</Link>
        </div>
      </div>
    </MarketingShell>
  );
}
