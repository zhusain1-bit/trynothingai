'use client'

export type CapturePillState = 'idle' | 'time-bound'

// Placeholder mock UI — not a real screenshot. See docs/superpowers/specs/
// 2026-08-19-landing-page-rebuild-design.md §5 for the spec this matches.
export function CapturePillMock({
  state = 'idle',
  timeLabel = '4:00 PM',
  placeholder = 'add a note (optional)',
  visible = true,
}: {
  state?: CapturePillState
  timeLabel?: string
  placeholder?: string
  visible?: boolean
}) {
  return (
    <div
      role="img"
      aria-label="Capture pill — placeholder mock of the nothing.ai capture UI"
      className="absolute left-1/2 flex items-center gap-2 rounded-full"
      style={{
        bottom: 80,
        transform: `translateX(-50%) translateY(${visible ? '0' : '8px'})`,
        opacity: visible ? 1 : 0,
        transition: 'opacity .3s ease, transform .3s ease',
        minWidth: 280,
        maxWidth: 420,
        height: 46,
        padding: '0 16px',
        background: 'rgba(31,31,31,0.96)',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.24)',
      }}
    >
      <span aria-hidden="true" style={{ width: 16, height: 16, borderRadius: 4, background: 'rgba(255,255,255,.35)', flexShrink: 0 }} />
      {state === 'time-bound' && (
        <span className="font-mono" style={{ fontSize: 12, color: '#F4B183', whiteSpace: 'nowrap' }}>
          {timeLabel} ·
        </span>
      )}
      <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {placeholder}
      </span>
      <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid rgba(255,255,255,.3)', flexShrink: 0 }} />
    </div>
  )
}
