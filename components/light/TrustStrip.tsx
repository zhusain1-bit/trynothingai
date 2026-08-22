import { Reveal } from '@/components/apple/Reveal'

const SIGNALS = [
  { label: 'Signed installer' },
  { label: 'Auto-updates' },
  { label: 'No taskbar entry' },
  { label: 'Windows 10/11' },
]

export function TrustStrip() {
  return (
    <section style={{ padding: 'clamp(32px,5vw,56px) 24px', background: '#F2EFE9', borderTop: '1px solid #E5E0D8', borderBottom: '1px solid #E5E0D8' }}>
      <Reveal variant="light">
        <div
          className="flex flex-wrap items-center justify-center"
          style={{ maxWidth: 960, margin: '0 auto', gap: '12px 32px' }}
        >
          {SIGNALS.map(s => (
            <span key={s.label} className="font-mono flex items-center gap-2" style={{ fontSize: 12, color: '#6B6B6B' }}>
              <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} />
              {s.label}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
