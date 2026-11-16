"use client";

import { useStore } from "@/lib/data/store";
import { hashPrefix } from "@/lib/security/hash";
import { formatDateTime } from "@/lib/utils";

export function AuditTable() {
  const { state } = useStore();
  const rows = [...state.audits].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Audit log</h1>
      <p className="mb-4 mt-1 text-sm text-muted">Sample events plus actions taken in this browser. Hashes are shortened.</p>
      <div className="hidden overflow-x-auto rounded-xl border border-line bg-white lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-3">Event</th>
              <th className="px-3 py-3">Time</th>
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3">Action</th>
              <th className="px-3 py-3">Passport</th>
              <th className="px-3 py-3">Previous hash</th>
              <th className="px-3 py-3">New hash</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="px-3 py-3 font-medium">{row.id}</td>
                <td className="px-3 py-3">{formatDateTime(row.createdAt)}</td>
                <td className="px-3 py-3">{row.userName}</td>
                <td className="px-3 py-3">{row.action}</td>
                <td className="px-3 py-3">{row.passportId}</td>
                <td className="px-3 py-3">{hashPrefix(row.previousHash)}</td>
                <td className="px-3 py-3">{hashPrefix(row.recordHash)}</td>
                <td className="px-3 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-3 lg:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-xl border border-line bg-white p-4 text-sm">
            <p className="font-semibold text-navy">{row.action}</p>
            <p className="text-muted">{row.id} · {formatDateTime(row.createdAt)}</p>
            <p>{row.userName} · {row.passportId}</p>
            <p className="text-xs text-muted">Prev {hashPrefix(row.previousHash)} · New {hashPrefix(row.recordHash)} · {row.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
