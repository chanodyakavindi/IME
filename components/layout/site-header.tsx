"use client";

import { Logo } from "@/components/logo";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const MARKETING_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/repair-centres", label: "For Repair Centres" },
  { href: "/dealers", label: "For Dealers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/scan", label: "Scan a Passport" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {MARKETING_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-canvas hover:text-navy",
                pathname === link.href && "bg-canvas text-navy",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/sign-in" className={buttonClass("ghost", "sm")}>
            Sign In
          </Link>
          <Link href="/partner-application" className={buttonClass("primary", "sm")}>
            Become a Partner
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-line px-4 py-3 lg:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {MARKETING_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block rounded-md px-3 py-2 text-sm font-medium" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/sign-in" className="block rounded-md px-3 py-2 text-sm font-medium" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            </li>
            <li className="pt-2">
              <Link href="/partner-application" className={buttonClass("primary", "md", "w-full")} onClick={() => setOpen(false)}>
                Become a Partner
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
