"use client";

import { DemoQr, DownloadableQr } from "@/components/qr/demo-qr";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/session";
import { useStore } from "@/lib/data/store";
import { useOrigin } from "@/lib/hooks/use-origin";
import { passportUrl } from "@/lib/qr/links";
import { toast } from "sonner";

export function LabelBoard() {
  const { session } = useSession();
  const { state } = useStore();
  const origin = useOrigin();
  const rows = state.passports.filter((item) => item.organisationId === session?.organisationId && item.visibility === "public");

  if (rows.length === 0) {
    return <p className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-muted">No published passports are ready for labels.</p>;
  }

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">Sample and newly published labels for this centre.</p>
        <Button type="button" variant="secondary" onClick={() => window.print()}>Print QR labels</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((row) => {
          const url = passportUrl(row.id, origin);
          return (
            <article key={row.id} className="print-sheet rounded-xl border border-line bg-white p-4">
              <DemoQr value={url} size={132} />
              <div className="hidden"><DownloadableQr value={url} canvasId={`qr-${row.id}`} /></div>
              <h2 className="mt-3 font-semibold text-navy">{row.id}</h2>
              <p className="text-sm text-muted">{row.brand} {row.model}</p>
              <p className="text-xs text-muted">Identifier ••••••••{row.identifierLast4}</p>
              <Button
                className="no-print mt-3"
                size="sm"
                variant="secondary"
                type="button"
                onClick={() => {
                  const canvas = document.getElementById(`qr-${row.id}`);
                  if (!(canvas instanceof HTMLCanvasElement)) return;
                  const link = document.createElement("a");
                  link.href = canvas.toDataURL("image/png");
                  link.download = `${row.id}.png`;
                  link.click();
                  toast.success("QR downloaded");
                }}
              >
                Download QR
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
