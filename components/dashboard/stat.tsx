import type { ReactNode } from "react";

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <article className="rounded-xl border border-line bg-white p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-navy">{value}</p>
      {hint ? <p className="mt-1 text-xs font-medium text-review">{hint}</p> : null}
    </article>
  );
}

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
