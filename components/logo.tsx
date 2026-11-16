import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Logo({ light = false, href = "/" }: { light?: boolean; href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded-md font-semibold tracking-tight">
      <span className={cn("grid h-8 w-8 place-items-center rounded-lg", light ? "bg-white text-navy" : "bg-navy text-white")}>
        <ShieldCheck className="h-4 w-4" aria-hidden />
      </span>
      <span className={light ? "text-white" : "text-navy"}>FixProof</span>
    </Link>
  );
}
