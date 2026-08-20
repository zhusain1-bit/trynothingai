import Link from 'next/link'
import { Reveal } from '@/components/apple/Reveal'

const COLUMNS = [
  { title: 'stored on your machine', body: "Screenshots are saved locally by default. You choose how long they're kept." },
  { title: 'never used for training', body: "What you capture is never used to train any model, ours or anyone else's." },
  { title: 'pause anytime', body: 'One toggle stops all capture. Block specific apps so it never sees them.' },
]

export function PrivacyColumns() {
  return (
    <section id="privacy" style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#F2EFE9' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <Reveal variant="light">
          <span className="font-mono" style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
            privacy
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontSize: 'clamp(26px,3.2vw,34px)',
              color: '#1A1A1A',
              marginTop: 8,
            }}
          >
            Your screen, your call.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ marginTop: 24 }}>
          {COLUMNS.map((c, i) => (
            <Reveal key={c.title} variant="light" panel index={i}>
              <div className="card-warm" style={{ background: '#FAF8F5', border: '1px solid #E5E0D8', borderRadius: 12, padding: 24, height: '100%' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 8, lineHeight: 1.6 }}>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal variant="light">
          <p style={{ fontSize: 13, color: '#6B6B6B', marginTop: 20, textAlign: 'center' }}>
            Captures are processed by a model provider and not retained after processing.{' '}
            <Link href="/privacy" className="link-warm" style={{ color: '#1A1A1A' }}>Full detail in our privacy policy.</Link>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
