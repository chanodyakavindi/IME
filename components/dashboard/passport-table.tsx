"use client";

import { StatusBadge } from "@/components/status-badge";
import { coverageLabel } from "@/lib/domain/metrics";
import { formatDate } from "@/lib/utils";
import type { DevicePassport, PassportStatus } from "@/types";
import Link from "next/link";
import { useState } from "react";

export function PassportTable({
  rows,
  hrefFor,
}: {
  rows: DevicePassport[];
  hrefFor: (id: string) => string;
}) {
  const [status, setStatus] = useState("all");
  const [brand, setBrand] = useState("all");
  const [month, setMonth] = useState("all");
  const [coverage, setCoverage] = useState("all");
  const brands = [...new Set(rows.map((row) => row.brand))].sort();
  const filtered = rows.filter((row) => {
    if (status !== "all" && row.status !== status) return false;
    if (brand !== "all" && row.brand !== brand) return false;
    if (month !== "all" && !row.inspectionDate.startsWith(month)) return false;
    const complete = row.evidenceCount >= 4;
    if (coverage === "complete" && !complete) return false;
    if (coverage === "incomplete" && complete) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Status" value={status} onChange={setStatus} options={["all", "verified", "draft", "correction_pending", "suspended"]} />
        <Select label="Brand" value={brand} onChange={setBrand} options={["all", ...brands]} />
        <Select label="Inspection month" value={month} onChange={setMonth} options={["all", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09"]} />
        <Select label="Evidence" value={coverage} onChange={setCoverage} options={["all", "complete", "incomplete"]} />
      </div>
      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-muted">No passports match these filters.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-line bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-3 font-medium">Passport</th>
                  <th className="px-3 py-3 font-medium">Device</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Inspection</th>
                  <th className="px-3 py-3 font-medium">Evidence</th>
                  <th className="px-3 py-3 font-medium">Updated</th>
                  <th className="px-3 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-line last:border-0">
                    <td className="px-3 py-3 font-medium text-navy">{row.id}</td>
                    <td className="px-3 py-3">{row.brand} {row.model}</td>
                    <td className="px-3 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-3 py-3">{formatDate(row.inspectionDate)}</td>
                    <td className="px-3 py-3">{coverageLabel(row.evidenceCount)}</td>
                    <td className="px-3 py-3">{formatDate(row.updatedAt)}</td>
                    <td className="px-3 py-3"><Link className="font-semibold text-navy" href={hrefFor(row.id)}>Open</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-3 md:hidden">
            {filtered.map((row) => (
              <li key={row.id} className="rounded-xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-navy">{row.brand} {row.model}</p>
                  <StatusBadge status={row.status} />
                </div>
                <p className="mt-1 text-xs text-muted">{row.id}</p>
                <p className="mt-2 text-sm text-muted">{formatDate(row.inspectionDate)} · Evidence {coverageLabel(row.evidenceCount)}</p>
                <Link className="mt-3 inline-flex text-sm font-semibold text-navy" href={hrefFor(row.id)}>Open</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="text-xs font-medium text-muted">
      {label}
      <select className="field mt-1" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option === "all" ? "All" : option.replaceAll("_", " ")}</option>
        ))}
      </select>
    </label>
  );
}

export type { PassportStatus };
