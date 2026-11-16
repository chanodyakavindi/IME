export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede: string;
}) {
  return (
    <section className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {eyebrow ? <p className="text-sm font-semibold text-verified">{eyebrow}</p> : null}
        <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight text-navy">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{lede}</p>
      </div>
    </section>
  );
}
