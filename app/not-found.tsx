import { MarketingShell } from "@/components/layout/marketing-shell";
import { buttonClass } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm font-semibold text-verified">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-navy">That page is not available</h1>
        <p className="mt-3 text-sm leading-6 text-muted">The link may be out of date. You can return home or open a passport.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className={buttonClass("primary")}>Home</Link>
          <Link href="/scan" className={buttonClass("secondary")}>Scan a Passport</Link>
        </div>
      </div>
    </MarketingShell>
  );
}
