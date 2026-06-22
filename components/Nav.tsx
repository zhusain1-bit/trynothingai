export function Nav() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3"
      style={{
        borderBottom: '1px solid var(--hairline)',
        background: 'rgba(10,11,13,.88)',
        backdropFilter: 'blur(20px) saturate(1.1)',
      }}
    >
      <div className="flex flex-col gap-[1px]">
        <a
          href="/"
          className="inline-flex items-center gap-[8px]"
          style={{ textDecoration: 'none' }}
        >
          {/* Ring + phosphor dot mark */}
          <svg viewBox="0 0 120 120" width="18" height="18" fill="none" aria-hidden="true">
            <circle cx="60" cy="60" r="44" stroke="#E9EBEF" strokeWidth="2.4"/>
            <circle cx="60" cy="60" r="4" fill="#AEC2FF"/>
          </svg>
          <span
            className="font-mono font-medium tracking-[.18em] lowercase"
            style={{ fontSize: 13, color: 'var(--mist)' }}
          >
            nothing.ai
          </span>
        </a>
        <span
          className="font-mono hidden sm:block"
          style={{ fontSize: 9.5, color: 'var(--ghost2)', letterSpacing: '0.04em', paddingLeft: 26 }}
        >
          the ai that lives in your copy and paste
        </span>
      </div>
      <a
        href="#waitlist"
        className="btn-phosphor"
        style={{ fontSize: 12, padding: '7px 14px' }}
      >
        join waitlist
      </a>
    </header>
  )
}
