import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { OPERATING_BASE, TEAM } from "@/lib/copy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="About FixProof"
        title="A trust layer for devices that already have a history"
        lede="FixProof is a Sri Lankan B2B2C trust platform. It does not sell phones. It helps repair centres and dealers publish a record that buyers can read."
      />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold text-navy">About the team</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {TEAM.map((person) => (
            <article key={person.name} className="rounded-xl border border-line p-5">
              <h3 className="text-lg font-semibold text-navy">{person.name}</h3>
              <p className="text-sm font-medium text-verified">{person.role}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{person.focus}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm leading-6 text-muted">
          Proposed operating base: {OPERATING_BASE.single}. Personal phone numbers and personal email addresses are not published.
        </p>
      </div>
    </MarketingShell>
  );
}
