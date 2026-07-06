// Slim Apple-style global nav — static, scrolls away; LocalNav below is the sticky bar.
export function Nav() {
  return (
    <header
      className="flex items-center justify-between px-[24px]"
      style={{ height: 44, borderBottom: '1px solid var(--hairline)' }}
    >
      <a href="/" className="inline-flex items-center gap-[8px]" style={{ textDecoration: 'none' }}>
        {/* Ring + phosphor dot mark */}
        <svg viewBox="0 0 120 120" width="18" height="18" fill="none" aria-hidden="true">
          <circle cx="60" cy="60" r="44" stroke="#E9EBEF" strokeWidth="2.4" />
          <circle cx="60" cy="60" r="4" fill="#AEC2FF" />
        </svg>
        <span
          className="font-mono font-medium tracking-[.18em] lowercase"
          style={{ fontSize: 13, color: 'var(--mist)' }}
        >
          nothing.ai
        </span>
      </a>
      <a href="#waitlist" className="link-ghost" style={{ fontSize: 13, textDecoration: 'none' }}>
        join waitlist
      </a>
    </header>
  )
}
