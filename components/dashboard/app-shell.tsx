"use client";

import { Logo } from "@/components/logo";
import { RoleGate, useSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import type { AppArea } from "@/types";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function AppShell({
  area,
  links,
  children,
}: {
  area: AppArea;
  links: { href: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <RoleGate area={area}>
      <ShellFrame links={links}>{children}</ShellFrame>
    </RoleGate>
  );
}

function ShellFrame({
  links,
  children,
}: {
  links: { href: string; label: string }[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, signOut } = useSession();

  return (
    <div className="min-h-screen bg-canvas">
      <div className="lg:flex">
        <aside className="no-print bg-navy text-white lg:min-h-screen lg:w-64">
          <div className="px-4 py-4">
            <Logo light />
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:block lg:space-y-1" aria-label="Workspace">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10",
                    active && "bg-white/15 text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="no-print flex items-center justify-between border-b border-line bg-white px-4 py-3 sm:px-6">
            <p className="text-sm text-muted">
              {session?.name}
              {session?.organisationName ? ` · ${session.organisationName}` : ""}
            </p>
            <button
              type="button"
              className="text-sm font-semibold text-navy"
              onClick={() => {
                signOut();
                router.push("/");
              }}
            >
              Sign out
            </button>
          </header>
          <main id="main" className="px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
