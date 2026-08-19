import { Reveal } from '@/components/apple/Reveal'

// Placeholder copy — final copy pending.
export function HighlightsRailMock() {
  return (
    <section style={{ padding: 'clamp(48px,8vw,96px) 24px', background: '#F2EFE9' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <Reveal variant="light">
          <div
            className="card-warm"
            style={{
              maxWidth: 420,
              margin: '0 auto',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 24px 48px -12px rgba(26,26,26,0.18)',
              background: '#0F0F0F',
              padding: 24,
            }}
          >
            <span className="font-mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#F4B183' }}>
              email → clipboard
            </span>
            <p style={{ fontSize: 14, color: '#E5E5E5', marginTop: 10, lineHeight: 1.5 }}>
              [Placeholder — screenshot an email, the reply&rsquo;s in your clipboard.]
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
