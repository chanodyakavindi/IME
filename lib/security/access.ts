import type { AppArea, DemoRole } from "@/types";

export function areaForRole(role: DemoRole): AppArea {
  if (role === "technician") return "repair";
  if (role === "dealer") return "dealer";
  return "admin";
}

export function homePath(role: DemoRole): string {
  const area = areaForRole(role);
  if (area === "repair") return "/repair";
  if (area === "dealer") return "/dealer";
  return "/admin";
}

export function canAccess(role: DemoRole | null, area: AppArea): boolean {
  return role !== null && areaForRole(role) === area;
}

export function safeNextPath(value: string | null, role: DemoRole): string {
  const fallback = homePath(role);
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  const area: AppArea | null = value.startsWith("/repair")
    ? "repair"
    : value.startsWith("/dealer")
      ? "dealer"
      : value.startsWith("/admin")
        ? "admin"
        : null;
  if (!area || !canAccess(role, area)) return fallback;
  return value;
}
