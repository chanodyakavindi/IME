export function maskIdentifier(last4: string): string {
  return `••••••••${digits(last4)}`;
}

export function maskSerial(last4: string): string {
  return `••••${digits(last4)}`;
}

function digits(last4: string): string {
  const clean = last4.replace(/\D/g, "").slice(-4);
  if (clean.length !== 4) {
    throw new Error("A public identifier can show only the last four digits.");
  }
  return clean;
}
