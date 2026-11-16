import { MarketingShell } from "@/components/layout/marketing-shell";
import { PageHero } from "@/components/marketing/page-hero";
import { ScanPanel } from "@/components/scan/scan-panel";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Scan a Passport" };

export default function ScanPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Public buyer"
        title="Scan a passport"
        lede="Buyers do not need an account. Use the camera or type a passport code. The example record is FP-DEMO-2026-0001."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ScanPanel />
      </div>
    </MarketingShell>
  );
}
