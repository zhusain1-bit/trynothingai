import Link from 'next/link'
import { Reveal } from '@/components/apple/Reveal'

export function PricingSection() {
  return (
    <section id="pricing" style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#FAF8F5' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <Reveal variant="light">
          <span className="font-mono" style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6B6B' }}>
            pricing
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-instrument-serif), Georgia, serif',
              fontSize: 'clamp(28px,4vw,40px)',
              color: '#1A1A1A',
              marginTop: 8,
            }}
          >
            Try it free. Then $9.99/mo.
          </h2>
        </Reveal>
        <Reveal variant="light" panel index={1}>
          <div
            className="card-warm"
            style={{ background: '#F2EFE9', border: '1px solid #E5E0D8', borderRadius: 14, padding: 32, marginTop: 28 }}
          >
            <p style={{ fontSize: 16, color: '#1A1A1A', lineHeight: 1.6 }}>
              <strong>10 free captures</strong> — genuinely try it, no card required.
              <br />
              After that, <strong>$9.99/mo</strong>. Cancel anytime.
            </p>
            <div style={{ marginTop: 20 }}>
              <Link href="/download" className="btn-warm" style={{ display: 'inline-flex', padding: '14px 32px', fontSize: 15 }}>
                Download for Windows
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
