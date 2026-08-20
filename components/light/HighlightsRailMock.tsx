import { Reveal } from '@/components/apple/Reveal'
import { MockFrame } from './MockFrame'

export function HighlightsRailMock() {
  return (
    <section style={{ padding: 'clamp(48px,8vw,96px) 24px', background: '#F2EFE9' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <Reveal variant="light">
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <MockFrame chrome layered>
              <div style={{ width: '100%' }}>
                <span className="font-mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--app-accent)' }}>
                  email → clipboard
                </span>
                <p style={{ fontSize: 14, color: 'var(--app-text)', marginTop: 10, lineHeight: 1.5 }}>
                  Screenshot an email, the reply&rsquo;s in your clipboard.
                </p>
              </div>
            </MockFrame>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
