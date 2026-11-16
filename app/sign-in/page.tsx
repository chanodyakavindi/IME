"use client";

import { MarketingShell } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNTS, useSession } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/security/access";
import type { DemoRole } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <MarketingShell>
      <Suspense fallback={<p className="px-6 py-16 text-sm text-muted">Loading sign in…</p>}>
        <SignInForm />
      </Suspense>
    </MarketingShell>
  );
}

function SignInForm() {
  const { signIn } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");

  function enter(role: DemoRole) {
    signIn(role);
    router.push(safeNextPath(next, role));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-navy">Sign in to your workspace</h1>
      <p className="mt-3 text-muted">Choose a role. There is no password, and nothing here is a production account.</p>
      <div className="mt-8 grid gap-4">
        {DEMO_ACCOUNTS.map((account) => (
          <article key={account.role} className="flex flex-col justify-between gap-4 rounded-xl border border-line p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-navy">{label(account.role)}</h2>
              <p className="text-sm text-muted">{account.name}{account.organisationName ? ` · ${account.organisationName}` : " · Platform"}</p>
            </div>
            <Button type="button" onClick={() => enter(account.role)}>Continue</Button>
          </article>
        ))}
      </div>
    </div>
  );
}

function label(role: DemoRole): string {
  if (role === "technician") return "Repair-centre workspace";
  if (role === "dealer") return "Dealer workspace";
  return "Admin workspace";
}
