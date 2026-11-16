const SCANNING = 2;
const PAUSED = 3;

export interface StoppableScanner {
  getState: () => number;
  stop: () => Promise<void>;
}

export async function stopScannerSafely(scanner: StoppableScanner | null): Promise<void> {
  if (!scanner) return;
  try {
    const state = scanner.getState();
    if (state !== SCANNING && state !== PAUSED) return;
    await scanner.stop();
  } catch {
    // html5-qrcode throws if stop() races a scanner that is not running.
  }
}
