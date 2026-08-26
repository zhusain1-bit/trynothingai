'use client'

// Placeholder mock UI — not a real screenshot, but matched to the real
// capture-pill screenshot (project name + camera icon + note icon; see
// NothingAI/Photos). The pill's main content is the project you're
// capturing into, not a note field — a small note icon lets you add one.
export function CapturePillMock({
  projectName = 'LinkedIn CRM Task3',
  visible = true,
}: {
  projectName?: string
  visible?: boolean
}) {
  return (
    <div
      role="img"
      aria-label={`Capture pill — placeholder mock of the nothing.ai capture UI, capturing into ${projectName}`}
      className="absolute left-1/2 flex items-center gap-2 rounded-full"
      style={{
        bottom: 16,
        transform: `translateX(-50%) translateY(${visible ? '0' : '12px'})`,
        opacity: visible ? 1 : 0,
        transition: 'opacity .35s var(--ease-warm), transform .35s var(--ease-warm)',
        minWidth: 280,
        maxWidth: 420,
        height: 46,
        padding: '0 16px',
        background: 'rgba(28,26,24,0.96)',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.24)',
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15" style={{ flexShrink: 0, color: 'var(--app-accent)' }}>
        <path
          d="M2 5.5A1.5 1.5 0 0 1 3.5 4h1.13a1 1 0 0 0 .87-.5l.3-.52A1 1 0 0 1 6.67 2.5h2.66a1 1 0 0 1 .87.48l.3.52a1 1 0 0 0 .87.5H12.5A1.5 1.5 0 0 1 14 5.5v6A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-6z"
          fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"
        />
        <circle cx="8" cy="8" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.1" />
      </svg>
      <span
        className="pill-chip-enter"
        style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.94)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {projectName}
      </span>
      <svg aria-hidden="true" viewBox="0 0 16 16" width="13" height="13" style={{ flexShrink: 0, color: 'rgba(255,255,255,.5)' }}>
        <rect x="2" y="3" width="12" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.1" />
        <path d="M5 7.5h6M5 9.5h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  )
}
