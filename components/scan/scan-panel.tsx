"use client";

import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/data/store";
import { lookupPassport } from "@/lib/domain/passports";
import { parsePassportCode } from "@/lib/qr/links";
import { stopScannerSafely, type StoppableScanner } from "@/lib/qr/scanner";
import { Camera, ScanLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function ScanPanel() {
  const router = useRouter();
  const { state } = useStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const scannerRef = useRef<StoppableScanner | null>(null);
  const runId = useRef(0);

  useEffect(() => {
    return () => {
      runId.current += 1;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      void stopScannerSafely(scanner);
    };
  }, []);

  async function lookup(raw: string) {
    setLoading(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 350));
    const parsed = parsePassportCode(raw);
    if (!parsed) {
      setLoading(false);
      setError("Enter a passport code such as FP-DEMO-2026-0001.");
      return;
    }
    const result = lookupPassport(state, parsed);
    setLoading(false);
    if (!result.ok && result.reason === "not_found") {
      setError("No passport matches that code.");
      return;
    }
    if (!result.ok && result.reason === "not_published") {
      setError("That passport exists as a draft and is not public yet.");
      return;
    }
    router.push(`/passport/${parsed}`);
  }

  async function startCamera() {
    const run = runId.current + 1;
    runId.current = run;
    setCameraError("");
    setCameraOn(true);
    const previous = scannerRef.current;
    scannerRef.current = null;
    await stopScannerSafely(previous);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (run !== runId.current) return;
      let handled = false;
      const scanner = new Html5Qrcode("fixproof-qr-reader", false);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 8, qrbox: { width: 220, height: 220 } },
        (text) => {
          if (handled) return;
          const parsed = parsePassportCode(text);
          if (!parsed) return;
          handled = true;
          const current = scannerRef.current;
          scannerRef.current = null;
          setCameraOn(false);
          void stopScannerSafely(current).finally(() => {
            void lookup(parsed);
          });
        },
        () => undefined,
      );
      if (run !== runId.current) {
        const current = scannerRef.current;
        scannerRef.current = null;
        await stopScannerSafely(current);
      }
    } catch {
      const current = scannerRef.current;
      scannerRef.current = null;
      await stopScannerSafely(current);
      if (run === runId.current) {
        setCameraOn(false);
        setCameraError("Camera access is unavailable. Enter the passport code instead.");
      }
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-line p-5">
        <div className="flex items-center gap-2 text-navy">
          <Camera className="h-5 w-5" aria-hidden />
          <h2 className="font-semibold">QR scanner</h2>
        </div>
        <div id="fixproof-qr-reader" className="mt-4 min-h-56 overflow-hidden rounded-xl bg-canvas" />
        {cameraError ? <p className="mt-3 text-sm text-red-700" role="alert">{cameraError}</p> : null}
        <Button className="mt-4" type="button" onClick={() => void startCamera()} disabled={cameraOn || loading}>
          {cameraOn ? "Camera running" : "Start camera"}
        </Button>
        <p className="mt-3 text-xs leading-5 text-muted">If the browser blocks the camera, the manual code still works.</p>
      </section>
      <section className="rounded-2xl border border-line p-5">
        <div className="flex items-center gap-2 text-navy">
          <ScanLine className="h-5 w-5" aria-hidden />
          <h2 className="font-semibold">Passport code</h2>
        </div>
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void lookup(code);
          }}
        >
          <label className="block text-sm font-medium text-navy" htmlFor="passport-code">
            Enter a code
            <input
              id="passport-code"
              className="field mt-1.5"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="FP-DEMO-2026-0001"
              autoComplete="off"
            />
          </label>
          {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
          {loading ? <p className="text-sm text-muted" role="status">Looking up the passport…</p> : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" disabled={loading}>Open passport</Button>
            <Button type="button" variant="secondary" disabled={loading} onClick={() => void lookup("FP-DEMO-2026-0001")}>
              Use example code
            </Button>
          </div>
        </form>
        <p className="mt-4 text-sm text-muted">
          Or open the <Link href="/passport/FP-DEMO-2026-0001" className="font-semibold text-navy">example passport</Link> directly.
        </p>
      </section>
    </div>
  );
}
