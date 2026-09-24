import Link from 'next/link'
import { Reveal } from '@/components/apple/Reveal'
import { PLANS, formatPrice, perUnit } from '@/lib/pricing'

// Homepage summary — the full breakdown lives on /pricing.
export function PricingSection() {
  const plans = [PLANS.individual, PLANS.enterprise]
  return (
    <section id="pricing" style={{ padding: 'clamp(64px,10vw,120px) 24px', background: '#FAF8F5' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
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
            Simple pricing for everything you capture.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 28, textAlign: 'left' }}>
          {plans.map((p, i) => (
            <Reveal key={p.id} variant="light" panel index={i + 1}>
              <div
                className="card-warm"
                style={{
                  height: '100%',
                  background: i === 0 ? '#FFFFFF' : '#F2EFE9',
                  border: '1px solid #E5E0D8',
                  borderRadius: 14,
                  padding: 28,
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A1A1A' }}>{p.name}</h3>
                <p style={{ fontSize: 14, color: '#6B6B6B', marginTop: 2 }}>{p.descriptor}</p>
                <p style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <s style={{ fontSize: 16, color: '#9A958D' }}>{formatPrice(p.standardPrice)}</s>
                  <span style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif', fontSize: 40, lineHeight: 1, color: '#1A1A1A' }}>
                    {formatPrice(p.introPrice)}
                  </span>
                  <span style={{ fontSize: 13, color: '#6B6B6B' }}>{p.perUser ? '/ user / month' : '/ month'}</span>
                </p>
                <p style={{ fontSize: 13, color: '#6B6B6B', marginTop: 8 }}>
                  for your first {p.introMonths} months, then {formatPrice(p.standardPrice)}{perUnit(p)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal variant="light" index={3}>
          <div className="flex flex-wrap items-center justify-center" style={{ gap: 20, marginTop: 36 }}>
            <Link href="/download" className="btn-warm" style={{ display: 'inline-flex', padding: '14px 32px', fontSize: 15 }}>
              Download for Windows
            </Link>
            <Link href="/pricing" className="link-warm" style={{ fontSize: 15 }}>
              Compare plans
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
