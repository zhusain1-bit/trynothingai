export function Footer() {
  return (
    <footer
      className="w-full border-t mt-8 px-6 py-[56px] flex flex-col items-center gap-[28px]"
      style={{ borderColor: 'var(--hairline)' }}
      role="contentinfo"
    >
      {/* Wordmark */}
      <div className="font-mono font-medium tracking-[.28em] lowercase" style={{ fontSize: 13, color: 'var(--ghost)' }}>
        <span style={{ color: 'var(--mist)' }}>nothing</span>
        <span style={{ color: 'var(--phosphor)' }}>.ai</span>
      </div>

      {/* Manifesto */}
      <p
        className="text-center font-mono leading-[1.75] max-w-[400px]"
        style={{ fontSize: 11, color: 'var(--ghost2)' }}
      >
        your life happens in pictures, not words.<br />
        in moments, not generalizations.
      </p>

      {/* Sign-off */}
      <p className="font-mono" style={{ fontSize: 10.5, color: 'var(--ghost2)', letterSpacing: '0.08em' }}>
        the ai without a face.
      </p>

      {/* Links */}
      <nav className="flex gap-[24px]" aria-label="Footer links">
        {[
          { href: '#waitlist',                    label: 'join waitlist' },
          { href: 'mailto:hi@trynothingai.com',   label: 'contact' },
        ].map(link => (
          <a
            key={link.label}
            href={link.href}
            className="link-ghost font-mono"
            style={{ fontSize: 10.5, letterSpacing: '0.04em' }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <p className="font-mono" style={{ fontSize: 9.5, color: 'var(--ghost2)', opacity: 0.4 }}>
        © 2026 nothing.ai
      </p>
    </footer>
  )
}
