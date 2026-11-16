const PASSPORT_CODE = /FP-(?:DEMO-)?\d{4}-\d{4}/i;

export function passportPath(id: string): string {
  return `/passport/${id}`;
}

export function passportUrl(id: string, origin = "http://localhost:3000"): string {
  const base = origin.replace(/\/$/, "");
  return `${base}${passportPath(id)}`;
}

export function parsePassportCode(input: string): string | null {
  const match = input.trim().match(PASSPORT_CODE);
  return match ? match[0].toUpperCase() : null;
}
