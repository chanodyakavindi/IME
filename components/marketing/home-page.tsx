import { DemoQr } from "@/components/qr/demo-qr";
import { buttonClass } from "@/components/ui/button";
import { PILOT_TARGETS } from "@/lib/copy";
import { PLAN_CATALOG } from "@/lib/pricing";
import { formatLkr } from "@/lib/utils";
import { CheckCircle2, ClipboardCheck, QrCode, ScanLine, ShieldCheck, Store, Wrench } from "lucide-react";
import Link from "next/link";

const steps = [
  { icon: ClipboardCheck, title: "Inspect", text: "A participating centre completes a guided checklist for the device in front of them." },
  { icon: ShieldCheck, title: "Record evidence", text: "Photos, test notes and invoice references are attached to that inspection." },
  { icon: QrCode, title: "Generate a QR passport", text: "The centre publishes a passport and prints a label for the device." },
  { icon: ScanLine, title: "Buyer scans", text: "A buyer opens the public record before deciding, without creating an account." },
];

export function HomePage() {
  return (
    <>
      <section className="border-b border-line bg-canvas">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <p className="text-sm font-semibold text-verified">Verified repair records</p>
            <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-navy sm:text-5xl sm:leading-tight">
              Buy with evidence. Sell with confidence.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              FixProof creates a portable digital record of repair and inspection information for pre-owned smartphones. Participating repair centres and dealers record evidence, and buyers scan a QR code before making a purchase.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/passport/FP-DEMO-2026-0001" className={buttonClass("primary", "lg")}>
                Explore a Passport
              </Link>
              <Link href="/partner-application" className={buttonClass("secondary", "lg")}>
                Become a Partner
              </Link>
            </div>
          </div>
          <PreviewCard />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-navy">A clearer history for pre-owned devices</h2>
        <p className="mt-3 max-w-3xl text-muted leading-7">
          Buyers often cannot verify repair claims. Records sit in paper job cards, chat threads and spreadsheets. Dealers need a simple way to show what was actually inspected. FixProof keeps one accessible record linked to a device.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Buyers", "See the available inspection summary, repair timeline and evidence before you pay."],
            ["Repair centres", "Make repair evidence portable, with a checklist, photos and a QR label."],
            ["Dealers", "Place a passport status beside a listing and share the public link."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-xl border border-line bg-white p-5">
              <h3 className="font-semibold text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <step.icon className="h-5 w-5 text-teal-200" aria-hidden />
                  <span className="text-sm text-slate-300">0{index + 1}</span>
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{step.text}</p>
              </li>
            ))}
          </ol>
          <Link href="/how-it-works" className="mt-8 inline-flex text-sm font-semibold text-teal-100">
            Read the full process
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-navy">Built for the people already in the trade</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Audience icon={Wrench} title="Repair centres" href="/repair-centres" text="Subscribe for the checklist, evidence timeline and QR labels. Passport activation is priced per device." />
          <Audience icon={Store} title="Used-phone dealers" href="/dealers" text="Link a published passport to stock and show buyers the record beside the listing." />
          <Audience icon={ScanLine} title="Pre-owned buyers" href="/scan" text="Buyer access is free. Scan a code or type it in. No account is required." />
        </div>
      </section>

      <section className="border-y border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-navy">Operational targets</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                These figures are planning targets for the service rollout. They are not results that have been achieved.
              </p>
            </div>
          </div>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PILOT_TARGETS.map((item) => (
              <div key={item.label} className="rounded-xl border border-line bg-white p-5">
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-navy">{item.value}</dd>
                <dd className="mt-2 text-xs font-semibold uppercase tracking-wide text-review">{item.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-navy">Planning prices</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Prices below are planning assumptions for the service. Buyer access stays free.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {PLAN_CATALOG.map((plan) => (
            <article key={plan.id} className="rounded-xl border border-line p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-navy">{plan.name}</h3>
                {plan.status === "planned" ? <span className="text-xs font-semibold uppercase text-review">Planned</span> : null}
              </div>
              <p className="mt-3 text-2xl font-semibold text-navy">{formatLkr(plan.monthlyLkr)} <span className="text-sm font-medium text-muted">/ month</span></p>
              {plan.perPassportLkr ? <p className="mt-1 text-sm text-muted">{formatLkr(plan.perPassportLkr)} per passport or inspection</p> : null}
            </article>
          ))}
        </div>
        <Link href="/pricing" className={buttonClass("secondary", "md", "mt-6")}>View pricing</Link>
      </section>

      <section className="bg-amber-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-semibold text-navy">What this record does not do</h2>
          <p className="mt-3 max-w-3xl leading-7 text-ink">
            FixProof records information submitted by participating partners. It does not guarantee ownership, future performance, safety or the absence of hidden defects. It is not a government, TRCSL or manufacturer certification, and it does not replace a professional inspection.
          </p>
          <Link href="/limitations" className="mt-4 inline-flex text-sm font-semibold text-navy">Read the limitations</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-navy">Create a clearer device history.</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">Trust the record, not just the claim. Start with a passport example or request a partner walkthrough.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/passport/FP-DEMO-2026-0001" className={buttonClass("primary", "lg")}>View the passport</Link>
          <Link href="/partner-application" className={buttonClass("secondary", "lg")}>Become a Partner</Link>
        </div>
      </section>
    </>
  );
}

function PreviewCard() {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-verified">FixProof Verified Record</p>
          <p className="mt-1 font-semibold text-navy">Apple iPhone 14</p>
          <p className="text-sm text-muted">FP-DEMO-2026-0001 · Public record</p>
        </div>
        <DemoQr value="https://fixproof.demo/passport/FP-DEMO-2026-0001" size={84} />
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        {[
          ["Status", "Verified"],
          ["Inspection", "12 August 2026"],
          ["Battery health", "91%"],
          ["Parts", "Battery replaced"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-canvas p-3">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-1 font-medium text-navy">{value}</dd>
          </div>
        ))}
      </dl>
      <ol className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
        <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-verified" aria-hidden /> Inspection published by ABC Mobile Care</li>
        <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-verified" aria-hidden /> Battery replacement recorded</li>
      </ol>
    </div>
  );
}

function Audience({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: typeof Wrench;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-line p-5">
      <Icon className="h-5 w-5 text-verified" aria-hidden />
      <h3 className="mt-4 text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{text}</p>
      <Link href={href} className="mt-4 text-sm font-semibold text-navy">Learn more</Link>
    </article>
  );
}
