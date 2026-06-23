export function ProblemSection() {
  return (
    <section
      className="w-full max-w-[640px] mx-auto px-4 text-center"
      aria-labelledby="problem-heading"
    >
      <span className="font-mono text-[11px] uppercase tracking-[.18em]" style={{ color: 'var(--ghost2)' }}>
        the problem
      </span>
      <h2
        id="problem-heading"
        className="mt-[12px] font-semibold tracking-tight leading-[1.2]"
        style={{ fontSize: 'clamp(22px,3.5vw,32px)', color: 'var(--mist)' }}
      >
        People screenshot things for a reason.<br className="hidden sm:block" /> And then they forget that reason.
      </h2>
      <p
        className="mt-[20px] leading-relaxed"
        style={{ fontSize: 'clamp(14px,1.6vw,15.5px)', color: 'var(--ghost)' }}
      >
        Everyone has thousands of dead screenshots — the show they meant to get tickets to, the jacket they meant to buy, the address they meant to save. The intent was real. It just got buried.
      </p>
    </section>
  )
}
