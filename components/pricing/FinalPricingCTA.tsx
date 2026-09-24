import { Reveal } from '@/components/apple/Reveal'
import { PLANS, introLine } from '@/lib/pricing'
import { TrackedLink } from './TrackedLink'

export function FinalPricingCTA() {
  const ind = PLANS.individual
  const ent = PLANS.enterprise
  return (
    <section style={{ padding: 'clamp(96px, 14vw, 160px) 24px clamp(80px, 12vw, 140px)', textAlign: 'center' }}>
      <Reveal variant="light" panel>
        <h2
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontSize: 'clamp(34px, 5vw, 56px)',
            lineHeight: 1.05,
            color: '#1A1A1A',
          }}
        >
          Capture anything. Track what matters.
        </h2>
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-start justify-center"
          style={{ gap: 20, marginTop: 36, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}
        >
          <div className="flex flex-col flex-1" style={{ gap: 10 }}>
            <TrackedLink
              href={ind.cta.href}
              event="individual_cta_clicked"
              props={{ location: 'final_cta' }}
              className="btn-warm"
              style={{ padding: '15px 28px', fontSize: 15 }}
            >
              {ind.cta.label}
            </TrackedLink>
            <span style={{ fontSize: 12.5, color: '#6B6B6B' }}>{introLine(ind)}</span>
          </div>
          <div className="flex flex-col flex-1" style={{ gap: 10 }}>
            <TrackedLink
              href={ent.cta.href}
              event="enterprise_cta_clicked"
              props={{ location: 'final_cta' }}
              className="btn-warm-outline"
              style={{ padding: '15px 28px', fontSize: 15 }}
            >
              {ent.cta.label}
            </TrackedLink>
            <span style={{ fontSize: 12.5, color: '#6B6B6B' }}>{introLine(ent)}</span>
          </div>
        </div>
        <p style={{ marginTop: 56, fontWeight: 600, fontSize: 18, color: '#1A1A1A', letterSpacing: '-.01em' }}>nothing.ai</p>
      </Reveal>
    </section>
  )
}
