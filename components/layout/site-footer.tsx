import { Logo } from "@/components/logo";
import { OPERATING_BASE } from "@/lib/copy";
import Link from "next/link";

const groups = [
  {
    title: "Product",
    links: [
      ["/how-it-works", "How It Works"],
      ["/pricing", "Pricing"],
      ["/scan", "Scan a Passport"],
      ["/passport/FP-DEMO-2026-0001", "Passport"],
    ],
  },
  {
    title: "Partners",
    links: [
      ["/repair-centres", "Repair centres"],
      ["/dealers", "Dealers"],
      ["/partner-application", "Become a partner"],
      ["/sign-in", "Sign in"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["/limitations", "Limitations"],
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
      ["/about", "About"],
      ["/contact", "Contact"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-line bg-navy text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
            A verified digital repair and condition passport for the Sri Lankan pre-owned smartphone market.
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-300">{OPERATING_BASE.single}</p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-semibold text-white">{group.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {group.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs leading-5 text-slate-400 sm:px-6">
          FixProof is not a government, TRCSL or manufacturer certification, and it does not prove ownership or future performance.
        </p>
      </div>
    </footer>
  );
}
